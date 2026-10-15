import { get } from "../api";

export function normalizeWholesaler(raw) {
  let phone = String(raw.phone || "").replace(/\D/g, "");
  if (phone.length === 12 && phone.startsWith("91")) phone = phone.slice(2);

  return {
    id: raw.id,
    name: raw.name || "",
    phone,
    address: raw.address || "",
    status: raw.active ? "Active" : "Inactive",
    openingDue: Number(raw.openingDue) || 0,
    openingBalanceDate: raw.openingBalanceDate || "",
    totalPurchases: Number(raw.totalPurchases) || 0,
    totalPayments: Number(raw.totalPayments) || 0,
    bills: Array.isArray(raw.bills) ? raw.bills : [],
    payments: Array.isArray(raw.payments) ? raw.payments : [],
  };
}

export async function fetchWholesalers() {
  const data = await get("/wholesalers");
  const list = Array.isArray(data) ? data : [];
  return list.map(normalizeWholesaler);
}

export async function fetchWholesaler(id) {
  const list = await fetchWholesalers();
  return list.find((item) => String(item.id) === String(id)) || null;
}

export function formatInr(amount) {
  const value = Number(amount) || 0;
  const whole = Number.isInteger(value);
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: whole ? 0 : 2,
    maximumFractionDigits: whole ? 0 : 2,
  }).format(value);
}

export function formatInrExact(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "decimal",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(amount) || 0);
}

export function formatPhone(phone) {
  let digits = String(phone || "").replace(/\D/g, "");
  if (digits.length === 12 && digits.startsWith("91")) digits = digits.slice(2);
  if (digits.length !== 10) return digits;
  return `${digits.slice(0, 5)} ${digits.slice(5)}`;
}

export function currentDue(item) {
  const opening = Number(item.openingDue) || 0;
  const purchases = Number(item.totalPurchases) || 0;
  const payments = Number(item.totalPayments) || 0;
  return opening + purchases - payments;
}
