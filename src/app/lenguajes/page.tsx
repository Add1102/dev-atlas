"use client";

import { useEffect, useState } from "react";

interface Lenguaje {
  id: number;
  nombre: string;
  creador: string;
  anio: number;
}

export default function LenguajesPage() {
  const [lenguajes, setLenguajes] = useState<Lenguaje[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function obtenerLenguajes() {
      try {
        const respuesta = await fetch("/api/lenguajes");
        if (!respuesta.ok) {
          throw new Error("No se puedieron obtener los lenguajes");
        }
        const datos: Lenguaje[] = await respuesta.json();
        setLenguajes(datos);
      } catch {
        setError("Ocurrio un error al consultar la API.");
      } finally {
        setCargando(false);
      }
    }
    obtenerLenguajes();
  }, []);

  if (cargando) {
    return <p>Cargando lenguajes....</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }
  return (
    <main>
      <h1>Lenguajes de programacion</h1>
      {lenguajes.map((lenguaje) => (
        <article key={lenguaje.id}>
          <h2>{lenguaje.nombre}</h2>
          <p>Creador: {lenguaje.creador}</p>
          <p>Año: {lenguaje.anio}</p>
        </article>
      ))}
    </main>
  );
}
