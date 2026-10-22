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
            <option v-for="item in wholesalers" :key="item.id" :value="String(item.id)">{{ item.name }}</option>
          </select>
        </label>
        <label>
          <span class="sr-only">Month</span>
          <select v-model="month">
            <option value="">All months</option>
            <option v-for="item in months" :key="item.value" :value="item.value">{{ item.label }}</option>
          </select>
        </label>
        <RouterLink class="btn-add" to="/admin/payments/new">+ Record payment</RouterLink>
      </div>
    </header>

    <p v-if="error" class="load-error" role="alert">{{ error }}</p>

    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th scope="col">
              <button type="button" class="sort" @click="toggleSort">
                Date
                <span aria-hidden="true">{{ sort === "desc" ? "↓" : "↑" }}</span>
              </button>
            </th>
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
          <tr v-else-if="!filtered.length">
            <td colspan="6" class="empty">No payments match these filters.</td>
          </tr>
          <template v-else>
            <tr v-for="payment in paged" :key="payment.id">
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
      <li v-else-if="!filtered.length" class="card empty">No payments match these filters.</li>
      <template v-else>
        <li v-for="payment in paged" :key="payment.id" class="card">
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

    <footer v-if="!loading && filtered.length" class="pager">
      <p>{{ rangeLabel }}</p>
      <div>
        <button type="button" :disabled="page === 1" @click="page -= 1">‹</button>
        <button
          v-for="number in pageCount"
          :key="number"
          type="button"
          :class="{ 'is-on': number === page }"
          @click="page = number"
        >
          {{ number }}
        </button>
        <button type="button" :disabled="page === pageCount" @click="page += 1">›</button>
      </div>
    </footer>
  </section>
</template>

<script>
import { fetchWholesalers, formatInr } from "../../../data/wholesalers";
import { fetchPayments, formatPaymentDate, methodLabel } from "../../../data/payments";

const PAGE_SIZE = 5;

function monthKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function monthLabel(key) {
  const [year, month] = key.split("-").map(Number);
  return new Intl.DateTimeFormat("en-GB", { month: "long", year: "numeric" }).format(new Date(year, month - 1, 1));
}

export default {
  name: "PaymentList",
  data() {
    return {
      rows: [],
      wholesalers: [],
      wholesalerId: "",
      month: "",
      sort: "desc",
      page: 1,
      loading: false,
      error: "",
    };
  },
  computed: {
    months() {
      const keys = this.rows.map((payment) => String(payment.paymentDate || "").slice(0, 7)).filter((key) => /^\d{4}-\d{2}$/.test(key));
      return [...new Set(keys.concat(monthKey(new Date())))]
        .sort((a, b) => b.localeCompare(a))
        .map((value) => ({ value, label: monthLabel(value) }));
    },
    filtered() {
      return this.rows.filter((payment) => {
        const wholesalerMatch = !this.wholesalerId || String(payment.wholesalerId) === this.wholesalerId;
        const monthMatch = !this.month || String(payment.paymentDate || "").startsWith(this.month);
        return wholesalerMatch && monthMatch;
      });
    },
    sorted() {
      return [...this.filtered].sort((a, b) => {
        const order = String(a.paymentDate).localeCompare(String(b.paymentDate)) || (Number(a.id) || 0) - (Number(b.id) || 0);
        return this.sort === "asc" ? order : -order;
      });
    },
    pageCount() {
      return Math.max(1, Math.ceil(this.sorted.length / PAGE_SIZE));
    },
    paged() {
      const start = (this.page - 1) * PAGE_SIZE;
      return this.sorted.slice(start, start + PAGE_SIZE);
    },
    rangeLabel() {
      const start = (this.page - 1) * PAGE_SIZE + 1;
      const end = Math.min(this.page * PAGE_SIZE, this.sorted.length);
      const noun = this.sorted.length === 1 ? "payment" : "payments";
      return `Showing ${start}–${end} of ${this.sorted.length} ${noun}`;
    },
  },
  watch: {
    wholesalerId() {
      this.page = 1;
    },
    month() {
      this.page = 1;
    },
    pageCount(count) {
      if (this.page > count) this.page = count;
    },
  },
  async created() {
    this.loading = true;
    this.error = "";
    const [payments, wholesalers] = await Promise.allSettled([fetchPayments(), fetchWholesalers()]);
    if (payments.status === "fulfilled") this.rows = payments.value;
    else this.error = payments.reason.message || "Could not load payments.";
    if (wholesalers.status === "fulfilled") this.wholesalers = wholesalers.value;
    else if (!this.error) this.error = wholesalers.reason.message || "Could not load wholesalers.";
    this.loading = false;
  },
  methods: {
    formatInr,
    formatPaymentDate,
    methodLabel,
    toggleSort() {
      this.sort = this.sort === "desc" ? "asc" : "desc";
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

.sort {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  border: 0;
  background: transparent;
  color: inherit;
  font: inherit;
  font-weight: 700;
  cursor: pointer;
  padding: 0;
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
