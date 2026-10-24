<template>
  <section class="page">
    <header class="head">
      <div>
        <h1>Reports</h1>
        <p>Monthly purchases, payments and wholesaler balances</p>
      </div>
    </header>

    <form class="filters" @submit.prevent="apply">
      <label>
        Month
        <select v-model.number="draft.month">
          <option v-for="item in months" :key="item.value" :value="item.value">{{ item.label }}</option>
        </select>
      </label>
      <label>
        Year
        <select v-model.number="draft.year">
          <option v-for="year in years" :key="year" :value="year">{{ year }}</option>
        </select>
      </label>
      <label>
        Wholesaler
        <select v-model="draft.wholesalerId">
          <option value="">All wholesalers</option>
          <option v-for="item in wholesalerOptions" :key="item.wholesalerId" :value="String(item.wholesalerId)">
            {{ item.wholesalerName }}
          </option>
        </select>
      </label>
      <button type="submit">Apply</button>
    </form>

    <p v-if="loading" class="status">Loading report…</p>
    <p v-if="error" class="status status--error" role="alert">{{ error }}</p>
    <p v-if="billsError" class="status status--error" role="alert">{{ billsError }}</p>
    <p v-if="paymentsError" class="status status--error" role="alert">{{ paymentsError }}</p>

    <div class="stats">
      <article class="stat stat--opening">
        <span class="stat__icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="18" height="18">
            <path d="M4 10h16v9a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-9zM3 10l2.2-4h13.6L21 10M12 13v4" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round" />
          </svg>
        </span>
        <span>Opening balance</span>
        <strong>{{ formatInr(totals.opening) }}</strong>
      </article>
      <article class="stat stat--purchase">
        <span class="stat__icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="18" height="18">
            <path d="M6 7h15l-1.5 9h-12L6 7zM6 7 5 4H2" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round" />
            <path d="M9 20a1 1 0 1 0 0-2 1 1 0 0 0 0 2zM17 20a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" fill="currentColor" />
          </svg>
        </span>
        <span>Purchases</span>
        <strong>{{ formatInr(totals.purchases) }}</strong>
      </article>
      <article class="stat stat--payment">
        <span class="stat__icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="18" height="18">
            <path d="M3 7h18v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7zM3 10h18M7 15h4" fill="none" stroke="currentColor" stroke-width="1.7" />
          </svg>
        </span>
        <span>Payments</span>
        <strong>{{ formatInr(totals.payments) }}</strong>
      </article>
      <article class="stat stat--due">
        <span class="stat__icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="18" height="18">
            <path d="M4 19V5M4 19h16M8 16v-4M12 16V8M16 16v-6" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" />
          </svg>
        </span>
        <span>Outstanding balance</span>
        <strong>{{ formatInr(totals.outstanding) }}</strong>
      </article>
    </div>

    <section class="summary">
      <header class="summary__head">
        <div>
          <h2>Wholesaler summary</h2>
          <p>{{ periodLabel }}</p>
        </div>
      </header>

      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th scope="col">Wholesaler</th>
              <th scope="col">Opening balance</th>
              <th scope="col">Purchases</th>
              <th scope="col">Payments</th>
              <th scope="col">Outstanding balance</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="loading">
              <td colspan="5" class="empty">Loading wholesalers…</td>
            </tr>
            <tr v-else-if="!rows.length && !error">
              <td colspan="5" class="empty">No wholesalers for this report.</td>
            </tr>
            <template v-else>
              <tr v-for="item in rows" :key="item.wholesalerId">
                <td>
                  <RouterLink class="name" :to="`/admin/wholesalers/${item.wholesalerId}`">{{ item.wholesalerName }}</RouterLink>
                </td>
                <td>{{ formatInr(item.openingDue) }}</td>
                <td>{{ formatInr(item.purchases) }}</td>
                <td>{{ formatInr(item.payments) }}</td>
                <td :class="{ due: item.outstanding > 0 }">{{ formatInr(item.outstanding) }}</td>
              </tr>
              <tr class="total">
                <th scope="row">Total</th>
                <td>{{ formatInr(totals.opening) }}</td>
                <td>{{ formatInr(totals.purchases) }}</td>
                <td>{{ formatInr(totals.payments) }}</td>
                <td :class="{ due: totals.outstanding > 0 }">{{ formatInr(totals.outstanding) }}</td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>

      <ul class="cards">
        <li v-if="loading" class="card empty">Loading wholesalers…</li>
        <li v-else-if="!rows.length && !error" class="card empty">No wholesalers for this report.</li>
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
                <dd>{{ formatInr(item.purchases) }}</dd>
              </div>
              <div>
                <dt>Payments</dt>
                <dd>{{ formatInr(item.payments) }}</dd>
              </div>
              <div>
                <dt>Outstanding balance</dt>
                <dd :class="{ due: item.outstanding > 0 }">{{ formatInr(item.outstanding) }}</dd>
              </div>
            </dl>
          </li>
          <li class="card card--total">
            <strong>Total</strong>
            <dl>
              <div>
                <dt>Opening balance</dt>
                <dd>{{ formatInr(totals.opening) }}</dd>
              </div>
              <div>
                <dt>Purchases</dt>
                <dd>{{ formatInr(totals.purchases) }}</dd>
              </div>
              <div>
                <dt>Payments</dt>
                <dd>{{ formatInr(totals.payments) }}</dd>
              </div>
              <div>
                <dt>Outstanding balance</dt>
                <dd :class="{ due: totals.outstanding > 0 }">{{ formatInr(totals.outstanding) }}</dd>
              </div>
            </dl>
          </li>
        </template>
      </ul>
    </section>

    <p class="note">Outstanding balance is the current due. Purchases and payments are for {{ periodLabel }}. Opening balance is the recorded opening due.</p>
  </section>
</template>

<script>
import { fetchOutstandingDues, formatInr } from "../../../data/wholesalers";
import { fetchPurchaseBills } from "../../../data/purchaseBills";
import { fetchPayments } from "../../../data/payments";

const MONTHS = [
  { value: 1, label: "January" },
  { value: 2, label: "February" },
  { value: 3, label: "March" },
  { value: 4, label: "April" },
  { value: 5, label: "May" },
  { value: 6, label: "June" },
  { value: 7, label: "July" },
  { value: 8, label: "August" },
  { value: 9, label: "September" },
  { value: 10, label: "October" },
  { value: 11, label: "November" },
  { value: 12, label: "December" },
];

function parseDate(value) {
  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime()) ? null : date;
}

function inMonth(value, year, month) {
  const date = parseDate(value);
  return Boolean(date) && date.getFullYear() === year && date.getMonth() + 1 === month;
}

export default {
  name: "AdminReports",
  data() {
    const now = new Date();
    const initial = { month: now.getMonth() + 1, year: now.getFullYear(), wholesalerId: "" };
    return {
      months: MONTHS,
      years: [now.getFullYear(), now.getFullYear() - 1, now.getFullYear() - 2, now.getFullYear() - 3, now.getFullYear() - 4],
      draft: { ...initial },
      applied: { ...initial },
      dues: [],
      bills: [],
      payments: [],
      loading: false,
      error: "",
      billsError: "",
      paymentsError: "",
    };
  },
  computed: {
    wholesalerOptions() {
      return [...this.dues].sort((a, b) => String(a.wholesalerName || "").localeCompare(String(b.wholesalerName || "")));
    },
    periodLabel() {
      const month = MONTHS.find((item) => item.value === this.applied.month);
      return `${month ? month.label : ""} ${this.applied.year}`;
    },
    rows() {
      const selected = this.applied.wholesalerId;
      return this.wholesalerOptions
        .filter((item) => !selected || String(item.wholesalerId) === String(selected))
        .map((item) => {
          const id = String(item.wholesalerId);
          const purchases = this.bills.reduce((sum, bill) => {
            if (String(bill.wholesalerId) !== id) return sum;
            if (!inMonth(bill.billDate, this.applied.year, this.applied.month)) return sum;
            return sum + (Number(bill.totalAmount) || 0);
          }, 0);
          const payments = this.payments.reduce((sum, payment) => {
            if (String(payment.wholesalerId) !== id) return sum;
            if (!inMonth(payment.paymentDate, this.applied.year, this.applied.month)) return sum;
            return sum + (Number(payment.amount) || 0);
          }, 0);
          return {
            wholesalerId: item.wholesalerId,
            wholesalerName: item.wholesalerName || "Wholesaler",
            openingDue: Number(item.openingDue) || 0,
            purchases,
            payments,
            outstanding: Number(item.currentDue) || 0,
          };
        });
    },
    totals() {
      return this.rows.reduce((sum, item) => ({
        opening: sum.opening + item.openingDue,
        purchases: sum.purchases + item.purchases,
        payments: sum.payments + item.payments,
        outstanding: sum.outstanding + item.outstanding,
      }), { opening: 0, purchases: 0, payments: 0, outstanding: 0 });
    },
  },
  async created() {
    this.loading = true;
    const [dues, bills, payments] = await Promise.allSettled([
      fetchOutstandingDues(),
      fetchPurchaseBills(),
      fetchPayments(),
    ]);
    if (dues.status === "fulfilled") this.dues = dues.value;
    else this.error = (dues.reason && dues.reason.message) || "Could not load the outstanding balances.";
    if (bills.status === "fulfilled") this.bills = bills.value;
    else this.billsError = (bills.reason && bills.reason.message) || "Could not load purchases for this month.";
    if (payments.status === "fulfilled") this.payments = payments.value;
    else this.paymentsError = (payments.reason && payments.reason.message) || "Could not load payments for this month.";
    this.loading = false;
  },
  methods: {
    formatInr,
    apply() {
      this.applied = {
        month: this.draft.month,
        year: this.draft.year,
        wholesalerId: this.draft.wholesalerId,
      };
    },
  },
};
</script>

<style scoped>
.page {
  max-width: 1100px;
  padding: 1.5rem 1.75rem 2.5rem;
}

h1 {
  margin: 0;
  color: #0f172a;
  font-size: 1.7rem;
  letter-spacing: -0.03em;
}

.head p,
.summary__head p,
.note,
.empty,
.status {
  margin: 0.3rem 0 0;
  color: #64748b;
  font-size: 0.92rem;
}

.filters {
  display: grid;
  grid-template-columns: 1fr 1fr 1.4fr auto;
  gap: 0.75rem;
  align-items: end;
  margin-top: 1rem;
  padding: 1rem;
  border: 1px solid #e6eeec;
  border-radius: 14px;
  background: #fff;
}

.filters label {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  color: #64748b;
  font-size: 0.78rem;
  font-weight: 600;
}

.filters select {
  width: 100%;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 0.6rem 0.7rem;
  background: #fff;
  color: #0f172a;
  font: inherit;
  font-weight: 600;
}

.filters button {
  border: 0;
  border-radius: 8px;
  padding: 0.68rem 1.25rem;
  background: #0f766e;
  color: #fff;
  font: inherit;
  font-weight: 600;
  cursor: pointer;
}

.filters button:hover {
  background: #115e59;
}

.status {
  font-weight: 600;
}

.status--error {
  color: #b91c1c;
}

.stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.75rem;
  margin-top: 0.9rem;
}

.stat {
  display: flex;
  flex-direction: column;
  min-height: 132px;
  border-radius: 14px;
  padding: 0.95rem 1rem 1rem;
  background: #fff;
  border: 1px solid #e6eeec;
}

.stat span {
  color: #64748b;
  font-size: 0.86rem;
}

.stat strong {
  margin-top: auto;
  color: #0f172a;
  font-size: 1.35rem;
  letter-spacing: -0.03em;
}

.stat__icon {
  width: 32px;
  height: 32px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.7rem;
  border-radius: 10px;
}

.stat--opening .stat__icon {
  background: #eff6ff;
  color: #1d4ed8;
}

.stat--purchase .stat__icon {
  background: #ecfdf5;
  color: #0f766e;
}

.stat--payment .stat__icon {
  background: #eff6ff;
  color: #1d4ed8;
}

.stat--due .stat__icon {
  background: #fff7ed;
  color: #c2410c;
}

.summary {
  margin-top: 1.2rem;
}

.summary h2 {
  margin: 0;
  color: #0f172a;
  font-size: 1.05rem;
}

.table-wrap,
.card {
  margin-top: 0.75rem;
  background: #fff;
  border: 1px solid #e6eeec;
  border-radius: 14px;
  overflow: hidden;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  padding: 0.9rem 1rem;
  border-bottom: 1px solid #eef3f2;
  text-align: left;
  font-size: 0.92rem;
  color: #0f172a;
}

thead th {
  color: #64748b;
  font-size: 0.78rem;
  font-weight: 600;
  background: #f8fbfa;
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

.total th,
.total td {
  background: #f8fbfa;
  font-weight: 700;
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
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
  margin: 0.8rem 0 0;
}

.card dl > div {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
}

.card dt {
  color: #64748b;
  font-size: 0.78rem;
}

.card dd {
  margin: 0;
  font-weight: 700;
}

.card--total {
  background: #f8fbfa;
}

@media (max-width: 800px) {
  .page {
    padding: 1rem;
  }

  h1 {
    font-size: 1.45rem;
  }

  .filters {
    grid-template-columns: 1fr 1fr;
  }

  .filters label:nth-child(3),
  .filters button {
    grid-column: 1 / -1;
  }

  .stats {
    grid-template-columns: 1fr 1fr;
  }

  .stat {
    min-height: 0;
  }

  .stat strong {
    margin-top: 0.45rem;
    font-size: 1.15rem;
  }

  .table-wrap {
    display: none;
  }

  .cards {
    display: flex;
    flex-direction: column;
  }
}

@media (max-width: 420px) {
  .page {
    padding: 0.85rem 0.75rem 1.5rem;
  }

  .stat {
    padding: 0.75rem 0.7rem 0.85rem;
  }

  .stat > span {
    font-size: 0.78rem;
    line-height: 1.25;
  }

  .stat strong {
    font-size: 1.02rem;
  }
}
</style>
