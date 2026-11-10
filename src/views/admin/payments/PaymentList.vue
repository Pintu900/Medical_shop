<template>
  <section class="page">
    <header class="head">
      <div>
        <h1>Payments</h1>
        <p>Payments made to wholesalers</p>
      </div>
      <div class="head__tools">
        <label>
          <span class="sr-only">Wholesaler</span>
          <select v-model="wholesalerId">
            <option value="">All wholesalers</option>
            <option v-for="item in wholesalerOptions" :key="item.id" :value="String(item.id)">{{ item.name }}</option>
          </select>
        </label>
        <label>
          <span class="sr-only">Month</span>
          <select v-model="month">
            <option value="">All months</option>
            <option v-for="item in months" :key="item.value" :value="item.value">{{ item.label }}</option>
          </select>
        </label>
        <label>
          <span class="sr-only">Year</span>
          <select v-model="year">
            <option value="">All years</option>
            <option v-for="item in years" :key="item" :value="item">{{ item }}</option>
          </select>
        </label>
        <RouterLink class="btn-add" to="/admin/payments/new">+ Record payment</RouterLink>
      </div>
    </header>

    <p v-if="periodIncomplete" class="hint">Choose both a month and a year to filter by date.</p>

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
          <tr v-else-if="!rows.length">
            <td colspan="6" class="empty">{{ emptyMessage }}</td>
          </tr>
          <template v-else>
            <tr v-for="payment in rows" :key="payment.id">
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
      <li v-else-if="!rows.length" class="card empty">{{ emptyMessage }}</li>
      <template v-else>
        <li v-for="payment in rows" :key="payment.id" class="card">
          <div class="card__top">
            <RouterLink class="link" :to="`/admin/payments/${payment.id}`">{{ formatPaymentDate(payment.paymentDate) }}</RouterLink>
            <strong>{{ formatInr(payment.amount) }}</strong>
          </div>
          <p>{{ payment.wholesalerName }}</p>
          <p>{{ methodLabel(payment.method) }}<template v-if="payment.reference"> · {{ payment.reference }}</template></p>
          <p v-if="payment.notes">{{ payment.notes }}</p>
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
</template>

<script>
import { fetchWholesalers, formatInr } from "../../../data/wholesalers";
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
      if (this.month && this.year) {
        filters.month = Number(this.month);
        filters.year = Number(this.year);
      }
      return filters;
    },
    periodIncomplete() {
      return Boolean(this.month) !== Boolean(this.year);
    },
    emptyMessage() {
      if (this.wholesalerId || (this.month && this.year)) return "No payments match these filters.";
      return "No payments yet.";
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
</style>
