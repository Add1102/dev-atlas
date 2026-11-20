"use client";

import { firebaseAuth } from "@/lib/firebaseConfig";
import { signOut } from "firebase/auth";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const languages = [
  {
    initials: "TS",
    name: "TypeScript",
    slug: "ts-static-typed",
    category: "Desarrollo Web & Fullstack",
    groups: ["web"],
    typing: "Estático / Multiparadigma",
    version: "v5.4.3",
    published: true,
    color: "#818CF8",
  },
  {
    initials: "PY",
    name: "Python",
    slug: "python-interpreted",
    category: "Data Science / Backend",
    groups: ["data", "backend"],
    typing: "Dinámico / Orientado a Objetos",
    version: "v3.12.2",
    published: true,
    color: "#7bd0ff",
  },
  {
    initials: "GO",
    name: "Go (Golang)",
    slug: "golang-systems",
    category: "Backend / Microservicios",
    groups: ["backend"],
    typing: "Estático / Concurrente",
    version: "v1.22.1",
    published: true,
    color: "#7bd0ff",
  },
  {
    initials: "RS",
    name: "Rust",
    slug: "rust-memory-safe",
    category: "Sistemas / WebAssembly",
    groups: ["backend"],
    typing: "Estático / Sin Garbage Collector",
    version: "v1.77.0",
    published: true,
    color: "#F59E0B",
  },
  {
    initials: "JV",
    name: "Java",
    slug: "java-jvm-enterprise",
    category: "Enterprise / Android",
    groups: ["backend", "mobile"],
    typing: "Estático / Orientado a Objetos",
    version: "v21 LTS",
    published: false,
    color: "#7bd0ff",
  },
  {
    initials: "JS",
    name: "JavaScript",
    slug: "javascript-ecmascript",
    category: "Desarrollo Web / Runtime Node",
    groups: ["web"],
    typing: "Dinámico / Prototípico",
    version: "ES2023",
    published: true,
    color: "#F59E0B",
  },
];

type Language = (typeof languages)[number];

const columns = [
  "Lenguaje",
  "Categoría Principal",
  "Tipado / Paradigma",
  "Estado en API",
  "Versión",
  "Acciones",
];
const container = "mx-auto w-full max-w-[1440px] px-margin-mobile md:px-margin";
const mono = "font-label-code text-label-code";
const field =
  "min-w-0 rounded-lg border border-outline-variant/40 bg-surface-container-lowest px-3 py-2 text-body-sm focus:border-primary focus:outline-none";
const primary =
  "inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-label-ui text-on-primary hover:bg-primary-fixed";

function Icon({ name }: { name: string }) {
  return (
    <span aria-hidden="true" className="material-symbols-outlined text-[18px]">
      {name}
    </span>
  );
}

export default function Dashboard() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [category, setCategory] = useState("all");
  const [editing, setEditing] = useState<Language>();
  const [formVersion, setFormVersion] = useState(0);
  const [message, setMessage] = useState("");
  const search = useRef<HTMLInputElement>(null);
  const drawer = useRef<HTMLDialogElement>(null);

  const visibleLanguages = languages.filter((language) => {
    const searchable =
      `${language.name} ${language.slug} ${language.category}`.toLowerCase();
    const matchesStatus =
      status === "all" ||
      status === (language.published ? "published" : "draft");
    const matchesCategory =
      category === "all" || language.groups.includes(category);
    return (
      searchable.includes(query.trim().toLowerCase()) &&
      matchesStatus &&
      matchesCategory
    );
  });

  useEffect(() => {
    function focusSearch(event: KeyboardEvent) {
      if (
        (event.ctrlKey || event.metaKey) &&
        event.key.toLowerCase() === "k" &&
        !drawer.current?.open
      ) {
        event.preventDefault();
        search.current?.focus();
      }
    }

    window.addEventListener("keydown", focusSearch);
    return () => window.removeEventListener("keydown", focusSearch);
  }, []);

  function openDrawer(language?: Language) {
    setEditing(language);
    setFormVersion((version) => version + 1);
    setMessage("");
    drawer.current?.showModal();
  }

  async function handleLogout() {
    try {
      await signOut(firebaseAuth);
    } catch (error) {
      console.error("Error al cerrar sesion: ", error);
    }
  }

  return (
    <div className="flex min-h-screen flex-col font-body-md text-body-md">
      <header className="sticky top-0 z-40 border-b border-outline-variant/30 bg-surface-dim/80 backdrop-blur-md">
        <div
          className={`${container} flex h-16 items-center justify-between gap-2`}
        >
          <div className="flex items-center gap-2 sm:gap-4">
            <Link
              href="/"
              className="flex items-center gap-1 text-base font-semibold sm:gap-2 sm:text-headline-sm"
            >
              <span className="text-primary">
                <Icon name="terminal" />
              </span>{" "}
              DevAtlas
            </Link>
            <span
              className={`${mono} whitespace-nowrap rounded-lg border border-outline-variant/40 bg-surface-container px-1.5 py-0.5 text-[10px] text-secondary sm:px-2 sm:text-label-code`}
            >
              <span className="mr-1.5 inline-block size-1.5 animate-pulse rounded-full bg-secondary" />
              Admin Console
            </span>
          </div>
          <nav
            aria-label="Administración"
            className="hidden items-center gap-6 text-label-ui text-on-surface-variant lg:flex"
          >
            <a href="#dashboard">Dashboard</a>
            <a
              href="#languages"
              aria-current="location"
              className="border-b-2 border-primary pb-1 text-primary"
            >
              Gestión de Lenguajes
            </a>
            <a href="#metrics">Métricas de API</a>
          </nav>
          <div className="flex items-center gap-4">
            <div className="hidden items-center gap-2 rounded-lg border border-outline-variant/20 bg-surface-container-low px-2 py-1 sm:flex">
              <span
                className={`${mono} rounded-lg bg-primary-container p-1.5 font-bold text-on-primary-container`}
              >
                DA
              </span>
              <div className="text-label-ui">
                <p>root@devatlas.io</p>
                <p className="font-label-code text-[10px] text-outline">
                  Superadmin · Demo
                </p>
              </div>
            </div>
            <button
              id="dashboard-logout"
              type="button"
              aria-label="Cerrar sesión"
              onClick={() => void handleLogout()}
              className="flex items-center gap-1.5 rounded-lg border border-outline-variant/30 px-2 py-1.5 text-label-ui text-on-surface-variant disabled:opacity-60 hover:cursor-pointer"
            >
              <Icon name="logout" />
              <span className="hidden sm:inline">Cerrar sesión</span>
            </button>
          </div>
        </div>
      </header>

      <main
        id="dashboard"
        className={`${container} flex flex-1 scroll-mt-16 flex-col gap-6 py-6`}
      >
        <div className="flex flex-col justify-between gap-4 border-b border-outline-variant/20 pb-6 md:flex-row md:items-end">
          <div>
            <p className={`${mono} text-outline`}>
              /dashboard / <span className="text-primary">languages</span>
            </p>
            <h1
              id="languages"
              className="mt-1 scroll-mt-20 text-headline-xl-mobile md:text-headline-xl"
            >
              Gestión de Lenguajes de Programación
            </h1>
            <p className="mt-1 text-on-surface-variant">
              Explora el catálogo de ejemplo y prueba el formulario de gestión
              de lenguajes.
            </p>
          </div>
          <div>
            <button
              type="button"
              className={`${primary} whitespace-nowrap`}
              onClick={() => openDrawer()}
            >
              <Icon name="add" /> Nuevo Lenguaje
            </button>
          </div>
        </div>

        <div className="flex flex-col justify-between gap-4 rounded-xl border border-outline-variant/20 bg-surface-container-low p-4 xl:flex-row xl:items-center">
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative w-full sm:w-60">
              <span className="pointer-events-none absolute left-3 top-2 text-outline">
                <Icon name="search" />
              </span>
              <input
                ref={search}
                type="search"
                aria-label="Buscar lenguajes"
                placeholder="Buscar por nombre o runtime..."
                className={`${field} w-full pl-9 pr-12`}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
              <kbd className="pointer-events-none absolute right-2 top-2.5 rounded bg-surface-container-high px-1.5 font-label-code text-[10px] text-outline">
                ⌘K
              </kbd>
            </div>
            <select
              aria-label="Estado"
              className={field}
              value={status}
              onChange={(event) => setStatus(event.target.value)}
            >
              <option value="all">Estado: Todos</option>
              <option value="published">Publicado</option>
              <option value="draft">Borrador</option>
            </select>
            <select
              aria-label="Categoría"
              className={field}
              value={category}
              onChange={(event) => setCategory(event.target.value)}
            >
              <option value="all">Categoría: Todas</option>
              <option value="web">Desarrollo Web</option>
              <option value="backend">Backend &amp; Sistemas</option>
              <option value="mobile">Móvil</option>
              <option value="data">Data Science / ML</option>
            </select>
          </div>
          <div
            className={`${mono} flex flex-wrap gap-2 border-t border-outline-variant/20 pt-2 xl:border-0 xl:pt-0`}
          >
            <span className="flex items-center gap-1.5 rounded border border-outline-variant/30 bg-surface-container px-2.5 py-1">
              <Icon name="dataset" /> 24 Lenguajes totales (demo)
            </span>
            <span className="flex items-center gap-1.5 rounded border border-outline-variant/30 bg-surface-container px-2.5 py-1 text-tertiary">
              <Icon name="sync" /> 100% Sincronizados (demo)
            </span>
            <span className="flex items-center gap-1.5 rounded border border-outline-variant/30 bg-surface-container px-2.5 py-1 text-outline">
              <Icon name="schedule" /> Última actualización hace 12m
            </span>
          </div>
        </div>

        <section
          aria-label="Catálogo de lenguajes"
          className="overflow-hidden rounded-xl border border-outline-variant/30 bg-surface-container-lowest"
        >
          <div
            className="custom-scroll overflow-x-auto"
            tabIndex={0}
            role="region"
            aria-label="Tabla de lenguajes con desplazamiento horizontal"
          >
            <table className="w-full min-w-[850px] text-left text-body-sm">
              <thead className="border-b border-outline-variant/30 bg-surface-container-low">
                <tr>
                  {columns.map((column) => (
                    <th
                      scope="col"
                      key={column}
                      className={`${mono} px-4 py-3 uppercase text-outline last:text-right`}
                    >
                      {column}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/20">
                {visibleLanguages.map((language) => (
                  <tr
                    key={language.slug}
                    className="hover:bg-surface-container/60"
                  >
                    <th scope="row" className="px-4 py-3.5 font-normal">
                      <div className="flex items-center gap-2">
                        <span
                          style={{ color: language.color }}
                          className="grid size-8 shrink-0 place-items-center rounded-lg border border-current/40 bg-surface-container-high font-label-code font-bold"
                        >
                          {language.initials}
                        </span>
                        <div>
                          <strong className="block">{language.name}</strong>
                          <span className="font-label-code text-[11px] text-outline">
                            slug: /{language.slug}
                          </span>
                        </div>
                      </div>
                    </th>
                    <td className="px-4 py-3.5">
                      <span className="rounded border border-outline-variant/30 bg-surface-container-high px-2 py-0.5 text-xs">
                        {language.category}
                      </span>
                    </td>
                    <td
                      className={`${mono} px-4 py-3.5 text-on-surface-variant`}
                    >
                      {language.typing}
                    </td>
                    <td className="px-4 py-3.5">
                      <span
                        className={`${mono} inline-flex items-center gap-1.5 rounded-full border border-current/30 px-2 py-0.5 ${language.published ? "bg-tertiary-container/20 text-tertiary" : "bg-outline-variant/30 text-outline"}`}
                      >
                        <span className="size-1.5 rounded-full bg-current" />
                        {language.published ? "Publicado" : "Borrador"}
                      </span>
                    </td>
                    <td className={`${mono} px-4 py-3.5`}>
                      {language.version}
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <div className="inline-flex gap-1">
                        <button
                          type="button"
                          disabled
                          aria-label="Ver en producción"
                          className="p-1.5 text-outline opacity-60"
                        >
                          <Icon name="open_in_new" />
                        </button>
                        <button
                          type="button"
                          aria-label={`Editar ${language.name}`}
                          className="rounded p-1.5 text-secondary hover:bg-surface-container-high"
                          onClick={() => openDrawer(language)}
                        >
                          <Icon name="edit" />
                        </button>
                        <button
                          type="button"
                          disabled
                          aria-label="Eliminar"
                          className="p-1.5 text-error opacity-60"
                        >
                          <Icon name="delete" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {visibleLanguages.length === 0 && (
                  <tr>
                    <td colSpan={columns.length} className="p-4 text-outline">
                      No se encontraron lenguajes.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div
            className={`${mono} flex flex-col items-center justify-between gap-2 border-t border-outline-variant/20 bg-surface-container-low px-4 py-3 text-outline sm:flex-row`}
          >
            <span>
              Mostrando{" "}
              <strong className="text-on-surface">
                {visibleLanguages.length}
              </strong>{" "}
              de {languages.length} registros de ejemplo
            </span>
            <div
              aria-label="Paginación de muestra"
              className="flex flex-wrap justify-center gap-2"
            >
              {["Anterior", "1", "2", "3", "Siguiente"].map((label) => (
                <button
                  type="button"
                  key={label}
                  disabled
                  aria-current={label === "1" ? "page" : undefined}
                  className="rounded border border-outline-variant/30 bg-surface-container px-2 py-1 opacity-50 aria-[current=page]:text-primary aria-[current=page]:opacity-100"
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </section>
        {message && (
          <p role="status" className="text-body-sm text-tertiary">
            {message}
          </p>
        )}
      </main>

      <dialog
        ref={drawer}
        aria-labelledby="drawer-title"
        className="fixed inset-y-0 right-0 left-auto m-0 h-dvh max-h-none w-full max-w-2xl border-l border-outline-variant/40 bg-surface-container-lowest text-on-surface shadow-2xl backdrop:bg-surface-dim/80 backdrop:backdrop-blur-sm open:flex open:flex-col"
      >
        <div className="flex items-center justify-between gap-2 border-b border-outline-variant/30 bg-surface-container-low p-4">
          <div>
            <p className={`${mono} text-primary`}>
              {editing ? "PUT" : "POST"} /api/v1/languages · Demo
            </p>
            <h2 id="drawer-title" className="text-headline-md">
              {editing
                ? `Editar Lenguaje: ${editing.name}`
                : "Crear Nuevo Lenguaje"}
            </h2>
          </div>
          <button
            type="button"
            aria-label="Cerrar formulario"
            className="p-2 text-outline hover:text-on-surface"
            onClick={() => drawer.current?.close()}
          >
            <Icon name="close" />
          </button>
        </div>
        <form
          key={formVersion}
          id="language-form"
          className="custom-scroll flex-1 space-y-4 overflow-y-auto p-4 text-body-sm sm:p-6"
          onSubmit={(event) => {
            event.preventDefault();
            drawer.current?.close();
            setMessage(
              "Formulario de demostración completado. El catálogo conserva sus datos de ejemplo.",
            );
          }}
        >
          <div className="grid gap-4 sm:grid-cols-3">
            <label className="grid gap-1.5 sm:col-span-2">
              Nombre del lenguaje
              <input
                required
                className={field}
                defaultValue={editing?.name}
                placeholder="Ej: TypeScript, Rust, Kotlin..."
              />
            </label>
            <label className="grid gap-1.5">
              Versión registrada
              <input
                className={field}
                defaultValue={editing?.version}
                placeholder="Ej: v1.75.0"
              />
            </label>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-1.5">
              Categoría principal
              <select
                className={field}
                defaultValue={editing?.groups[0] ?? "web"}
              >
                <option value="web">Desarrollo Web</option>
                <option value="backend">Backend &amp; Sistemas</option>
                <option value="mobile">Móvil (Android / iOS)</option>
                <option value="data">Data Science &amp; ML</option>
                <option value="devops">DevOps &amp; Scripting</option>
              </select>
            </label>
            <label className="grid gap-1.5">
              Tipado / Paradigma
              <input
                className={field}
                defaultValue={editing?.typing}
                placeholder="Ej: Estático fuerte / Multiparadigma"
              />
            </label>
          </div>
          <label className="grid gap-1.5">
            Descripción concisa
            <textarea
              className={field}
              rows={3}
              placeholder="Resumen arquitectónico, origen y ventajas del lenguaje..."
            />
          </label>
          <fieldset className="rounded-lg border border-outline-variant/40 bg-surface-container p-3">
            <legend>Casos de uso clave</legend>
            <div className={`${mono} flex flex-wrap gap-2`}>
              {["Microservicios", "Cloud Infrastructure", "APIs RESTful"].map(
                (example) => (
                  <span
                    key={example}
                    className="rounded bg-surface-container-high px-2 py-1"
                  >
                    {example}
                  </span>
                ),
              )}
            </div>
          </fieldset>
          <div className="grid gap-4 md:grid-cols-2">
            <fieldset className="grid gap-2 rounded-lg border border-outline-variant/30 p-3">
              <legend className="text-tertiary">Ventajas (Pros)</legend>
              <input
                aria-label="Primera ventaja"
                className={field}
                defaultValue="Concurrencia nativa vía goroutines"
              />
              <input
                aria-label="Segunda ventaja"
                className={field}
                defaultValue="Compilación ultrarrápida a binario"
              />
            </fieldset>
            <fieldset className="grid gap-2 rounded-lg border border-outline-variant/30 p-3">
              <legend className="text-error">Desventajas (Contras)</legend>
              <input
                aria-label="Primera desventaja"
                className={field}
                defaultValue="Sintaxis de manejo de errores repetitiva"
              />
              <input
                aria-label="Segunda desventaja"
                className={field}
                defaultValue="Sistema de genéricos con ciertas limitaciones"
              />
            </fieldset>
          </div>
          <div className="rounded-xl border-2 border-dashed border-outline-variant/40 bg-surface-container/50 p-4 text-center">
            <span className="text-primary">
              <Icon name="cloud_upload" />
            </span>
            <p>Logotipo / Isotipo del Lenguaje</p>
            <p className={`${mono} text-outline`}>
              Vista previa de ejemplo · icon_preview_512.svg (24.8 KB)
            </p>
          </div>
        </form>
        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-outline-variant/30 bg-surface-container-low p-4">
          <p className={`${mono} text-outline`}>Catálogo de ejemplo</p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className="rounded-lg border border-outline-variant/40 px-4 py-2 text-label-ui"
              onClick={() => drawer.current?.close()}
            >
              Cancelar
            </button>
            <button form="language-form" type="submit" className={primary}>
              <Icon name="save" /> Guardar (demo)
            </button>
          </div>
        </div>
      </dialog>

      <footer
        id="metrics"
        className="border-t border-outline-variant/20 bg-surface-container-lowest"
      >
        <div
          className={`${container} flex flex-wrap items-center justify-between gap-4 py-space-xl`}
        >
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-headline-sm">DevAtlas</span>
            <span className="text-body-sm text-on-surface-variant">
              © 2025 DevAtlas. Built for deterministic developer ergonomics.
            </span>
          </div>
          <div
            className={`${mono} flex flex-wrap items-center gap-2 rounded border border-outline-variant/30 bg-surface-container-high/60 px-3 py-1`}
          >
            <span className="size-2 animate-pulse rounded-full bg-tertiary" />
            <span className="text-tertiary">API REST v1.4: 200 OK (demo)</span>
            <span className="text-outline">Latencia: 24ms</span>
          </div>
          <div
            className={`${mono} flex flex-wrap gap-4 text-on-surface-variant`}
          >
            {[
              "Documentación",
              "Comunidad",
              "Roadmap",
              "API",
              "GitHub",
              "Términos y Privacidad",
            ].map((label) => (
              <span key={label}>{label}</span>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
