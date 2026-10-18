<template>
  <section class="page">
    <header class="head">
      <div>
        <h1>Overview</h1>
        <p>Purchase and payment summary</p>
      </div>
      <div class="period">
        <label class="month">
          <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
            <path
              d="M7 3v3M17 3v3M4 9h16M5 5h14a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z"
              fill="none"
              stroke="currentColor"
              stroke-width="1.7"
              stroke-linecap="round"
            />
          </svg>
          <span class="sr-only">Month</span>
          <select v-model="month">
            <option v-for="item in months" :key="item.value" :value="item.value">{{ item.label }}</option>
          </select>
        </label>
        <p class="range">
          <strong>Month to date</strong>
          <span>{{ rangeLabel }}</span>
        </p>
      </div>
    </header>

    <p v-if="loading" class="status">Loading overview…</p>
    <p v-if="error" class="status status--error" role="alert">{{ error }}</p>
    <p v-if="billsError" class="status status--error" role="alert">{{ billsError }}</p>

    <div class="stats">
      <article class="stat stat--purchase">
        <span class="stat__icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="18" height="18">
            <path d="M6 7h15l-1.5 9h-12L6 7zM6 7 5 4H2" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round" />
            <path d="M9 20a1 1 0 1 0 0-2 1 1 0 0 0 0 2zM17 20a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" fill="currentColor" />
          </svg>
        </span>
        <span>Total purchases</span>
        <strong>{{ formatInr(totals.purchases) }}</strong>
        <small>{{ countLabel(totals.billCount, "bill", "bills") }}</small>
      </article>
      <article class="stat stat--payment">
        <span class="stat__icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="18" height="18">
            <path d="M3 7h18v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7zM3 10h18M7 15h4" fill="none" stroke="currentColor" stroke-width="1.7" />
          </svg>
        </span>
        <span>Total payments</span>
        <strong>{{ formatInr(totals.payments) }}</strong>
        <small>{{ countLabel(totals.paymentCount, "payment", "payments", "No payments") }}</small>
      </article>
      <article class="stat stat--due">
        <span class="stat__icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="18" height="18">
            <path d="M12 4 3 18h18L12 4zM12 10v4M12 16.5v.5" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round" />
          </svg>
        </span>
        <span>Outstanding dues</span>
        <strong>{{ formatInr(totals.dues) }}</strong>
        <small>{{ countLabel(totals.dueCount, "wholesaler", "wholesalers") }}</small>
      </article>
      <article class="stat stat--opening">
        <span class="stat__icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="18" height="18">
            <path d="M4 10h16v9a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-9zM3 10l2.2-4h13.6L21 10M12 13v4" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round" />
          </svg>
        </span>
        <span>Opening balance</span>
        <strong>{{ formatInr(totals.opening) }}</strong>
        <small>Recorded opening dues</small>
      </article>
    </div>

    <div class="actions">
      <RouterLink class="btn-add" to="/admin/purchase-bills/new">+ Add purchase bill</RouterLink>
      <RouterLink class="btn-record" to="/admin/payments">Record payment</RouterLink>
    </div>

    <section class="summary">
      <header class="summary__head">
        <h2>Wholesaler summary</h2>
        <RouterLink to="/admin/wholesalers">View all wholesalers →</RouterLink>
      </header>

      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th scope="col">Wholesaler</th>
              <th scope="col">Opening balance</th>
              <th scope="col">Purchases</th>
              <th scope="col">Payments</th>
              <th scope="col">Outstanding dues</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="loading">
              <td colspan="5" class="empty">Loading wholesalers…</td>
            </tr>
            <tr v-else-if="!rows.length && !error">
              <td colspan="5" class="empty">No wholesalers yet.</td>
            </tr>
            <template v-else>
              <tr v-for="item in rows" :key="item.wholesalerId">
                <td>
                  <RouterLink class="name" :to="`/admin/wholesalers/${item.wholesalerId}`">{{ item.wholesalerName }}</RouterLink>
                </td>
                <td>{{ formatInr(item.openingDue) }}</td>
                <td>{{ formatInr(item.totalPurchases) }}</td>
                <td>{{ formatInr(item.totalPayments) }}</td>
                <td :class="{ due: Number(item.currentDue) > 0 }">{{ formatInr(item.currentDue) }}</td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>

      <ul class="cards">
        <li v-if="loading" class="card empty">Loading wholesalers…</li>
        <li v-else-if="!rows.length && !error" class="card empty">No wholesalers yet.</li>
        <template v-else>
          <li v-for="item in rows" :key="item.wholesalerId" class="card">
            <RouterLink class="name" :to="`/admin/wholesalers/${item.wholesalerId}`">{{ item.wholesalerName }}</RouterLink>
            <dl>
              <div>
                <dt>Opening balance</dt>
                <dd>{{ formatInr(item.openingDue) }}</dd>
              </div>
              <div>
                <dt>Purchases</dt>
                <dd>{{ formatInr(item.totalPurchases) }}</dd>
              </div>
              <div>
                <dt>Payments</dt>
                <dd>{{ formatInr(item.totalPayments) }}</dd>
              </div>
              <div>
                <dt>Due</dt>
                <dd :class="{ due: Number(item.currentDue) > 0 }">{{ formatInr(item.currentDue) }}</dd>
              </div>
            </dl>
          </li>
        </template>
      </ul>
    </section>

    <p class="note">Payments are the initial amounts recorded on purchase bills.</p>
  </section>
</template>

<script>
import { fetchOutstandingDues, formatInr } from "../../../data/wholesalers";
import { fetchPurchaseBills } from "../../../data/purchaseBills";

function monthKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function monthOptions() {
  const now = new Date();
  const options = [];
  for (let i = 0; i < 12; i += 1) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    options.push({
      value: monthKey(date),
      label: new Intl.DateTimeFormat("en-GB", { month: "long", year: "numeric" }).format(date),
    });
  }
  return options;
}

function parseBillDate(value) {
  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime()) ? null : date;
}

function formatDay(date) {
  return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric" }).format(date);
}

export default {
  name: "AdminOverview",
  data() {
    return {
      month: monthKey(new Date()),
      months: monthOptions(),
      dues: [],
      bills: [],
      loading: false,
      error: "",
      billsError: "",
    };
  },
  computed: {
    period() {
      const [year, month] = String(this.month).split("-").map(Number);
      const start = new Date(year, month - 1, 1);
      const endOfMonth = new Date(year, month, 0);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return { start, end: endOfMonth < today ? endOfMonth : today };
    },
    rangeLabel() {
      return `${formatDay(this.period.start)} – ${formatDay(this.period.end)}`;
    },
    billsInRange() {
      const { start, end } = this.period;
      return this.bills.filter((bill) => {
        const date = parseBillDate(bill.billDate);
        return date && date >= start && date <= end;
      });
    },
    rows() {
      return [...this.dues].sort((a, b) => String(a.wholesalerName || "").localeCompare(String(b.wholesalerName || "")));
    },
    totals() {
      const purchases = this.billsInRange.reduce((sum, bill) => sum + (Number(bill.totalAmount) || 0), 0);
      const payments = this.billsInRange.reduce((sum, bill) => sum + (Number(bill.paidAmount) || 0), 0);
      const paymentCount = this.billsInRange.filter((bill) => Number(bill.paidAmount) > 0).length;
      const opening = this.dues.reduce((sum, item) => sum + (Number(item.openingDue) || 0), 0);
      const owing = this.dues.filter((item) => Number(item.currentDue) > 0);
      return {
        purchases,
        payments,
        paymentCount,
        billCount: this.billsInRange.length,
        dues: owing.reduce((sum, item) => sum + (Number(item.currentDue) || 0), 0),
        dueCount: owing.length,
        opening,
      };
    },
  },
  async created() {
    this.loading = true;
    this.error = "";
    this.billsError = "";
    const [dues, bills] = await Promise.allSettled([fetchOutstandingDues(), fetchPurchaseBills()]);
    if (dues.status === "fulfilled") this.dues = dues.value;
    else this.error = dues.reason.message || "Could not load wholesalers.";
    if (bills.status === "fulfilled") this.bills = bills.value;
    else this.billsError = bills.reason.message || "Could not load purchase bills.";
    this.loading = false;
  },
  methods: {
    formatInr,
    countLabel(count, singular, plural, empty) {
      if (!count) return empty || `0 ${plural}`;
      return `${count} ${count === 1 ? singular : plural}`;
    },
  },
};
</script>

<style scoped>
.page {
  max-width: 1100px;
  padding: 1.5rem 1.75rem 2.5rem;
}

.head,
.summary__head,
.card__top,
.actions {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
}

h1 {
  margin: 0;
  font-size: 1.7rem;
  letter-spacing: -0.03em;
}

.head p,
.note,
.empty,
.range span,
.stat small {
  margin: 0.3rem 0 0;
  color: #64748b;
  font-size: 0.92rem;
}

.period {
  display: flex;
  align-items: center;
  gap: 0.85rem;
}

.month {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: #fff;
  color: #0f172a;
  padding: 0.45rem 0.7rem;
}

.month select {
  border: 0;
  background: transparent;
  font: inherit;
  font-weight: 600;
  color: inherit;
}

.month select:focus {
  outline: none;
}

.head .range {
  margin: 0;
  text-align: right;
}

.range strong {
  display: block;
  font-size: 0.92rem;
}

.status {
  margin: 1rem 0 0;
  color: #64748b;
  font-weight: 600;
}

.status--error {
  color: #b91c1c;
}

.stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.75rem;
  margin-top: 1.1rem;
}

.stat {
  border-radius: 14px;
  padding: 0.95rem 1rem 1rem;
  display: flex;
  flex-direction: column;
  min-height: 132px;
}

.stat span,
.stat small {
  color: inherit;
  opacity: 0.8;
}

.stat strong {
  margin-top: 0.55rem;
  font-size: 1.35rem;
  letter-spacing: -0.03em;
}

.stat__icon {
  width: 28px;
  height: 28px;
  border-radius: 8px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.55rem;
  background: rgba(255, 255, 255, 0.7);
}

.stat--purchase {
  background: #ecfdf5;
  color: #0f766e;
}

.stat--payment {
  background: #eff6ff;
  color: #1d4ed8;
}

.stat--due {
  background: #fff7ed;
  color: #c2410c;
}

.stat--opening {
  background: #f0fdf4;
  color: #166534;
}

.actions {
  margin-top: 0.9rem;
}

.btn-add,
.btn-record,
.btn-view {
  border-radius: 8px;
  padding: 0.7rem 1rem;
  font-weight: 600;
  text-decoration: none;
  text-align: center;
}

.btn-add {
  flex: 1;
  background: #0f766e;
  color: #fff;
}

.btn-add:hover {
  background: #115e59;
}

.btn-record {
  flex: 1;
  border: 1px solid #99f6e4;
  background: #fff;
  color: #0f766e;
}

.summary {
  margin-top: 1.4rem;
}

.summary h2 {
  margin: 0;
  font-size: 1.05rem;
}

.summary__head a {
  color: #0f766e;
  font-weight: 600;
  text-decoration: none;
  font-size: 0.92rem;
}

.table-wrap,
.card {
  margin-top: 0.75rem;
  background: #fff;
  border: 1px solid #e6eeec;
  border-radius: 14px;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  text-align: left;
  padding: 0.9rem 1rem;
  border-bottom: 1px solid #eef3f2;
  font-size: 0.92rem;
}

th {
  color: #64748b;
  font-size: 0.78rem;
}

.name {
  color: #0f172a;
  font-weight: 700;
  text-decoration: none;
}

.due {
  color: #c2410c;
  font-weight: 700;
}

.btn-view {
  display: inline-flex;
  border: 1px solid #e2e8f0;
  background: #fff;
  color: #0f172a;
  padding: 0.35rem 0.7rem;
  font-size: 0.85rem;
}

.note {
  margin-top: 0.8rem;
}

.cards {
  display: none;
  list-style: none;
  margin: 0.75rem 0 0;
  padding: 0;
  gap: 0.75rem;
}

.card {
  padding: 0.95rem 1rem;
}

.card dl {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.65rem 1rem;
  margin: 0.75rem 0 0;
}

.card dt {
  color: #64748b;
  font-size: 0.78rem;
}

.card dd {
  margin: 0.15rem 0 0;
  font-weight: 700;
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

@media (max-width: 800px) {
  .page {
    padding: 1rem;
  }

  .head {
    flex-direction: column;
    align-items: stretch;
  }

  .period,
  .actions {
    align-items: center;
  }

  .range {
    text-align: right;
  }

  h1 {
    font-size: 1.45rem;
  }

  .stats {
    grid-template-columns: 1fr 1fr;
  }

  .stat strong {
    font-size: 1.15rem;
  }

  .table-wrap {
    display: none;
  }

  .cards {
    display: flex;
    flex-direction: column;
  }

  .summary__head {
    align-items: center;
  }
}

@media (max-width: 420px) {
  .page {
    padding: 0.85rem 0.75rem 1.5rem;
  }

  .period {
    flex-direction: column;
    align-items: stretch;
    gap: 0.55rem;
  }

  .month {
    width: 100%;
  }

  .month select {
    flex: 1;
    min-width: 0;
  }

  .head .range {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 0.75rem;
    text-align: left;
  }

  .range strong {
    display: inline;
    flex: none;
  }

  .head .range span {
    margin: 0;
    font-size: 0.8rem;
    white-space: nowrap;
  }

  .stats {
    gap: 0.55rem;
  }

  .stat {
    min-height: 0;
    padding: 0.75rem 0.7rem 0.85rem;
  }

  .stat > span {
    font-size: 0.78rem;
    line-height: 1.25;
  }

  .stat strong {
    margin-top: 0.35rem;
    font-size: 1.02rem;
  }

  .stat small {
    font-size: 0.75rem;
    line-height: 1.3;
  }

  .actions {
    flex-direction: column;
    align-items: stretch;
  }

  .btn-add,
  .btn-record {
    white-space: nowrap;
  }

  .summary__head {
    flex-wrap: nowrap;
    align-items: center;
    gap: 0.5rem;
  }

  .summary h2 {
    font-size: 1rem;
  }

  .summary__head a {
    margin-left: auto;
    font-size: 0.8rem;
    white-space: nowrap;
  }

  .card__top {
    align-items: center;
  }
}
</style>
