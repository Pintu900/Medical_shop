<template>
  <section class="page">
    <header class="head">
      <div>
        <h1>Purchase bills</h1>
        <p>Manage purchase bills from wholesalers</p>
      </div>
      <RouterLink class="btn-add" to="/admin/purchase-bills/new">+ Add purchase bill</RouterLink>
    </header>

    <div class="filters">
      <label>
        <span>Wholesaler</span>
        <select v-model="wholesaler">
          <option value="">All wholesalers</option>
          <option v-for="name in wholesalerNames" :key="name" :value="name">{{ name }}</option>
        </select>
      </label>
      <div class="filters__period">
        <label>
          <span>Month</span>
          <select v-model="month">
            <option value="">All months</option>
            <option v-for="item in months" :key="item.value" :value="item.value">{{ item.label }}</option>
          </select>
        </label>
        <label>
          <span>Year</span>
          <select v-model="year">
            <option value="">All years</option>
            <option v-for="item in years" :key="item" :value="item">{{ item }}</option>
          </select>
        </label>
      </div>
      <label class="filters__search">
        <span>Search bill number</span>
        <input v-model="query" type="search" placeholder="Search e.g. ABC-101" />
      </label>
    </div>

    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th scope="col">Bill date</th>
            <th scope="col">Bill number</th>
            <th scope="col">Wholesaler</th>
            <th scope="col">Amount (₹)</th>
            <th scope="col">Paid</th>
            <th scope="col">Attachment</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="loading">
            <td colspan="6" class="empty">Loading purchase bills…</td>
          </tr>
          <tr v-else-if="error">
            <td colspan="6" class="load-error">{{ error }}</td>
          </tr>
          <tr v-else-if="!filtered.length">
            <td colspan="6" class="empty">No purchase bills match these filters.</td>
          </tr>
          <tr v-for="bill in filtered" :key="bill.id">
            <td>{{ formatBillDate(bill.billDate) }}</td>
            <td>
              <RouterLink class="link" :to="`/admin/purchase-bills/${bill.id}`">{{ bill.billNumber || "—" }}</RouterLink>
            </td>
            <td>{{ bill.wholesalerName }}</td>
            <td class="amount">{{ formatInr(bill.totalAmount) }}</td>
            <td>{{ formatInr(bill.paidAmount) }}</td>
            <td>
              <span class="badge" :class="attached(bill) ? 'is-ready' : 'is-pending'">
                {{ attached(bill) ? "Attached" : "Upload pending" }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <ul class="cards">
      <li v-if="loading" class="card empty">Loading purchase bills…</li>
      <li v-else-if="error" class="card load-error">{{ error }}</li>
      <li v-else-if="!filtered.length" class="card empty">No purchase bills match these filters.</li>
      <template v-else>
      <li v-for="bill in filtered" :key="bill.id" class="card">
        <div class="card__top">
          <RouterLink class="link" :to="`/admin/purchase-bills/${bill.id}`">{{ bill.billNumber || "No bill number" }}</RouterLink>
          <span class="badge" :class="attached(bill) ? 'is-ready' : 'is-pending'">
            {{ attached(bill) ? "Attached" : "Upload pending" }}
          </span>
        </div>
        <p>{{ bill.wholesalerName }}</p>
        <p>{{ formatBillDate(bill.billDate) }}</p>
        <p class="amount">{{ formatInr(bill.totalAmount) }} · Paid {{ formatInr(bill.paidAmount) }}</p>
      </li>
      </template>
    </ul>

    <p class="note">Paid shows the initial payment only.</p>
  </section>
</template>

<script>
import { formatInr } from "../../../data/wholesalers";
import { fetchPurchaseBills, formatBillDate } from "../../../data/purchaseBills";

const MONTHS = [
  { value: "01", label: "Jan" },
  { value: "02", label: "Feb" },
  { value: "03", label: "Mar" },
  { value: "04", label: "Apr" },
  { value: "05", label: "May" },
  { value: "06", label: "Jun" },
  { value: "07", label: "Jul" },
  { value: "08", label: "Aug" },
  { value: "09", label: "Sep" },
  { value: "10", label: "Oct" },
  { value: "11", label: "Nov" },
  { value: "12", label: "Dec" },
];

export default {
  name: "PurchaseBillList",
  data() {
    return {
      rows: [],
      wholesaler: "",
      month: "",
      year: "",
      months: MONTHS,
      query: "",
      loading: false,
      error: "",
    };
  },
  computed: {
    wholesalerNames() {
      return [...new Set(this.rows.map((bill) => bill.wholesalerName).filter(Boolean))].sort();
    },
    years() {
      const fromBills = this.rows.map((bill) => String(bill.billDate || "").slice(0, 4)).filter((year) => /^\d{4}$/.test(year));
      const current = String(new Date().getFullYear());
      return [...new Set(fromBills.concat(current))].sort((a, b) => b.localeCompare(a));
    },
    filtered() {
      const query = this.query.trim().toLowerCase();
      return this.rows.filter((bill) => {
        const date = String(bill.billDate || "");
        const wholesalerMatch = !this.wholesaler || bill.wholesalerName === this.wholesaler;
        const yearMatch = !this.year || date.startsWith(this.year);
        const monthMatch = !this.month || date.slice(5, 7) === this.month;
        const numberMatch = !query || String(bill.billNumber || "").toLowerCase().includes(query);
        return wholesalerMatch && yearMatch && monthMatch && numberMatch;
      });
    },
  },
  async created() {
    this.loading = true;
    this.error = "";
    try {
      this.rows = await fetchPurchaseBills();
    } catch (err) {
      this.error = err.message || "Could not load purchase bills.";
    } finally {
      this.loading = false;
    }
  },
  methods: {
    formatInr,
    formatBillDate,
    attached(bill) {
      return Array.isArray(bill.attachments) && bill.attachments.length > 0;
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
.card__top {
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
.empty {
  margin: 0.3rem 0 0;
  color: #64748b;
  font-size: 0.92rem;
}

.load-error {
  color: #b91c1c;
  font-weight: 600;
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

.filters {
  display: grid;
  grid-template-columns: 1.3fr 140px 120px 1.2fr;
  gap: 0.75rem;
  margin: 1rem 0;
}

.filters__period {
  display: contents;
}

.filters label {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  font-size: 0.78rem;
  font-weight: 600;
  color: #64748b;
}

.filters input,
.filters select {
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: #fff;
  padding: 0.7rem 0.8rem;
  font: inherit;
  font-weight: 500;
  color: #0f172a;
}

.filters input:focus,
.filters select:focus {
  outline: 2px solid rgba(15, 118, 110, 0.25);
  border-color: #0f766e;
}

.table-wrap,
.card {
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

.amount {
  font-weight: 700;
}

.badge {
  display: inline-flex;
  border-radius: 999px;
  padding: 0.2rem 0.6rem;
  font-size: 0.75rem;
  font-weight: 700;
}

.is-ready {
  background: #dcfce7;
  color: #166534;
}

.is-pending {
  background: #fff7ed;
  color: #c2410c;
}

.note {
  margin-top: 0.8rem;
}

.cards {
  display: none;
  list-style: none;
  margin: 0;
  padding: 0;
  gap: 0.75rem;
}

.card {
  padding: 0.95rem 1rem;
}

@media (max-width: 800px) {
  .page {
    padding: 1rem;
  }

  .head {
    flex-direction: column;
  }

  .btn-add {
    width: 100%;
    text-align: center;
  }

  h1 {
    font-size: 1.45rem;
  }

  .filters {
    grid-template-columns: 1fr;
  }

  .filters__period {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.75rem;
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
