export interface StateRecord {
  name: string;
  count: number;
  highlight: boolean;
}

/**
 * Estados de México con registros de fásmidos (placeholder).
 *
 * Vive fuera del componente porque el mapa es `"use client"` y la home, que es
 * de servidor, necesita el array real para totalizar: importarlo desde un
 * módulo cliente devuelve una referencia, no los datos.
 */
export const MEXICO_STATES_WITH_RECORDS: StateRecord[] = [
  { name: "Chiapas", count: 32, highlight: true },
  { name: "Veracruz", count: 28, highlight: true },
  { name: "Oaxaca", count: 24, highlight: true },
  { name: "Guerrero", count: 18, highlight: false },
  { name: "Jalisco", count: 14, highlight: false },
  { name: "Michoacán", count: 12, highlight: false },
  { name: "Tabasco", count: 11, highlight: false },
  { name: "Hidalgo", count: 9, highlight: false },
  { name: "Puebla", count: 8, highlight: false },
  { name: "Quintana Roo", count: 7, highlight: false },
  { name: "Yucatán", count: 6, highlight: false },
  { name: "Campeche", count: 5, highlight: false },
];
