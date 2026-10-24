const events = [
  {
    id: "A1042",
    at: "2026-10-14T10:24:00",
    user: "Ananya Das",
    action: "Updated",
    entity: "Payment",
    recordId: "12",
    reason: "Corrected amount",
    changes: [{ field: "Amount", before: "₹5,000", after: "₹6,000" }],
  },
  {
    id: "A1041",
    at: "2026-10-14T09:15:00",
    user: "Rohit Sharma",
    action: "Created",
    entity: "Purchase bill",
    recordId: "28",
    reason: "New bill from Sharma Distributors",
    changes: [
      { field: "Bill number", before: "—", after: "SD-228" },
      { field: "Total", before: "—", after: "₹18,400" },
    ],
  },
  {
    id: "A1038",
    at: "2026-10-13T17:42:00",
    user: "Meera Iyer",
    action: "Updated",
    entity: "Payment",
    recordId: "11",
    reason: "Updated payment date",
    changes: [{ field: "Payment date", before: "12 Oct 2026", after: "13 Oct 2026" }],
  },
  {
    id: "A1036",
    at: "2026-10-13T12:11:00",
    user: "Vikram Singh",
    action: "Created",
    entity: "Payment",
    recordId: "12",
    reason: "Initial payment entry",
    changes: [
      { field: "Amount", before: "—", after: "₹5,000" },
      { field: "Method", before: "—", after: "UPI" },
    ],
  },
  {
    id: "A1020",
    at: "2026-10-12T16:37:00",
    user: "Neha Kapoor",
    action: "Updated",
    entity: "Wholesaler",
    recordId: "3",
    reason: "Updated contact name",
    changes: [{ field: "Name", before: "Shree Pharma", after: "Shree Pharma & Co." }],
  },
  {
    id: "A1011",
    at: "2026-10-02T11:05:00",
    user: "Ananya Das",
    action: "Updated",
    entity: "Purchase bill",
    recordId: "19",
    reason: "Corrected bill total",
    changes: [{ field: "Total", before: "₹12,000", after: "₹12,450" }],
  },
  {
    id: "A1004",
    at: "2026-09-18T15:20:00",
    user: "Rohit Sharma",
    action: "Created",
    entity: "Wholesaler",
    recordId: "8",
    reason: "Added wholesaler",
    changes: [{ field: "Name", before: "—", after: "City Healthcare" }],
  },
];

export const AUDIT_ENTITIES = ["Payment", "Purchase bill", "Wholesaler"];
export const AUDIT_ACTIONS = ["Created", "Updated"];

export function listAuditEvents() {
  return events.map((event) => ({ ...event, changes: event.changes.map((change) => ({ ...change })) }));
}

export function getAuditEvent(id) {
  const found = events.find((event) => event.id === id);
  if (!found) return null;
  return { ...found, changes: found.changes.map((change) => ({ ...change })) };
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
