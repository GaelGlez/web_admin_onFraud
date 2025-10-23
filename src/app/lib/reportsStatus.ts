import { Reports } from "@/types/ReportsDTO";

// Ajusta estos IDs si tu backend usa otros
export const APPROVED_ID = 2;
export const REJECTED_ID = 3;
// Si tu API tiene un estado "Cerrado" explícito con ID propio, ponlo aquí; si no, puedes ignorarlo
export const CLOSED_ID = undefined as unknown as number;

const CLOSED_SET = new Set([
  "aprobado",
  "rechazado",
  "cerrado",
  "finalizado",
  "approved",
  "rejected",
  "closed",
  "resolved",
  "done",
  "completed",
]);

export function norm(name?: string | null) {
  return (name ?? "").trim().toLowerCase();
}

export function isClosed(r: Reports): boolean {
  const statusId =
    (r as any)?.status?.id ??
    (r as any)?.status_id ??
    undefined;

  if (statusId === APPROVED_ID || statusId === REJECTED_ID) return true;
  if (CLOSED_ID !== undefined && statusId === CLOSED_ID) return true;

  const statusName =
    (r as any)?.status?.name ??
    (r as any)?.status_name ??
    "";

  return CLOSED_SET.has(norm(String(statusName)));
}

export function nameById(id: number) {
  if (id === APPROVED_ID) return "Aprobado";
  if (id === REJECTED_ID) return "Rechazado";
  if (CLOSED_ID !== undefined && id === CLOSED_ID) return "Cerrado";
  return "Cerrado";
}
