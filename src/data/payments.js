import { get } from "../api";

const payments = [];
let sequence = 1;

export async function fetchPayments(filters) {
  const search = new URLSearchParams();
  const source = filters && typeof filters === "object" ? filters : {};
  if (source.wholesalerId !== undefined && source.wholesalerId !== null && source.wholesalerId !== "") {
    search.set("wholesalerId", String(source.wholesalerId));
  }
  const hasMonth = source.month !== undefined && source.month !== null && source.month !== "";
  const hasYear = source.year !== undefined && source.year !== null && source.year !== "";
  if (hasMonth && hasYear) {
    search.set("month", String(source.month));
    search.set("year", String(source.year));
  }
  if (source.page !== undefined && source.page !== null && source.page !== "") {
    search.set("page", String(source.page));
  }
  if (source.size !== undefined && source.size !== null && source.size !== "") {
    search.set("size", String(source.size));
  }
  const query = search.toString();
  const data = await get(query ? `/payments?${query}` : "/payments");
  const body = data && typeof data === "object" && !Array.isArray(data) ? data : {};
  const items = Array.isArray(body.content) ? body.content : [];
  return {
    items,
    page: Number(body.number) || 0,
    size: Number(body.size) || items.length,
    totalElements: Number(body.totalElements) || 0,
    totalPages: Number(body.totalPages) || 0,
  };
}

export async function fetchPayment(id) {
  const data = await get(`/payments/${id}`);
  if (!data || typeof data !== "object" || Array.isArray(data)) return null;
  return data;
}

export async function fetchWholesalerPayments(wholesalerId) {
  const size = 100;
  const first = await fetchPayments({ wholesalerId, page: 0, size });
  const items = first.items.filter((row) => String(row.wholesalerId) === String(wholesalerId));
  for (let page = 1; page < first.totalPages; page += 1) {
    const next = await fetchPayments({ wholesalerId, page, size });
    next.items.forEach((row) => {
      if (String(row.wholesalerId) === String(wholesalerId)) items.push(row);
    });
  }
  return items;
}

export const PAYMENT_METHODS = [
  { value: "CASH", label: "Cash" },
  { value: "UPI", label: "UPI" },
  { value: "BANK_TRANSFER", label: "Bank transfer" },
  { value: "CHEQUE", label: "Cheque" },
];

function copy(payment) {
  return { ...payment };
}

export function listPayments() {
  return payments.map(copy);
}

export function getPayment(id) {
  const found = payments.find((payment) => String(payment.id) === String(id));
  return found ? copy(found) : null;
}

export function createPayment(payment) {
  const now = new Date();
  const stamp = String(payment.paymentDate || "").replace(/-/g, "") || "00000000";
  const next = {
    ...payment,
    id: `PAY-${stamp}-${String(sequence).padStart(3, "0")}`,
    recordedBy: "Admin",
    recordedAt: now.toISOString(),
  };
  sequence += 1;
  payments.unshift(next);
  return copy(next);
}

export function updatePayment(id, patch) {
  const index = payments.findIndex((payment) => String(payment.id) === String(id));
  if (index === -1) return null;
  payments[index] = { ...payments[index], ...patch };
  return copy(payments[index]);
}

export function methodLabel(value) {
  const found = PAYMENT_METHODS.find((method) => method.value === value);
  return found ? found.label : value || "—";
}

export function formatPaymentDate(value) {
  if (!value) return "";
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

export function formatRecordedAt(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value || "";
  const day = new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
  const time = new Intl.DateTimeFormat("en-GB", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date);
  return `${day}, ${time}`;
}
