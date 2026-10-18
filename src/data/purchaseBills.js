import { get } from "../api";

export async function fetchPurchaseBills() {
  const data = await get("/purchase-bills");
  return Array.isArray(data) ? data : [];
}

export async function fetchPurchaseBill(id) {
  const data = await get(`/purchase-bills/${id}`);
  if (!data || typeof data !== "object" || Array.isArray(data)) return null;
  return data;
}

export async function fetchWholesalerPurchaseBills(wholesalerId) {
  const data = await get(`/purchase-bills?wholesalerId=${encodeURIComponent(wholesalerId)}`);
  return Array.isArray(data) ? data : [];
}

const bills = [
  {
    id: "abc-101",
    billNumber: "ABC-101",
    billDate: "2024-06-12",
    wholesalerId: "",
    wholesalerName: "Sharma Distributors",
    totalAmount: 20000,
    amountPaid: 8000,
    paymentMethod: "UPI",
    referenceNumber: "UPI1234567890",
    notes: "Received stock as per bill. Part payment made.",
    attachments: [{ id: "abc-101-jpg", name: "ABC-101.jpg", url: "" }],
  },
  {
    id: "abc-100",
    billNumber: "ABC-100",
    billDate: "2024-06-05",
    wholesalerId: "",
    wholesalerName: "Medico Trade Links",
    totalAmount: 15500,
    amountPaid: 0,
    paymentMethod: "",
    referenceNumber: "",
    notes: "",
    attachments: [{ id: "abc-100-jpg", name: "ABC-100.jpg", url: "" }],
  },
  {
    id: "mtl-453",
    billNumber: "MTL-453",
    billDate: "2024-05-28",
    wholesalerId: "",
    wholesalerName: "Medico Trade Links",
    totalAmount: 8250,
    amountPaid: 2000,
    paymentMethod: "Cash",
    referenceNumber: "",
    notes: "",
    attachments: [],
  },
  {
    id: "spl-778",
    billNumber: "SPL-778",
    billDate: "2024-05-16",
    wholesalerId: "",
    wholesalerName: "Samira Pharmacy",
    totalAmount: 32400,
    amountPaid: 10000,
    paymentMethod: "Bank transfer",
    referenceNumber: "NEFT88421",
    notes: "",
    attachments: [{ id: "spl-778-jpg", name: "SPL-778.jpg", url: "" }],
  },
  {
    id: "rs-320",
    billNumber: "RS-320",
    billDate: "2024-05-02",
    wholesalerId: "",
    wholesalerName: "R K Medicals",
    totalAmount: 12600,
    amountPaid: 0,
    paymentMethod: "",
    referenceNumber: "",
    notes: "",
    attachments: [{ id: "rs-320-jpg", name: "RS-320.jpg", url: "" }],
  },
  {
    id: "abc-098",
    billNumber: "ABC-098",
    billDate: "2024-04-18",
    wholesalerId: "",
    wholesalerName: "Sharma Distributors",
    totalAmount: 9800,
    amountPaid: 4800,
    paymentMethod: "UPI",
    referenceNumber: "UPI998812",
    notes: "",
    attachments: [],
  },
];

function copy(bill) {
  return {
    ...bill,
    attachments: (bill.attachments || []).map((file) => ({ ...file })),
  };
}

export function listPurchaseBills() {
  return bills.map(copy);
}

export function getPurchaseBill(id) {
  const found = bills.find((bill) => String(bill.id) === String(id));
  return found ? copy(found) : null;
}

export function createPurchaseBill(bill) {
  const next = {
    ...bill,
    id: `bill-${Date.now()}`,
    attachments: (bill.attachments || []).map((file) => ({ ...file })),
  };
  bills.unshift(next);
  return copy(next);
}

export function updatePurchaseBill(id, patch) {
  const index = bills.findIndex((bill) => String(bill.id) === String(id));
  if (index === -1) return null;
  bills[index] = {
    ...bills[index],
    ...patch,
    attachments: bills[index].attachments,
  };
  return copy(bills[index]);
}

export function dueAdded(bill) {
  return (Number(bill.totalAmount) || 0) - (Number(bill.amountPaid) || 0);
}

export function formatBillDate(value) {
  if (!value) return "";
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}
