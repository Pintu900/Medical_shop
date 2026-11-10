import { get } from "../api";

export const AUDIT_ENTITIES = [
  { value: "PAYMENT", label: "Payment" },
  { value: "PURCHASE_BILL", label: "Purchase bill" },
  { value: "WHOLESALER", label: "Wholesaler" },
];

export const AUDIT_ACTIONS = [
  { value: "CREATE", label: "Created" },
  { value: "UPDATE", label: "Updated" },
  { value: "CANCEL", label: "Cancelled" },
];

const FIELD_LABELS = {
  wholesalerId: "Wholesaler ID",
  amount: "Amount",
  paymentDate: "Payment date",
  method: "Method",
  reference: "Reference",
  notes: "Notes",
  billNumber: "Bill number",
  billDate: "Bill date",
  totalAmount: "Total amount",
  paidAmount: "Paid amount",
};

export function entityLabel(value) {
  const found = AUDIT_ENTITIES.find((item) => item.value === value);
  return found ? found.label : value || "—";
}

export function actionLabel(value) {
  const found = AUDIT_ACTIONS.find((item) => item.value === value);
  return found ? found.label : value || "—";
}

export function auditUser(event) {
  if (!event) return "—";
  if (event.actorName) return event.actorName;
  if (event.actorEmail) return event.actorEmail;
  return "—";
}

export async function fetchAuditEvents(params) {
  const search = new URLSearchParams();
  Object.keys(params || {}).forEach((key) => {
    const value = params[key];
    if (value !== undefined && value !== null && value !== "") search.set(key, String(value));
  });
  const query = search.toString();
  const data = await get(query ? `/audit?${query}` : "/audit");
  const body = data && typeof data === "object" ? data : {};
  return {
    items: Array.isArray(body.items) ? body.items : [],
    page: Number(body.page) || 0,
    size: Number(body.size) || 20,
    totalElements: Number(body.totalElements) || 0,
    totalPages: Number(body.totalPages) || 0,
  };
}

export async function fetchAuditEvent(id) {
  return get(`/audit/${encodeURIComponent(id)}`);
}

function snapshotObject(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  return value;
}

function formatSnapshotValue(value) {
  if (value === undefined || value === null || value === "") return "—";
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}

export function auditChanges(event) {
  const before = snapshotObject(event && event.oldValues);
  const after = snapshotObject(event && event.newValues);
  const keys = Object.keys(before);
  Object.keys(after).forEach((key) => {
    if (keys.indexOf(key) === -1) keys.push(key);
  });
  return keys
    .filter((key) => JSON.stringify(before[key]) !== JSON.stringify(after[key]))
    .map((key) => ({
      field: FIELD_LABELS[key] || key,
      before: formatSnapshotValue(before[key]),
      after: formatSnapshotValue(after[key]),
    }));
}

export function formatAuditWhen(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value || "";
  const day = new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
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

export function auditDateRange(period) {
  if (period !== "7" && period !== "30") return {};
  const days = period === "7" ? 7 : 30;
  const end = new Date();
  const start = new Date(end.getFullYear(), end.getMonth(), end.getDate() - days);
  return { fromDate: isoDate(start), toDate: isoDate(end) };
}

function isoDate(date) {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}
