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
  return Array.isArray(data) ? data : [];
}

export async function fetchWholesaler(id) {
  const data = await get(`/wholesalers/${id}`);
  if (!data || typeof data !== "object" || Array.isArray(data)) return null;
  return normalizeWholesaler(data);
}

function firstNumber(source, keys) {
  for (let i = 0; i < keys.length; i += 1) {
    const value = source[keys[i]];
    if (value !== undefined && value !== null && value !== "") return Number(value) || 0;
  }
  return null;
}

export function normalizeWholesalerReport(raw) {
  const source = raw && typeof raw === "object" && !Array.isArray(raw) ? raw : {};
  const openingDue = firstNumber(source, ["openingDue", "opening_due"]) || 0;
  const totalPurchases = firstNumber(source, ["totalPurchases", "total_purchases"]) || 0;
  const totalPayments = firstNumber(source, ["totalPayments", "total_payments"]) || 0;
  const reportedDue = firstNumber(source, ["currentDue", "current_due"]);
  return {
    openingDue,
    totalPurchases,
    totalPayments,
    currentDue: reportedDue === null ? openingDue + totalPurchases - totalPayments : reportedDue,
  };
}

export async function fetchWholesalerReport(id) {
  const data = await get(`/reports/outstanding-dues/${id}`);
  return normalizeWholesalerReport(data);
}

export async function fetchOutstandingDues() {
  const data = await get("/reports/outstanding-dues");
  return Array.isArray(data) ? data : [];
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
