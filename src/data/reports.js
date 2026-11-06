import { get } from "../api";

export async function fetchWholesalerSummaries(year, month) {
  const search = new URLSearchParams({ year: String(year), month: String(month) });
  const data = await get(`/reports/wholesaler-summary?${search.toString()}`);
  return Array.isArray(data) ? data : [];
}

export async function fetchOverallSummary(financialYearStart) {
  const search = new URLSearchParams({ financialYearStart: String(financialYearStart) });
  const data = await get(`/reports/overall-summary?${search.toString()}`);
  return data && typeof data === "object" && !Array.isArray(data) ? data : null;
}
