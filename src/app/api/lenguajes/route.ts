const lenguajes = [
  {
    id: 1,
    nombre: "Java",
    creador: "James Gosling",
    anio: 1995,
  },
  {
    id: 2,
    nombre: "Python",
    creador: "Guido van Rossum",
    anio: 1991,
  },
  {
    id: 3,
    nombre: "JavaScript",
    crador: "Brendan Eich",
    anio: 1995,
  },
];

export function GET() {
  return Response.json(lenguajes);
}
