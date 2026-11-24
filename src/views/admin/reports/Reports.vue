<template>
  <section class="page">
    <header class="head">
      <div>
        <h1>Reports</h1>
        <p>Monthly purchases, payments and wholesaler balances</p>
      </div>
    </header>

    <div class="body">
    <form class="filters filters--desktop" @submit.prevent="apply">
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

    <div class="filters-mobile">
      <label class="mobile-filter mobile-filter--wholesaler">
        <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
          <path d="M5 10h14M7 10V6h10v4M8 10v8M16 10v8M5 18h14M9 6V4h6v2" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" />
        </svg>
        <span class="sr-only">Wholesaler</span>
        <select v-model="draft.wholesalerId" @change="apply">
          <option value="">All wholesalers</option>
          <option v-for="item in wholesalerOptions" :key="item.wholesalerId" :value="String(item.wholesalerId)">
            {{ item.wholesalerName }}
          </option>
        </select>
        <svg class="mobile-filter__chevron" viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
          <path d="m6 9 6 6 6-6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </label>

      <label class="mobile-filter mobile-filter--period">
        <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
          <path d="M7 3v3M17 3v3M4 9h16M5 5h14a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
        </svg>
        <span class="sr-only">Report month and year</span>
        <select :value="periodValue" @change="onPeriodChange">
          <option v-for="option in periodOptions" :key="option.value" :value="option.value">{{ option.label }}</option>
        </select>
        <svg class="mobile-filter__chevron" viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
          <path d="m6 9 6 6 6-6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </label>
    </div>

    <p v-if="loading" class="status">Loading report…</p>
    <p v-if="error" class="status status--error" role="alert">{{ error }}</p>

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
            <div class="card__top">
              <div class="who">
                <span class="avatar" :class="`avatar--${item.tone}`" aria-hidden="true">{{ item.initials }}</span>
                <RouterLink class="name" :to="`/admin/wholesalers/${item.wholesalerId}`">{{ item.wholesalerName }}</RouterLink>
              </div>
              <div class="card__due">
                <span>{{ item.outstanding > 0 ? "Due" : "Balance" }}</span>
                <strong :class="{ 'is-due': item.outstanding > 0 }">{{ item.outstanding > 0 ? formatInr(item.outstanding) : "Settled" }}</strong>
              </div>
            </div>
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
            <div class="card__total-head">
              <strong>Total</strong>
              <span>{{ periodLabel }}</span>
            </div>
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

    <p class="note">Opening balance is the balance at the start of {{ periodLabel }}. Purchases and payments are for that month. Outstanding balance is the closing balance for the month.</p>
    </div>
  </section>
</template>

<script>
import { fetchWholesalerSummaries } from "../../../data/reports";
import { formatInr, nameInitials, nameTone } from "../../../data/wholesalers";

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
      summaries: [],
      loading: false,
      error: "",
    };
  },
  computed: {
    wholesalerOptions() {
      return [...this.summaries].sort((a, b) => String(a.wholesalerName || "").localeCompare(String(b.wholesalerName || "")));
    },
    periodLabel() {
      const month = MONTHS.find((item) => item.value === this.applied.month);
      return `${month ? month.label : ""} ${this.applied.year}`;
    },
    periodOptions() {
      return this.years.reduce((options, year) => {
        MONTHS.forEach((month) => {
          options.push({
            value: `${year}-${String(month.value).padStart(2, "0")}`,
            label: `${month.label.slice(0, 3)} ${year}`,
          });
        });
        return options;
      }, []);
    },
    periodValue() {
      return `${this.draft.year}-${String(this.draft.month).padStart(2, "0")}`;
    },
    rows() {
      const selected = this.applied.wholesalerId;
      return this.wholesalerOptions
        .filter((item) => !selected || String(item.wholesalerId) === String(selected))
        .map((item) => ({
          wholesalerId: item.wholesalerId,
          wholesalerName: item.wholesalerName || "Wholesaler",
          openingDue: Number(item.openingBalance) || 0,
          purchases: Number(item.totalPurchases) || 0,
          payments: Number(item.totalPayments) || 0,
          outstanding: Number(item.closingBalance) || 0,
          initials: nameInitials(item.wholesalerName),
          tone: nameTone(item.wholesalerName),
        }));
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
  created() {
    this.load();
  },
  methods: {
    formatInr,
    async load() {
      this.loading = true;
      this.error = "";
      try {
        this.summaries = await fetchWholesalerSummaries(this.applied.year, this.applied.month);
      } catch (err) {
        this.summaries = [];
        this.error = err.message || "Could not load the wholesaler summary.";
      } finally {
        this.loading = false;
      }
    },
    apply() {
      this.applied = {
        month: this.draft.month,
        year: this.draft.year,
        wholesalerId: this.draft.wholesalerId,
      };
      this.load();
    },
    onPeriodChange(event) {
      const [year, month] = String(event.target.value).split("-");
      this.draft.year = Number(year);
      this.draft.month = Number(month);
      this.apply();
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

.filters-mobile {
  display: none;
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

.summary__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
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

@media (max-width: 800px) {
  .page {
    background: #f6f8fa;
  }

  .head {
    padding: 1.1rem 0 0;
  }

  h1 {
    font-size: 1.6rem;
    font-weight: 800;
  }

  .head p {
    margin-top: 0.3rem;
    font-size: 0.9rem;
  }

  .stats {
    gap: 0.75rem;
    margin-top: 1rem;
  }

  .stat {
    min-height: 132px;
    padding: 1rem 0.95rem;
    border-radius: 16px;
  }

  .stat__icon {
    width: 36px;
    height: 36px;
    margin-bottom: 0.8rem;
    border-radius: 10px;
  }

  .stat > span:not(.stat__icon) {
    color: #34414a;
    font-size: 0.82rem;
    font-weight: 500;
  }

  .stat strong {
    margin-top: 0.4rem;
    font-size: clamp(1.3rem, 6vw, 1.65rem);
    font-weight: 800;
  }

  .summary {
    margin-top: 1.25rem;
  }

  .summary h2 {
    font-size: 1.2rem;
    font-weight: 800;
  }

  .cards {
    gap: 0.75rem;
    margin-top: 0.8rem;
  }

  .card {
    padding: 1rem;
    border-radius: 16px;
  }

  .card__top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
  }

  .who {
    display: flex;
    align-items: center;
    gap: 0.65rem;
    min-width: 0;
  }

  .avatar {
    display: inline-grid;
    place-items: center;
    width: 34px;
    height: 34px;
    flex: none;
    border-radius: 9px;
    font-size: 0.72rem;
    font-weight: 700;
  }

  .avatar--teal { background: #e3f6ef; color: #0f766e; }
  .avatar--orange { background: #fdeee2; color: #c2410c; }
  .avatar--blue { background: #e7f0fd; color: #1d4ed8; }
  .avatar--violet { background: #f1eafd; color: #6d28d9; }
  .avatar--rose { background: #fde8ec; color: #be123c; }
  .avatar--amber { background: #fdf3d8; color: #a16207; }

  .card .name {
    overflow: hidden;
    color: #0f172a;
    font-weight: 700;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .card__due {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    flex: none;
  }

  .card__due span {
    color: #94a3b8;
    font-size: 0.66rem;
    font-weight: 600;
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }

  .card__due strong {
    color: #0f766e;
    font-size: 0.9rem;
  }

  .card__due strong.is-due,
  .card dd.due {
    color: #b45309;
  }

  .card dl {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 0.75rem;
    margin-top: 1rem;
  }

  .card dl > div {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.2rem;
  }

  .card dt {
    color: #94a3b8;
    font-size: 0.68rem;
    font-weight: 700;
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }

  .card dd {
    color: #0f172a;
    font-size: 0.95rem;
  }

  .card__total-head {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 1rem;
  }

  .card__total-head strong {
    font-size: 1rem;
  }

  .card__total-head span {
    color: #64748b;
    font-size: 0.78rem;
  }

  .note {
    margin-top: 0.85rem;
    font-size: 0.8rem;
    line-height: 1.5;
  }
}

@media (max-width: 800px) {
  .filters--desktop {
    display: none;
  }

  .filters-mobile {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 0.65rem;
    margin-top: 1.1rem;
  }

  .mobile-filter {
    position: relative;
    display: flex;
    align-items: center;
    min-width: 0;
    height: 46px;
    gap: 0.45rem;
    padding: 0 0.75rem;
    border: 1px solid #bdcdcc;
    border-radius: 14px;
    background: #fff;
    color: #0f766e;
  }

  .mobile-filter select {
    appearance: none;
    width: 100%;
    min-width: 0;
    height: 100%;
    padding: 0 1.2rem 0 0;
    overflow: hidden;
    border: 0;
    outline: 0;
    background: transparent;
    color: #1f2933;
    font: inherit;
    font-size: 0.82rem;
    font-weight: 600;
    text-overflow: ellipsis;
    white-space: nowrap;
    cursor: pointer;
  }

  .mobile-filter:focus-within {
    border-color: #0f766e;
    box-shadow: 0 0 0 3px rgba(15, 118, 110, 0.12);
  }

  .mobile-filter__chevron {
    position: absolute;
    right: 0.7rem;
    color: #64748b;
    pointer-events: none;
  }

  .summary__head {
    align-items: baseline;
  }

  .summary__head p {
    flex: none;
    margin-top: 0;
    font-size: 0.82rem;
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

@media (min-width: 801px) {
  .page {
    max-width: none;
    min-height: 100vh;
    padding: 0;
    background: #f6f8fa;
  }

  .head {
    padding: 1.1rem 1.6rem 1rem;
    background: #fff;
    border-bottom: 1px solid #eef1f4;
  }

  .head h1 {
    font-size: 1.45rem;
    font-weight: 700;
    letter-spacing: -0.02em;
  }

  .head p {
    margin-top: 0.2rem;
    font-size: 0.84rem;
  }

  .body {
    max-width: 1240px;
    padding: 1.6rem;
  }

  .filters--desktop {
    margin-top: 0;
    border-radius: 16px;
  }

  .stats {
    gap: 1rem;
    margin-top: 1.25rem;
  }

  .stat {
    min-height: 140px;
    padding: 1.05rem 1.05rem 0.95rem;
    border-radius: 16px;
  }

  .stat strong {
    font-size: 1.55rem;
    font-weight: 800;
  }

  .summary {
    margin-top: 1.4rem;
  }

  .summary h2 {
    font-size: 1.1rem;
    font-weight: 700;
  }

  .table-wrap,
  .card {
    border-radius: 16px;
  }
}

@media (max-width: 800px) {
  .body {
    padding: 0 0 2rem;
  }
}
</style>
