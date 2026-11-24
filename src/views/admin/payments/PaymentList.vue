<template>
  <section class="page">
    <header class="head">
      <div>
        <h1>Payments</h1>
        <p>Payments made to wholesalers</p>
      </div>
      <RouterLink class="btn-primary" to="/admin/payments/new">
        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
          <path d="M12 5v14M5 12h14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
        </svg>
        <span>Record payment</span>
      </RouterLink>
    </header>

    <div class="body">
      <section class="panel">
        <div class="toolbar toolbar--desktop">
          <label class="search">
            <span class="sr-only">Search payments</span>
            <svg viewBox="0 0 24 24" width="17" height="17" aria-hidden="true">
              <circle cx="11" cy="11" r="6.5" fill="none" stroke="currentColor" stroke-width="1.8" />
              <path d="m16 16 4 4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
            </svg>
            <input v-model="query" type="search" placeholder="Search payment or wholesaler" />
          </label>
          <div class="filters" role="group" aria-label="Payment filters">
            <label class="filter-field">
              <span class="sr-only">Wholesaler</span>
              <select v-model="wholesalerId">
                <option value="">All wholesalers</option>
                <option v-for="item in wholesalerOptions" :key="item.id" :value="String(item.id)">{{ item.name }}</option>
              </select>
            </label>
            <label class="filter-field">
              <span class="sr-only">Month</span>
              <select v-model="month">
                <option value="">All months</option>
                <option v-for="item in months" :key="item.value" :value="item.value">{{ item.label }}</option>
              </select>
            </label>
            <label class="filter-field">
              <span class="sr-only">Year</span>
              <select v-model="year">
                <option value="">All years</option>
                <option v-for="item in years" :key="item" :value="item">{{ item }}</option>
              </select>
            </label>
          </div>
        </div>

    <div class="mobile-filters">
      <div class="mobile-filters__top">
        <label class="search search--mobile">
          <span class="sr-only">Search payments</span>
          <svg viewBox="0 0 24 24" width="17" height="17" aria-hidden="true">
            <circle cx="11" cy="11" r="6.5" fill="none" stroke="currentColor" stroke-width="1.8" />
            <path d="m16 16 4 4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
          </svg>
          <input v-model="query" type="search" placeholder="Search payment or wholesaler" />
        </label>
        <button
          class="filters-toggle"
          type="button"
          :aria-expanded="filtersOpen ? 'true' : 'false'"
          @click="filtersOpen = !filtersOpen"
        >
          <svg viewBox="0 0 24 24" width="17" height="17" aria-hidden="true">
            <path d="M4 7h16M4 12h16M4 17h16M8 5v4M15 10v4M11 15v4" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" />
          </svg>
          Filters
        </button>
      </div>

      <div class="filter-chips" role="group" aria-label="Quick payment filters">
        <button class="filter-chip" :class="{ 'is-active': methodFilter === 'all' }" type="button" @click="methodFilter = 'all'">All</button>
        <button class="filter-chip" :class="{ 'is-active': methodFilter === 'CASH' }" type="button" @click="methodFilter = 'CASH'">Cash</button>
        <button class="filter-chip" :class="{ 'is-active': methodFilter === 'UPI' }" type="button" @click="methodFilter = 'UPI'">UPI</button>
        <button class="filter-chip" :class="{ 'is-active': methodFilter === 'BANK_TRANSFER' }" type="button" @click="methodFilter = 'BANK_TRANSFER'">Bank transfer</button>
        <button class="filter-chip" :class="{ 'is-active': methodFilter === 'CHEQUE' }" type="button" @click="methodFilter = 'CHEQUE'">Cheque</button>
        <label class="filter-chip filter-chip--select">
          <span class="sr-only">Wholesaler</span>
          <select v-model="wholesalerId" aria-label="Wholesaler">
            <option value="">Wholesaler</option>
            <option v-for="item in wholesalerOptions" :key="item.id" :value="String(item.id)">{{ item.name }}</option>
          </select>
        </label>
        <button v-if="month" class="filter-chip filter-chip--selected" type="button" @click="month = ''">{{ monthLabel }} ×</button>
        <button v-if="year" class="filter-chip filter-chip--selected" type="button" @click="year = ''">{{ year }} ×</button>
      </div>

      <div v-if="filtersOpen" class="mobile-filters__panel">
        <div class="mobile-filters__panel-head">
          <strong>Filter payments</strong>
          <button type="button" @click="clearFilters">Clear all</button>
        </div>
        <div class="mobile-filters__fields">
          <label class="filter-field">
            <span>Month</span>
            <select v-model="month">
              <option value="">All months</option>
              <option v-for="item in months" :key="item.value" :value="item.value">{{ item.label }}</option>
            </select>
          </label>
          <label class="filter-field">
            <span>Year</span>
            <select v-model="year">
              <option value="">All years</option>
              <option v-for="item in years" :key="item" :value="item">{{ item }}</option>
            </select>
          </label>
        </div>
      </div>

      <p class="results-count">Showing {{ filteredRows.length }} {{ filteredRows.length === 1 ? "payment" : "payments" }}</p>
    </div>

        <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th scope="col">Date</th>
            <th scope="col">Wholesaler</th>
            <th scope="col">Amount</th>
            <th scope="col">Payment method</th>
            <th scope="col">Reference</th>
            <th scope="col">Notes</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="loading">
            <td colspan="6" class="empty">Loading payments…</td>
          </tr>
          <tr v-else-if="error">
            <td colspan="6" class="load-error">{{ error }}</td>
          </tr>
          <tr v-else-if="!filteredRows.length">
            <td colspan="6" class="empty">{{ emptyMessage }}</td>
          </tr>
          <template v-else>
            <tr v-for="payment in filteredRows" :key="payment.id">
              <td>
                <RouterLink class="link" :to="`/admin/payments/${payment.id}`">{{ formatPaymentDate(payment.paymentDate) }}</RouterLink>
              </td>
              <td>{{ payment.wholesalerName }}</td>
              <td class="amount">{{ formatInr(payment.amount) }}</td>
              <td>{{ methodLabel(payment.method) }}</td>
              <td>{{ payment.reference || "—" }}</td>
              <td>{{ payment.notes || "—" }}</td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>

        <ul class="cards">
      <li v-if="loading" class="card empty">Loading payments…</li>
      <li v-else-if="error" class="card load-error">{{ error }}</li>
      <li v-else-if="!filteredRows.length" class="card empty">{{ emptyMessage }}</li>
      <template v-else>
        <li v-for="payment in filteredRows" :key="payment.id" class="card">
          <div class="card__top">
            <RouterLink class="link" :to="`/admin/payments/${payment.id}`">{{ formatPaymentDate(payment.paymentDate) }}</RouterLink>
            <strong class="card__amount">{{ formatInr(payment.amount) }}</strong>
          </div>
          <div class="card__who">
            <span class="avatar" :class="`avatar--${nameTone(payment.wholesalerName)}`" aria-hidden="true">{{ nameInitials(payment.wholesalerName) }}</span>
            <RouterLink class="name" :to="wholesalerLink(payment)">{{ payment.wholesalerName || "Unknown wholesaler" }}</RouterLink>
          </div>
          <div class="card__details">
            <div><span>Method</span><strong>{{ methodLabel(payment.method) }}</strong></div>
            <div><span>Reference</span><strong>{{ payment.reference || "—" }}</strong></div>
          </div>
          <p v-if="payment.notes" class="card__notes">{{ payment.notes }}</p>
          <RouterLink class="card__action" :to="`/admin/payments/${payment.id}`">View payment</RouterLink>
        </li>
      </template>
    </ul>

        <footer v-if="!loading && !error && totalElements" class="pager">
      <p>{{ rangeLabel }}</p>
      <div>
        <button type="button" :disabled="page === 0" @click="page -= 1">‹</button>
        <button
          v-for="number in totalPages"
          :key="number"
          type="button"
          :class="{ 'is-on': number - 1 === page }"
          @click="page = number - 1"
        >
          {{ number }}
        </button>
        <button type="button" :disabled="page + 1 >= totalPages" @click="page += 1">›</button>
      </div>
        </footer>
      </section>
    </div>
  </section>
</template>

<script>
import { fetchWholesalers, formatInr, nameInitials, nameTone } from "../../../data/wholesalers";
import { fetchPayments, formatPaymentDate, methodLabel } from "../../../data/payments";

const PAGE_SIZE = 20;

const MONTHS = [
  { value: "1", label: "Jan" },
  { value: "2", label: "Feb" },
  { value: "3", label: "Mar" },
  { value: "4", label: "Apr" },
  { value: "5", label: "May" },
  { value: "6", label: "Jun" },
  { value: "7", label: "Jul" },
  { value: "8", label: "Aug" },
  { value: "9", label: "Sep" },
  { value: "10", label: "Oct" },
  { value: "11", label: "Nov" },
  { value: "12", label: "Dec" },
];

function yearOptions() {
  const current = new Date().getFullYear();
  const years = [];
  for (let year = current; year >= current - 7; year -= 1) years.push(String(year));
  return years;
}

export default {
  name: "PaymentList",
  data() {
    return {
      rows: [],
      wholesalers: [],
      wholesalerId: "",
      month: "",
      year: "",
      months: MONTHS,
      years: yearOptions(),
      page: 0,
      totalElements: 0,
      totalPages: 0,
      query: "",
      methodFilter: "all",
      filtersOpen: false,
      loading: false,
      error: "",
      requestId: 0,
      loadedKey: "",
    };
  },
  computed: {
    wholesalerOptions() {
      return [...this.wholesalers].sort((a, b) => String(a.name || "").localeCompare(String(b.name || "")));
    },
    paymentFilters() {
      const filters = { page: this.page, size: PAGE_SIZE };
      if (this.wholesalerId) filters.wholesalerId = this.wholesalerId;
      if (this.month) filters.month = Number(this.month);
      if (this.year) filters.year = Number(this.year);
      return filters;
    },
    monthLabel() {
      const selected = this.months.find((item) => item.value === String(this.month));
      return selected ? selected.label : "Month";
    },
    emptyMessage() {
      if (this.query.trim() || this.methodFilter !== "all" || this.wholesalerId || this.month || this.year) return "No payments match these filters.";
      return "No payments yet.";
    },
    filteredRows() {
      const query = this.query.trim().toLowerCase();
      const selectedWholesaler = this.wholesalerOptions.find((item) => String(item.id) === String(this.wholesalerId));
      return this.rows.filter((payment) => {
        const matchesQuery = !query
          || String(payment.wholesalerName || "").toLowerCase().includes(query)
          || String(payment.reference || "").toLowerCase().includes(query)
          || String(methodLabel(payment.method)).toLowerCase().includes(query);
        if (!matchesQuery) return false;
        if (this.methodFilter !== "all" && payment.method !== this.methodFilter) return false;

        if (this.wholesalerId) {
          const matchesId = payment.wholesalerId !== undefined && payment.wholesalerId !== null && payment.wholesalerId !== ""
            && String(payment.wholesalerId) === String(this.wholesalerId);
          const matchesName = selectedWholesaler && String(payment.wholesalerName || "").toLowerCase() === String(selectedWholesaler.name || "").toLowerCase();
          if (!matchesId && !matchesName) return false;
        }

        if (this.month || this.year) {
          const date = new Date(`${payment.paymentDate}T00:00:00`);
          if (Number.isNaN(date.getTime())) return false;
          if (this.month && date.getMonth() + 1 !== Number(this.month)) return false;
          if (this.year && date.getFullYear() !== Number(this.year)) return false;
        }

        return true;
      });
    },
    rangeLabel() {
      if (!this.totalElements || !this.rows.length) return "";
      const start = this.page * PAGE_SIZE + 1;
      const end = start + this.rows.length - 1;
      const noun = this.totalElements === 1 ? "payment" : "payments";
      return `Showing ${start}–${end} of ${this.totalElements} ${noun}`;
    },
  },
  watch: {
    wholesalerId() {
      if (this.page !== 0) this.page = 0;
    },
    month() {
      if (this.page !== 0) this.page = 0;
    },
    year() {
      if (this.page !== 0) this.page = 0;
    },
    methodFilter() {
      if (this.page !== 0) this.page = 0;
    },
    paymentFilters: {
      immediate: true,
      handler(filters) {
        const key = JSON.stringify(filters);
        if (key === this.loadedKey) return;
        this.loadedKey = key;
        this.load();
      },
    },
  },
  async created() {
    try {
      this.wholesalers = await fetchWholesalers();
    } catch (err) {
      this.wholesalers = [];
    }
  },
  methods: {
    formatInr,
    formatPaymentDate,
    methodLabel,
    nameInitials,
    nameTone,
    wholesalerLink(payment) { return payment && payment.wholesalerId ? `/admin/wholesalers/${payment.wholesalerId}` : "/admin/wholesalers"; },
    clearFilters() {
      this.query = "";
      this.methodFilter = "all";
      this.wholesalerId = "";
      this.month = "";
      this.year = "";
      this.filtersOpen = false;
    },
    async load() {
      const requestId = this.requestId + 1;
      this.requestId = requestId;
      this.loading = true;
      this.error = "";
      try {
        const data = await fetchPayments(this.paymentFilters);
        if (this.requestId !== requestId) return;
        this.rows = data.items;
        this.totalElements = data.totalElements;
        this.totalPages = data.totalPages;
      } catch (err) {
        if (this.requestId !== requestId) return;
        this.rows = [];
        this.totalElements = 0;
        this.totalPages = 0;
        this.error = err.message || "Could not load payments.";
      } finally {
        if (this.requestId === requestId) this.loading = false;
      }
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
.card__top,
.pager {
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
.card p,
.empty,
.pager p {
  margin: 0.3rem 0 0;
  color: #64748b;
  font-size: 0.92rem;
}

.head__tools {
  display: flex;
  align-items: center;
  gap: 0.65rem;
}

.head__tools select {
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: #fff;
  padding: 0.65rem 0.75rem;
  font: inherit;
  font-weight: 500;
  color: #0f172a;
}

.btn-add {
  background: #0f766e;
  color: #fff;
  border-radius: 8px;
  padding: 0.7rem 1rem;
  font-weight: 600;
  text-decoration: none;
  white-space: nowrap;
}

.btn-add:hover {
  background: #115e59;
}

.load-error {
  color: #b91c1c;
  font-weight: 600;
}

.hint {
  margin: 0.85rem 0 0;
  color: #64748b;
  font-size: 0.85rem;
}

.table-wrap,
.card {
  margin-top: 1rem;
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

.link {
  color: #0f766e;
  font-weight: 700;
  text-decoration: none;
}

.amount,
.card__top strong {
  font-weight: 700;
}

.pager {
  align-items: center;
  margin-top: 0.8rem;
}

.pager div {
  display: flex;
  gap: 0.35rem;
}

.pager button {
  min-width: 2rem;
  height: 2rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: #fff;
  color: #0f172a;
  font: inherit;
  font-weight: 600;
  cursor: pointer;
}

.pager button.is-on {
  background: #0f766e;
  border-color: #0f766e;
  color: #fff;
}

.pager button:disabled {
  opacity: 0.45;
  cursor: default;
}

.note {
  margin-top: 0.8rem;
}

.cards {
  display: none;
  list-style: none;
  margin: 1rem 0 0;
  padding: 0;
  gap: 0.75rem;
}

.mobile-filters {
  display: none;
}

.card {
  padding: 0.95rem 1rem;
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

@media (min-width: 801px) {
  .page {
    max-width: none;
    min-height: 100vh;
    padding: 0;
    background: #f6f8fa;
    color: #0f172a;
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

  .head .btn-primary {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.45rem;
    height: 40px;
    padding: 0 1rem;
    border-radius: 10px;
    background: #0f766e;
    color: #fff;
    font-size: 0.88rem;
    font-weight: 600;
    text-decoration: none;
    box-shadow: 0 6px 16px rgba(15, 118, 110, 0.18);
  }

  .body {
    max-width: 1240px;
    padding: 1.6rem;
  }

  .panel {
    margin-top: 1.25rem;
    overflow: hidden;
    border: 1px solid #e8edf1;
    border-radius: 16px;
    background: #fff;
  }

  .toolbar {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 1rem 1.25rem;
    border-bottom: 1px solid #eef1f4;
  }

  .toolbar .search {
    position: relative;
    display: flex;
    flex: 1 1 260px;
    max-width: 360px;
    align-items: center;
    color: #94a3b8;
  }

  .toolbar .search svg {
    position: absolute;
    left: 0.8rem;
    pointer-events: none;
  }

  .toolbar .search input {
    width: 100%;
    height: 38px;
    padding: 0 0.85rem 0 2.35rem;
    border: 1px solid #dfe5eb;
    border-radius: 10px;
    background: #f8fafb;
    color: #0f172a;
    font: inherit;
    font-size: 0.86rem;
  }

  .filters {
    display: flex;
    gap: 0.5rem;
    margin-left: auto;
  }

  .filter-field {
    position: relative;
    display: inline-flex;
    align-items: center;
  }

  .filter-field select {
    appearance: none;
    height: 38px;
    min-width: 112px;
    padding: 0 2rem 0 0.75rem;
    border: 1px solid #dfe5eb;
    border-radius: 9px;
    background: #fff;
    color: #334155;
    font: inherit;
    font-size: 0.8rem;
    font-weight: 600;
    cursor: pointer;
  }

  .filter-field:first-child select {
    min-width: 180px;
  }

  .filter-field::after {
    content: "";
    position: absolute;
    right: 0.7rem;
    width: 6px;
    height: 6px;
    border-right: 1.5px solid #64748b;
    border-bottom: 1.5px solid #64748b;
    transform: translateY(-2px) rotate(45deg);
    pointer-events: none;
  }

  .panel .table-wrap {
    margin: 0;
    overflow-x: auto;
    border: 0;
    border-radius: 0;
  }

  .panel table {
    width: 100%;
    border-collapse: collapse;
  }

  .panel th,
  .panel td {
    padding: 0.85rem 1.15rem;
    border-bottom: 1px solid #eef1f4;
    white-space: nowrap;
    text-align: left;
    font-size: 0.84rem;
  }

  .panel th {
    background: #f8fafb;
    color: #64748b;
    font-size: 0.68rem;
    font-weight: 600;
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }

  .panel .amount {
    color: #0f172a;
    font-weight: 700;
  }

  .panel .empty {
    padding: 1.75rem 1.25rem;
    white-space: normal;
    text-align: center;
  }

  .panel .pager {
    margin: 0;
    padding: 0.8rem 1.25rem;
    border-top: 1px solid #eef1f4;
  }
}

@media (max-width: 800px) {
  .page {
    padding: 1rem;
  }

  .head,
  .head__tools,
  .pager {
    flex-direction: column;
    align-items: stretch;
  }

  h1 {
    font-size: 1.45rem;
  }

  .btn-add {
    text-align: center;
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
  .head__tools--desktop {
    display: none;
  }

  .mobile-filters {
    display: block;
    margin-top: 1rem;
  }

  .mobile-filters__top {
    display: flex;
    align-items: center;
    gap: 0.65rem;
  }

  .search--mobile {
    position: relative;
    display: flex;
    flex: 1;
    min-width: 0;
    align-items: center;
    color: #64748b;
  }

  .search--mobile svg {
    position: absolute;
    left: 0.8rem;
    pointer-events: none;
  }

  .search--mobile input {
    width: 100%;
    height: 52px;
    padding: 0 0.85rem 0 2.35rem;
    border: 1px solid #bdcdcc;
    border-radius: 16px;
    background: #fff;
    color: #0f172a;
    font: inherit;
    font-size: 0.9rem;
  }

  .search--mobile input::placeholder {
    color: #64748b;
  }

  .search--mobile input:focus {
    outline: none;
    border-color: #0f766e;
    box-shadow: 0 0 0 3px rgba(15, 118, 110, 0.12);
  }

  .filters-toggle {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex: none;
    gap: 0.4rem;
    height: 52px;
    padding: 0 0.85rem;
    border: 1px solid #bdcdcc;
    border-radius: 16px;
    background: #fff;
    color: #1f2933;
    font: inherit;
    font-size: 0.86rem;
    font-weight: 700;
    cursor: pointer;
  }

  .filters-toggle:hover,
  .filters-toggle[aria-expanded="true"] {
    border-color: #0f766e;
    color: #0f766e;
  }

  .filter-chips {
    display: flex;
    gap: 0.55rem;
    overflow-x: auto;
    padding: 0.65rem 0 0.2rem;
    scrollbar-width: none;
  }

  .filter-chips::-webkit-scrollbar {
    display: none;
  }

  .filter-chip {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex: none;
    height: 36px;
    padding: 0 0.85rem;
    border: 1px solid #bdcdcc;
    border-radius: 999px;
    background: #fff;
    color: #34414a;
    font: inherit;
    font-size: 0.78rem;
    font-weight: 700;
    white-space: nowrap;
    cursor: pointer;
  }

  .filter-chip:hover,
  .filter-chip.is-active {
    border-color: #0f766e;
    color: #fff;
    background: #0f766e;
  }

  .filter-chip--selected {
    border-color: #b8ddd6;
    background: #e7f6f3;
    color: #0f766e;
  }

  .filter-chip--select {
    position: relative;
    padding: 0;
    overflow: hidden;
  }

  .filter-chip--select::after {
    content: "";
    position: absolute;
    right: 0.7rem;
    width: 6px;
    height: 6px;
    border-right: 1.5px solid currentColor;
    border-bottom: 1.5px solid currentColor;
    transform: translateY(-2px) rotate(45deg);
    pointer-events: none;
  }

  .filter-chip--select select {
    appearance: none;
    height: 100%;
    min-width: 8.5rem;
    padding: 0 1.8rem 0 0.85rem;
    border: 0;
    outline: 0;
    background: transparent;
    color: inherit;
    font: inherit;
    font-size: 0.78rem;
    font-weight: 700;
    cursor: pointer;
  }

  .mobile-filters__panel {
    margin-top: 0.55rem;
    padding: 0.85rem;
    border: 1px solid #d8e3e2;
    border-radius: 16px;
    background: #fff;
    box-shadow: 0 8px 22px rgba(15, 23, 42, 0.06);
  }

  .mobile-filters__panel-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
    margin-bottom: 0.7rem;
    color: #1f2933;
    font-size: 0.86rem;
  }

  .mobile-filters__panel-head button {
    border: 0;
    background: transparent;
    color: #0f766e;
    font: inherit;
    font-size: 0.78rem;
    font-weight: 700;
    cursor: pointer;
  }

  .mobile-filters__fields {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 0.55rem;
  }

  .mobile-filters__fields .filter-field {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: 0.3rem;
  }

  .mobile-filters__fields .filter-field span {
    color: #64748b;
    font-size: 0.7rem;
    font-weight: 700;
  }

  .mobile-filters__fields .filter-field select {
    width: 100%;
    height: 40px;
    padding: 0 0.65rem;
    border: 1px solid #dfe5eb;
    border-radius: 10px;
    background: #fff;
    color: #334155;
    font: inherit;
    font-size: 0.78rem;
  }

  .results-count {
    margin: 1.05rem 0 0.85rem;
    color: #34414a;
    font-size: 0.8rem;
    font-weight: 700;
  }

  .cards {
    margin-top: 0;
  }

  .card__top .link {
    color: #34414a;
    font-weight: 500;
  }

  .card__amount {
    color: #0f766e;
  }

  .card__who {
    display: flex;
    align-items: center;
    gap: 0.65rem;
    margin-top: 0.9rem;
    padding-top: 0.75rem;
    border-top: 1px solid #eef3f2;
  }

  .avatar {
    display: inline-grid;
    place-items: center;
    width: 32px;
    height: 32px;
    flex: none;
    border-radius: 9px;
    font-size: 0.68rem;
    font-weight: 700;
  }

  .avatar--teal { background: #e3f6ef; color: #0f766e; }
  .avatar--orange { background: #fdeee2; color: #c2410c; }
  .avatar--blue { background: #e7f0fd; color: #1d4ed8; }
  .avatar--violet { background: #f1eafd; color: #6d28d9; }
  .avatar--rose { background: #fde8ec; color: #be123c; }
  .avatar--amber { background: #fdf3d8; color: #a16207; }

  .name {
    color: #0f172a;
    font-weight: 700;
    text-decoration: none;
  }

  .card__details {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 0.5rem;
    margin-top: 0.85rem;
  }

  .card__details div {
    display: flex;
    flex-direction: column;
    gap: 0.22rem;
    min-width: 0;
  }

  .card__details span {
    color: #94a3b8;
    font-size: 0.65rem;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }

  .card__details strong {
    overflow: hidden;
    color: #0f172a;
    font-size: 0.8rem;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .card__notes {
    margin: 0.8rem 0 0;
    color: #64748b;
    font-size: 0.78rem;
  }

  .card__action {
    display: block;
    margin-top: 0.9rem;
    padding: 0.65rem;
    border-radius: 9px;
    background: #e7f6f3;
    color: #0f766e;
    font-size: 0.8rem;
    font-weight: 700;
    text-align: center;
    text-decoration: none;
  }
}

@media (max-width: 800px) {
  .page {
    max-width: none;
    min-height: 100vh;
    padding: 0 1rem 2rem;
    background: #f6f8fa;
  }

  .head {
    flex-direction: row;
    align-items: flex-start;
    justify-content: space-between;
    gap: 1rem;
    padding: 1.1rem 0 0;
    background: transparent;
    border-bottom: 0;
  }

  .head > div:first-child {
    min-width: 0;
  }

  .head h1 {
    font-size: 1.6rem;
    font-weight: 800;
  }

  .head p {
    margin-top: 0.3rem;
    font-size: 0.9rem;
  }

  .head .btn-primary {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 42px;
    height: 42px;
    padding: 0;
    border-radius: 12px;
    background: #0f766e;
    color: #fff;
    text-decoration: none;
  }

  .head .btn-primary span {
    display: none;
  }

  .body {
    padding: 0 0 2rem;
  }

  .panel {
    margin-top: 1rem;
    overflow: visible;
    border: 0;
    background: transparent;
  }

  .toolbar--desktop {
    display: none;
  }

  .mobile-filters {
    margin-top: 0;
  }

  .table-wrap {
    display: none;
  }

  .cards {
    display: flex;
    padding: 0;
  }

  .pager {
    align-items: center;
    margin-top: 1rem;
  }
}
</style>
