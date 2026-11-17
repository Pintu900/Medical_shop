<template>
  <section class="page">
    <header class="head">
      <div class="head__title">
        <div class="head__row">
          <h1>Overview</h1>
          <span class="fy-pill">
            <span class="range__dot" aria-hidden="true"></span>
            {{ fyPillLabel }}
          </span>
        </div>
        <p>Purchase and payment summary for the selected financial year</p>
      </div>
      <div class="period">
        <span class="range">
          <span class="range__dot" aria-hidden="true"></span>
          <svg class="range__cal" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
            <path
              d="M7 3v3M17 3v3M4 9h16M5 5h14a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z"
              fill="none"
              stroke="currentColor"
              stroke-width="1.7"
              stroke-linecap="round"
            />
          </svg>
          {{ rangeLabel }}
        </span>
        <label class="year">
          <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true">
            <path
              d="M7 3v3M17 3v3M4 9h16M5 5h14a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z"
              fill="none"
              stroke="currentColor"
              stroke-width="1.7"
              stroke-linecap="round"
            />
          </svg>
          <span class="sr-only">Financial year</span>
          <select v-model.number="financialYearStart">
            <option v-for="item in financialYears" :key="item.value" :value="item.value">FY {{ item.label }}</option>
          </select>
          <svg class="year__chevron" viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
            <path d="m6 9 6 6 6-6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </label>
      </div>
      <button class="refresh" type="button" :disabled="refreshing" aria-label="Refresh overview" @click="refresh">
        <svg :class="{ spin: refreshing }" viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
          <path
            d="M20 11a8 8 0 0 0-14.3-4.9L4 8M4 4v4h4M4 13a8 8 0 0 0 14.3 4.9L20 16M20 20v-4h-4"
            fill="none"
            stroke="currentColor"
            stroke-width="1.7"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </button>
    </header>

    <div class="body">
      <p v-if="summaryLoading" class="status">Loading overview…</p>
      <p v-if="summaryError" class="status status--error" role="alert">{{ summaryError }}</p>
      <p v-if="error" class="status status--error" role="alert">{{ error }}</p>

      <div class="stats">
        <article class="stat stat--purchase">
          <div class="stat__top">
            <span class="stat__label"><span class="stat__long">Total </span>purchases</span>
            <span class="stat__icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="22" height="22">
                <path d="M3 4h2.2l2.1 10.2a1 1 0 0 0 1 .8h8.9a1 1 0 0 0 1-.76L20 8H6.1" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
                <circle cx="9.5" cy="19" r="1.4" fill="currentColor" />
                <circle cx="17" cy="19" r="1.4" fill="currentColor" />
              </svg>
            </span>
          </div>
          <strong class="stat__value">{{ formatInr(totals.purchases) }}</strong>
          <p class="stat__sub">This financial year</p>
          <footer class="stat__foot">
            <span>This financial year</span>
            <span class="chip chip--teal">{{ isCurrentYear ? "Active FY" : `FY ${financialYearStart}` }}</span>
          </footer>
        </article>

        <article class="stat stat--payment">
          <div class="stat__top">
            <span class="stat__label"><span class="stat__long">Total </span>payments</span>
            <span class="stat__icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="22" height="22">
                <rect x="3" y="5.5" width="18" height="13" rx="2" fill="none" stroke="currentColor" stroke-width="1.8" />
                <path d="M3 10h18M7 15h4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
              </svg>
            </span>
          </div>
          <strong class="stat__value">{{ formatInr(totals.payments) }}</strong>
          <p class="stat__sub">
            <template v-if="clearedPercent !== null">
              <span class="stat__dot" aria-hidden="true"></span>
              {{ clearedPercent }}% cleared
            </template>
            <template v-else>This financial year</template>
          </p>
          <footer class="stat__foot">
            <span>This financial year</span>
            <span v-if="clearedPercent !== null" class="chip chip--blue">{{ clearedPercent }}% cleared</span>
          </footer>
        </article>

        <article class="stat stat--due" :class="{ 'stat--due-clear': totals.dues <= 0 }">
          <div class="stat__top">
            <span class="stat__label">
              <span class="stat__long">Outstanding dues</span>
              <span class="stat__short">Total dues</span>
            </span>
            <span class="stat__icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="22" height="22">
                <path d="M10.3 4.2 2.6 17.5A2 2 0 0 0 4.3 20.5h15.4a2 2 0 0 0 1.7-3L13.7 4.2a2 2 0 0 0-3.4 0z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" />
                <path d="M12 9.5v4M12 17h.01" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
              </svg>
            </span>
          </div>
          <strong class="stat__value">{{ formatInr(totals.dues) }}</strong>
          <p class="stat__sub">{{ totals.dues > 0 ? "Across wholesalers" : "All settled" }}</p>
          <footer class="stat__foot">
            <span>Across wholesalers</span>
            <span class="chip" :class="totals.dues > 0 ? 'chip--amber' : 'chip--teal'">
              {{ totals.dues > 0 ? "Action required" : "All settled" }}
            </span>
          </footer>
        </article>

        <article class="stat stat--opening">
          <div class="stat__top">
            <span class="stat__label">Opening<span class="stat__long"> balance</span></span>
            <span class="stat__icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="22" height="22">
                <path d="M12 6.5C10.3 5.2 7.9 4.5 3.5 4.5v13c4.4 0 6.8.7 8.5 2 1.7-1.3 4.1-2 8.5-2v-13c-4.4 0-6.8.7-8.5 2zM12 6.5v13" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" />
              </svg>
            </span>
          </div>
          <strong class="stat__value">{{ formatInr(totals.opening) }}</strong>
          <p class="stat__sub">Brought forward</p>
          <footer class="stat__foot">
            <span>Start of the year</span>
            <span class="chip chip--grey">Brought forward</span>
          </footer>
        </article>
      </div>

      <div class="actions">
        <RouterLink class="btn-add" to="/admin/purchase-bills/new">
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
            <circle class="btn-add__ring" cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="1.7" />
            <path d="M12 7.5v9M7.5 12h9" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
          </svg>
          Add purchase bill
        </RouterLink>
        <RouterLink class="btn-record" to="/admin/payments/new">
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
            <circle cx="12" cy="12" r="8.5" fill="none" stroke="currentColor" stroke-width="1.7" />
            <path d="M14.5 9.2c-.4-.8-1.3-1.2-2.5-1.2-1.5 0-2.5.8-2.5 1.9 0 2.6 5.2 1.4 5.2 4.1 0 1.1-1.1 2-2.7 2-1.3 0-2.3-.5-2.7-1.4M12 6.5V8M12 16v1.5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
          </svg>
          Record payment
        </RouterLink>
      </div>

      <section class="summary">
        <header class="summary__head">
          <div>
            <h2>Wholesaler summary</h2>
            <p>Ledger balances, purchases and settlements by wholesaler</p>
          </div>
          <RouterLink class="summary__all" to="/admin/wholesalers">
            View all wholesalers
            <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
              <path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </RouterLink>
        </header>

        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th scope="col">Wholesaler</th>
                <th scope="col" class="num">Opening balance</th>
                <th scope="col" class="num">Purchases</th>
                <th scope="col" class="num">Payments</th>
                <th scope="col" class="num">Outstanding dues</th>
                <th scope="col" class="act">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="loading">
                <td colspan="6" class="empty">Loading wholesalers…</td>
              </tr>
              <tr v-else-if="!rows.length && !error">
                <td colspan="6" class="empty">No wholesalers yet.</td>
              </tr>
              <template v-else>
                <tr v-for="item in visibleRows" :key="item.wholesalerId">
                  <td>
                    <div class="who">
                      <span class="avatar" :class="`avatar--${item.tone}`" aria-hidden="true">{{ item.initials }}</span>
                      <span class="who__text">
                        <RouterLink class="name" :to="`/admin/wholesalers/${item.wholesalerId}`">{{ item.wholesalerName }}</RouterLink>
                        <small v-if="item.detail">{{ item.detail }}</small>
                      </span>
                    </div>
                  </td>
                  <td class="num muted">{{ formatInr(item.openingDue) }}</td>
                  <td class="num strong">{{ formatInr(item.totalPurchases) }}</td>
                  <td class="num paid">{{ formatInr(item.totalPayments) }}</td>
                  <td class="num">
                    <span v-if="item.due > 0" class="badge badge--due">{{ formatInr(item.due) }}</span>
                    <span v-else class="badge badge--clear">
                      <svg viewBox="0 0 24 24" width="12" height="12" aria-hidden="true">
                        <path d="m5 12.5 4.5 4.5L19 7.5" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" />
                      </svg>
                      Settled
                    </span>
                  </td>
                  <td class="act">
                    <RouterLink v-if="item.due > 0" class="row-btn row-btn--pay" :to="`/admin/payments/new?wholesalerId=${item.wholesalerId}`">
                      Pay now
                    </RouterLink>
                    <RouterLink v-else class="row-btn" :to="`/admin/wholesalers/${item.wholesalerId}`">Ledger</RouterLink>
                  </td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>

        <ul class="cards">
          <li v-if="loading" class="card empty">Loading wholesalers…</li>
          <li v-else-if="!rows.length && !error" class="card empty">No wholesalers yet.</li>
          <template v-else>
            <li v-for="item in visibleRows" :key="item.wholesalerId" class="card">
              <div class="card__top">
                <div class="who">
                  <span class="avatar" :class="`avatar--${item.tone}`" aria-hidden="true">{{ item.initials }}</span>
                  <span class="who__text">
                    <RouterLink class="name" :to="`/admin/wholesalers/${item.wholesalerId}`">{{ item.wholesalerName }}</RouterLink>
                    <small v-if="item.detail">{{ item.detail }}</small>
                  </span>
                </div>
                <span v-if="item.due > 0" class="badge badge--due">{{ formatInr(item.due) }}</span>
                <span v-else class="badge badge--clear">Settled</span>
              </div>
              <dl>
                <div>
                  <dt>Opening</dt>
                  <dd>{{ formatInr(item.openingDue) }}</dd>
                </div>
                <div>
                  <dt>Purchases</dt>
                  <dd>{{ formatInr(item.totalPurchases) }}</dd>
                </div>
                <div>
                  <dt>Payments</dt>
                  <dd class="paid">{{ formatInr(item.totalPayments) }}</dd>
                </div>
              </dl>
              <RouterLink v-if="item.due > 0" class="row-btn row-btn--pay row-btn--block" :to="`/admin/payments/new?wholesalerId=${item.wholesalerId}`">
                Pay now
              </RouterLink>
              <RouterLink v-else class="row-btn row-btn--block" :to="`/admin/wholesalers/${item.wholesalerId}`">View ledger</RouterLink>
            </li>
          </template>
        </ul>

        <footer class="summary__foot">
          <p>
            <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
              <circle cx="12" cy="12" r="8.5" fill="none" stroke="currentColor" stroke-width="1.7" />
              <path d="M12 11v5M12 8h.01" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" />
            </svg>
            Wholesalers with the highest outstanding dues are listed first.
          </p>
          <span v-if="rows.length">Showing {{ visibleRows.length }} of {{ rows.length }} wholesalers</span>
        </footer>
      </section>
    </div>
  </section>
</template>

<script>
import { fetchOverallSummary } from "../../../data/reports";
import {
  currentDue,
  fetchOutstandingDues,
  fetchWholesalers,
  formatInr,
  formatPhone,
  nameInitials,
  nameTone,
} from "../../../data/wholesalers";

const SUMMARY_LIMIT = 6;

function currentFinancialYearStart(date) {
  const year = date.getFullYear();
  return date.getMonth() >= 3 ? year : year - 1;
}

function financialYearOptions(start) {
  const options = [];
  for (let i = 0; i < 5; i += 1) {
    const year = start - i;
    options.push({ value: year, label: `${year}–${year + 1}` });
  }
  return options;
}

function formatIsoDay(value) {
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric" }).format(date);
}

function rowDue(item) {
  if (item.currentDue !== undefined && item.currentDue !== null && item.currentDue !== "") return Number(item.currentDue) || 0;
  return currentDue(item);
}

function contactLine(wholesaler) {
  if (!wholesaler) return "";
  const gst = wholesaler.gstNumber || wholesaler.gstin || wholesaler.gst;
  if (gst) return `GST: ${gst}`;
  const phone = formatPhone(wholesaler.phone);
  return phone ? `Ph: ${phone}` : "";
}

export default {
  name: "AdminOverview",
  data() {
    const financialYearStart = currentFinancialYearStart(new Date());
    return {
      financialYearStart,
      currentYearStart: financialYearStart,
      financialYears: financialYearOptions(financialYearStart),
      summary: null,
      dues: [],
      wholesalers: [],
      summaryLoading: false,
      loading: false,
      summaryError: "",
      error: "",
    };
  },
  computed: {
    isCurrentYear() {
      return this.financialYearStart === this.currentYearStart;
    },
    fyPillLabel() {
      const start = String(this.financialYearStart).slice(-2);
      const end = String(this.financialYearStart + 1).slice(-2);
      return `${this.isCurrentYear ? "Active FY" : "FY"} ${start}–${end}`;
    },
    refreshing() {
      return this.loading || this.summaryLoading;
    },
    rangeLabel() {
      const summary = this.summary;
      const through = summary && (summary.asOfDate || summary.endDate);
      if (summary && summary.startDate && through) {
        return `${formatIsoDay(summary.startDate)} – ${formatIsoDay(through)}`;
      }
      return `1 Apr ${this.financialYearStart} – 31 Mar ${this.financialYearStart + 1}`;
    },
    rows() {
      const byId = new Map(this.wholesalers.map((item) => [String(item.id), item]));
      return this.dues
        .map((item) => ({
          ...item,
          due: rowDue(item),
          initials: nameInitials(item.wholesalerName),
          tone: nameTone(item.wholesalerName),
          detail: contactLine(byId.get(String(item.wholesalerId))),
        }))
        .sort((a, b) => b.due - a.due || String(a.wholesalerName || "").localeCompare(String(b.wholesalerName || "")));
    },
    visibleRows() {
      return this.rows.slice(0, SUMMARY_LIMIT);
    },
    totals() {
      const summary = this.summary || {};
      return {
        purchases: Number(summary.totalPurchases) || 0,
        payments: Number(summary.totalPayments) || 0,
        dues: Number(summary.totalOutstandingDues) || 0,
        opening: Number(summary.openingBalance) || 0,
      };
    },
    clearedPercent() {
      const owed = this.totals.opening + this.totals.purchases;
      if (owed <= 0) return null;
      return Math.min(100, Math.round((this.totals.payments / owed) * 100));
    },
  },
  watch: {
    financialYearStart: {
      immediate: true,
      handler() {
        this.loadSummary();
      },
    },
  },
  created() {
    this.loadWholesalers();
  },
  methods: {
    formatInr,
    refresh() {
      this.loadSummary();
      this.loadWholesalers();
    },
    async loadWholesalers() {
      this.loading = true;
      this.error = "";
      const [dues, wholesalers] = await Promise.allSettled([fetchOutstandingDues(), fetchWholesalers()]);
      if (dues.status === "fulfilled") this.dues = dues.value;
      else this.error = dues.reason.message || "Could not load wholesalers.";
      if (wholesalers.status === "fulfilled") this.wholesalers = wholesalers.value;
      this.loading = false;
    },
    async loadSummary() {
      const year = this.financialYearStart;
      this.summaryLoading = true;
      this.summaryError = "";
      this.summary = null;
      try {
        const summary = await fetchOverallSummary(year);
        if (this.financialYearStart !== year) return;
        this.summary = summary;
      } catch (err) {
        if (this.financialYearStart !== year) return;
        this.summaryError = err.message || "Could not load this financial year.";
      } finally {
        if (this.financialYearStart === year) this.summaryLoading = false;
      }
    },
  },
};
</script>

<style scoped>
.page {
  min-height: 100vh;
  background: #f6f8fa;
  color: #0f172a;
}

.head {
  display: flex;
  align-items: center;
  gap: 0.55rem;
  padding: 1.1rem 1.6rem 1rem;
  background: #fff;
  border-bottom: 1px solid #eef1f4;
}

.head__title {
  flex: 1;
  min-width: 0;
}

.head__row {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.fy-pill,
.range__cal,
.stat__short,
.stat__sub,
.btn-add__ring {
  display: none;
}

h1 {
  margin: 0;
  font-size: 1.45rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  line-height: 1.25;
}

.head p {
  margin: 0.2rem 0 0;
  color: #64748b;
  font-size: 0.84rem;
}

.period {
  display: flex;
  align-items: center;
  gap: 0.55rem;
}

.range {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.42rem 0.75rem;
  border-radius: 8px;
  background: #eef7f5;
  color: #334155;
  font-size: 0.76rem;
  font-weight: 500;
  white-space: nowrap;
}

.range__dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #14b8a6;
}

.year {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0 0.7rem;
  height: 34px;
  border: 1px solid #dfe5eb;
  border-radius: 9px;
  background: #fff;
  color: #334155;
}

.year select {
  appearance: none;
  padding-right: 1.1rem;
  border: 0;
  background: transparent;
  color: #0f172a;
  font: inherit;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
}

.year select:focus {
  outline: none;
}

.year:focus-within {
  border-color: #0f766e;
  box-shadow: 0 0 0 3px rgba(15, 118, 110, 0.12);
}

.year__chevron {
  position: absolute;
  right: 0.6rem;
  color: #64748b;
  pointer-events: none;
}

.refresh {
  display: inline-grid;
  place-items: center;
  width: 34px;
  height: 34px;
  padding: 0;
  border: 1px solid #dfe5eb;
  border-radius: 9px;
  background: #fff;
  color: #475569;
  cursor: pointer;
}

.refresh:hover:not(:disabled) {
  color: #0f766e;
  border-color: #b7dcd5;
}

.refresh:disabled {
  cursor: default;
}

.spin {
  animation: spin 0.9s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.body {
  max-width: 1180px;
  padding: 1.6rem 1.6rem 2.5rem;
}

.status {
  margin: 0 0 0.9rem;
  color: #64748b;
  font-size: 0.88rem;
  font-weight: 600;
}

.status--error {
  color: #b91c1c;
}

.stats {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 1rem;
}

.stat {
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  padding: 1.05rem 1.05rem 0.9rem;
  border: 1px solid #e8edf1;
  border-radius: 16px;
  background: #fff;
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.03);
}

.stat::after {
  content: "";
  position: absolute;
  right: -28px;
  bottom: -34px;
  width: 92px;
  height: 92px;
  border-radius: 50%;
  background: var(--stat-soft);
  opacity: 0.55;
  pointer-events: none;
}

.stat__top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.5rem;
}

.stat__label {
  padding-top: 0.25rem;
  color: #475569;
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.stat__icon {
  display: inline-grid;
  place-items: center;
  width: 34px;
  height: 34px;
  flex: none;
  border-radius: 10px;
  background: var(--stat-soft);
  color: var(--stat-ink);
}

.stat__value {
  margin: 0.55rem 0 0.9rem;
  color: var(--stat-value, #0f172a);
  font-size: 1.65rem;
  font-weight: 700;
  letter-spacing: -0.03em;
  line-height: 1.15;
}

.stat__foot {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  margin-top: auto;
  padding-top: 0.75rem;
  border-top: 1px solid #eef1f4;
  color: #64748b;
  font-size: 0.72rem;
  line-height: 1.3;
}

.chip {
  flex: none;
  padding: 0.2rem 0.5rem;
  border-radius: 6px;
  font-size: 0.68rem;
  font-weight: 600;
  white-space: nowrap;
}

.chip--teal {
  background: #e6f6f2;
  color: #0f766e;
}

.chip--blue {
  background: #eaf1ff;
  color: #1d4ed8;
}

.chip--amber {
  background: #fdecc8;
  color: #9a4b07;
}

.chip--grey {
  background: #f1f4f7;
  color: #64748b;
}

.stat--purchase {
  --stat-soft: #e6f6f2;
  --stat-ink: #0f766e;
}

.stat--payment {
  --stat-soft: #eaf1ff;
  --stat-ink: #1d4ed8;
  --stat-value: #1e3a8a;
}

.stat--due {
  --stat-soft: #fdecc8;
  --stat-ink: #b45309;
  --stat-value: #b45309;
  border-color: #f6dfae;
  background: linear-gradient(180deg, #fffaf0 0%, #fff 70%);
}

.stat--due .stat__label {
  color: #b45309;
}

.stat--due .stat__foot {
  border-top-color: #f6e6c4;
}

.stat--due-clear {
  --stat-soft: #e6f6f2;
  --stat-ink: #0f766e;
  --stat-value: #0f172a;
  border-color: #e8edf1;
  background: #fff;
}

.stat--due-clear .stat__label {
  color: #475569;
}

.stat--opening {
  --stat-soft: #eef1f5;
  --stat-ink: #1e293b;
}

.actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-top: 1.25rem;
}

.btn-add,
.btn-record {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.55rem;
  height: 46px;
  border-radius: 10px;
  font-size: 0.92rem;
  font-weight: 600;
  text-decoration: none;
}

.btn-add {
  background: #0f766e;
  color: #fff;
  box-shadow: 0 6px 16px rgba(15, 118, 110, 0.18);
}

.btn-add:hover {
  background: #0c645d;
  color: #fff;
}

.btn-record {
  border: 1.5px solid #9fd5cb;
  background: #fff;
  color: #0f5f58;
}

.btn-record:hover {
  background: #f2fbf9;
  color: #0f5f58;
}

.summary {
  margin-top: 1.4rem;
  overflow: hidden;
  border: 1px solid #e8edf1;
  border-radius: 16px;
  background: #fff;
}

.summary__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.1rem 1.25rem 1rem;
}

.summary h2 {
  margin: 0;
  font-size: 1.05rem;
  font-weight: 600;
}

.summary__head p {
  margin: 0.15rem 0 0;
  color: #64748b;
  font-size: 0.76rem;
}

.summary__all {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  flex: none;
  padding: 0.42rem 0.7rem;
  border: 1px solid #cdeae4;
  border-radius: 8px;
  background: #f0faf7;
  color: #0f5f58;
  font-size: 0.76rem;
  font-weight: 600;
  text-decoration: none;
}

.summary__all:hover {
  background: #e3f5f0;
  color: #0f5f58;
}

.table-wrap {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  padding: 0.85rem 1.25rem;
  border-bottom: 1px solid #eef1f4;
  text-align: left;
  font-size: 0.86rem;
  white-space: nowrap;
}

th {
  padding-top: 0.75rem;
  padding-bottom: 0.75rem;
  background: #f8fafb;
  color: #64748b;
  font-size: 0.68rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.num {
  text-align: right;
}

.act {
  text-align: center;
}

tbody tr:hover td {
  background: #fbfcfd;
}

.who {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  min-width: 0;
}

.who__text {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.who__text small {
  color: #94a3b8;
  font-size: 0.72rem;
}

.avatar {
  display: inline-grid;
  place-items: center;
  width: 32px;
  height: 32px;
  flex: none;
  border-radius: 8px;
  font-size: 0.72rem;
  font-weight: 700;
}

.avatar--teal {
  background: #e3f6ef;
  color: #0f766e;
}

.avatar--orange {
  background: #fdeee2;
  color: #c2410c;
}

.avatar--blue {
  background: #e7f0fd;
  color: #1d4ed8;
}

.avatar--violet {
  background: #f1eafd;
  color: #6d28d9;
}

.avatar--rose {
  background: #fde8ec;
  color: #be123c;
}

.avatar--amber {
  background: #fdf3d8;
  color: #a16207;
}

.name {
  color: #0f172a;
  font-weight: 600;
  text-decoration: none;
}

.name:hover {
  color: #0f766e;
}

.muted {
  color: #475569;
}

.strong {
  font-weight: 600;
}

.paid {
  color: #1d4ed8;
  font-weight: 600;
}

.badge {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.25rem 0.55rem;
  border-radius: 6px;
  font-size: 0.74rem;
  font-weight: 600;
}

.badge--due {
  border: 1px solid #f6d79a;
  background: #fff6e2;
  color: #b45309;
}

.badge--clear {
  border: 1px solid #bfe6d7;
  background: #ecf8f3;
  color: #0f766e;
}

.row-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 62px;
  padding: 0.38rem 0.7rem;
  border: 1px solid #dfe5eb;
  border-radius: 8px;
  background: #fff;
  color: #475569;
  font-size: 0.76rem;
  font-weight: 600;
  text-decoration: none;
}

.row-btn:hover {
  border-color: #b7dcd5;
  color: #0f766e;
}

.row-btn--pay {
  color: #0f5f58;
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.05);
}

.summary__foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.8rem 1.25rem;
  color: #64748b;
  font-size: 0.74rem;
}

.summary__foot p {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  margin: 0;
}

.summary__foot span {
  color: #334155;
  font-weight: 500;
  white-space: nowrap;
}

.empty {
  padding: 1.5rem 1.25rem;
  color: #64748b;
  text-align: center;
}

.cards {
  display: none;
  flex-direction: column;
  gap: 0.75rem;
  margin: 0;
  padding: 0 1rem 0.5rem;
  list-style: none;
}

.card {
  padding: 0.9rem;
  border: 1px solid #eef1f4;
  border-radius: 12px;
}

.card__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.6rem;
}

.card dl {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.5rem;
  margin: 0.8rem 0;
}

.card dt {
  color: #94a3b8;
  font-size: 0.68rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.card dd {
  margin: 0.15rem 0 0;
  font-size: 0.86rem;
  font-weight: 600;
}

.row-btn--block {
  width: 100%;
  padding: 0.55rem;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  border: 0;
}

@media (max-width: 1100px) {
  .stats {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 800px) {
  .page {
    background: #f6f8fa;
  }

  .head {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    grid-template-areas:
      "title refresh"
      "period period";
    align-items: start;
    gap: 0.9rem 0.75rem;
    padding: 1.1rem 1rem 0;
    background: transparent;
    border-bottom: 0;
  }

  .head__title {
    grid-area: title;
  }

  h1 {
    font-size: 1.6rem;
    font-weight: 800;
  }

  .head p {
    margin-top: 0.35rem;
    font-size: 0.92rem;
    line-height: 1.45;
  }

  .fy-pill {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    padding: 0.2rem 0.6rem;
    border-radius: 999px;
    background: #e6f6f2;
    color: #0f766e;
    font-size: 0.78rem;
    font-weight: 600;
    white-space: nowrap;
  }

  .refresh {
    grid-area: refresh;
    width: 40px;
    height: 40px;
    border-color: #e1ece9;
    border-radius: 12px;
    background: #eef7f5;
    color: #0f766e;
  }

  .period {
    grid-area: period;
    justify-content: space-between;
    gap: 0.5rem;
    padding: 0.45rem 0.45rem 0.45rem 0.8rem;
    border: 1px solid #e1ece9;
    border-radius: 14px;
    background: #f0f8f6;
  }

  .range {
    gap: 0.55rem;
    padding: 0;
    background: transparent;
    color: #0f172a;
    font-size: 0.86rem;
    font-weight: 600;
  }

  .range .range__dot,
  .year > svg:first-child {
    display: none;
  }

  .range__cal {
    display: block;
    flex: none;
    color: #0f766e;
  }

  .year {
    height: 36px;
    padding: 0 0.6rem;
    border-color: transparent;
    border-radius: 10px;
    box-shadow: 0 1px 2px rgba(15, 23, 42, 0.06);
  }

  .year select {
    color: #0f5f58;
    font-size: 0.84rem;
  }

  .body {
    display: flex;
    flex-direction: column;
    padding: 1rem 1rem 2rem;
  }

  .status {
    order: 0;
  }

  .actions {
    order: 1;
    gap: 0.75rem;
    margin: 0 0 1rem;
  }

  .stats {
    order: 2;
    gap: 0.75rem;
  }

  .summary {
    order: 3;
  }

  .btn-add,
  .btn-record {
    height: 50px;
    border-radius: 14px;
    font-size: 0.9rem;
    font-weight: 700;
  }

  .btn-add__ring {
    display: inline;
  }

  .btn-record {
    border: 1px solid #e1ece9;
    box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04);
  }

  .stat {
    padding: 1rem 0.95rem;
    border-radius: 16px;
  }

  .stat::after,
  .stat__foot {
    display: none;
  }

  .stat__top {
    align-items: center;
  }

  .stat__label {
    padding-top: 0;
    font-size: 0.78rem;
    font-weight: 700;
    letter-spacing: 0.05em;
  }

  .stat__long {
    display: none;
  }

  .stat__short {
    display: inline;
  }

  .stat__icon {
    width: 36px;
    height: 36px;
  }

  .stat__value {
    margin: 0.75rem 0 0.3rem;
    font-size: clamp(1.3rem, 6.4vw, 1.75rem);
    font-weight: 800;
  }

  .stat__sub {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    margin: 0;
    color: #475569;
    font-size: 0.8rem;
    font-weight: 500;
  }

  .stat--purchase .stat__sub {
    color: #0f766e;
  }

  .stat--due .stat__sub {
    color: #b45309;
  }

  .stat--due-clear .stat__sub {
    color: #0f766e;
  }

  .stat--due:not(.stat--due-clear) {
    background: #fff8ea;
  }

  .stat__dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: var(--stat-ink);
  }

  .table-wrap {
    display: none;
  }

  .cards {
    display: flex;
  }

  .summary__foot {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.35rem;
  }
}

@media (max-width: 380px) {
  .btn-add,
  .btn-record {
    gap: 0.4rem;
    font-size: 0.82rem;
  }

  .range {
    font-size: 0.78rem;
  }
}

@media (max-width: 480px) {
  .summary__head {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.7rem;
  }
}
</style>
