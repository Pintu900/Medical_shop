<template>
  <section class="page">
    <header class="head">
      <div>
        <h1>Purchase bills</h1>
        <p>Track supplier invoices, payments and outstanding dues</p>
      </div>
      <RouterLink class="btn-primary" to="/admin/purchase-bills/new">
        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
          <path d="M12 5v14M5 12h14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
        </svg>
        <span>Add purchase bill</span>
      </RouterLink>
    </header>

    <div class="body">
      <section class="panel">
        <div class="toolbar">
          <label class="search">
            <span class="sr-only">Search purchase bills</span>
            <svg viewBox="0 0 24 24" width="17" height="17" aria-hidden="true">
              <circle cx="11" cy="11" r="6.5" fill="none" stroke="currentColor" stroke-width="1.8" />
              <path d="m16 16 4 4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
            </svg>
            <input v-model="query" type="search" placeholder="Search bill or wholesaler" />
          </label>

          <div class="filters" role="group" aria-label="Purchase bill filters">
            <label class="filter-field">
              <span class="sr-only">Wholesaler</span>
              <select v-model="wholesaler">
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

        <p v-if="periodIncomplete" class="hint">Choose both a month and a year to filter by date.</p>

        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th scope="col">Bill</th>
                <th scope="col">Wholesaler</th>
                <th scope="col">Bill date</th>
                <th scope="col" class="num">Total</th>
                <th scope="col" class="num">Paid</th>
                <th scope="col" class="num">Due</th>
                <th scope="col">Attachment</th>
                <th scope="col" class="act">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="loading">
                <td colspan="8" class="empty">Loading purchase bills…</td>
              </tr>
              <tr v-else-if="error">
                <td colspan="8" class="empty load-error">{{ error }}</td>
              </tr>
              <tr v-else-if="!filtered.length">
                <td colspan="8" class="empty">{{ emptyMessage }}</td>
              </tr>
              <tr v-for="bill in filtered" :key="bill.id">
                <td>
                  <RouterLink class="bill-link" :to="`/admin/purchase-bills/${bill.id}`">{{ bill.billNumber || "No bill number" }}</RouterLink>
                  <span class="bill-id">Purchase invoice</span>
                </td>
                <td>
                  <div class="who">
                    <span class="avatar" :class="`avatar--${nameTone(bill.wholesalerName)}`" aria-hidden="true">{{ nameInitials(bill.wholesalerName) }}</span>
                    <RouterLink class="name" :to="wholesalerLink(bill)">{{ bill.wholesalerName || "Unknown wholesaler" }}</RouterLink>
                  </div>
                </td>
                <td class="muted">{{ formatBillDate(bill.billDate) }}</td>
                <td class="num strong">{{ formatInr(bill.totalAmount) }}</td>
                <td class="num paid">{{ formatInr(paidFor(bill)) }}</td>
                <td class="num"><span class="due-value" :class="{ 'is-clear': dueFor(bill) <= 0 }">{{ formatInr(dueFor(bill)) }}</span></td>
                <td>
                  <span class="badge" :class="attached(bill) ? 'badge--ready' : 'badge--pending'">
                    <span class="badge__dot" aria-hidden="true"></span>
                    {{ attached(bill) ? "Attached" : "Upload pending" }}
                  </span>
                </td>
                <td class="act"><RouterLink class="row-btn" :to="`/admin/purchase-bills/${bill.id}`">View bill</RouterLink></td>
              </tr>
            </tbody>
          </table>
        </div>

        <ul class="cards">
          <li v-if="loading" class="card empty">Loading purchase bills…</li>
          <li v-else-if="error" class="card empty load-error">{{ error }}</li>
          <li v-else-if="!filtered.length" class="card empty">{{ emptyMessage }}</li>
          <li v-for="bill in filtered" :key="bill.id" class="card">
            <div class="card__top">
              <div>
                <RouterLink class="bill-link" :to="`/admin/purchase-bills/${bill.id}`">{{ bill.billNumber || "No bill number" }}</RouterLink>
                <span class="card__date">{{ formatBillDate(bill.billDate) }}</span>
              </div>
              <span class="badge" :class="attached(bill) ? 'badge--ready' : 'badge--pending'">
                <span class="badge__dot" aria-hidden="true"></span>
                {{ attached(bill) ? "Attached" : "Upload pending" }}
              </span>
            </div>

            <div class="card__who">
              <span class="avatar" :class="`avatar--${nameTone(bill.wholesalerName)}`" aria-hidden="true">{{ nameInitials(bill.wholesalerName) }}</span>
              <RouterLink class="name" :to="wholesalerLink(bill)">{{ bill.wholesalerName || "Unknown wholesaler" }}</RouterLink>
            </div>

            <div class="card__metrics">
              <div><span>Total</span><strong>{{ formatInr(bill.totalAmount) }}</strong></div>
              <div><span>Paid</span><strong class="paid">{{ formatInr(paidFor(bill)) }}</strong></div>
              <div><span>Due</span><strong class="due-value" :class="{ 'is-clear': dueFor(bill) <= 0 }">{{ formatInr(dueFor(bill)) }}</strong></div>
            </div>

            <RouterLink class="card__action" :to="`/admin/purchase-bills/${bill.id}`">View bill</RouterLink>
          </li>
        </ul>

        <div class="panel__foot">Paid shows the initial payment recorded against each bill.</div>
      </section>
    </div>
  </section>
</template>

<script>
import { fetchWholesalers, formatInr, nameInitials, nameTone } from "../../../data/wholesalers";
import { fetchPurchaseBills, formatBillDate } from "../../../data/purchaseBills";

const MONTHS = [
  { value: "1", label: "Jan" }, { value: "2", label: "Feb" }, { value: "3", label: "Mar" },
  { value: "4", label: "Apr" }, { value: "5", label: "May" }, { value: "6", label: "Jun" },
  { value: "7", label: "Jul" }, { value: "8", label: "Aug" }, { value: "9", label: "Sep" },
  { value: "10", label: "Oct" }, { value: "11", label: "Nov" }, { value: "12", label: "Dec" },
];

function yearOptions() {
  const current = new Date().getFullYear();
  const years = [];
  for (let year = current; year >= current - 7; year -= 1) years.push(String(year));
  return years;
}

export default {
  name: "PurchaseBillList",
  data() {
    return {
      rows: [], wholesalers: [], wholesaler: "", month: "", year: "", months: MONTHS, years: yearOptions(), query: "", loading: false, error: "", requestId: 0, loadedKey: "",
    };
  },
  computed: {
    wholesalerOptions() { return [...this.wholesalers].sort((a, b) => String(a.name || "").localeCompare(String(b.name || ""))); },
    billFilters() {
      const filters = {};
      if (this.wholesaler) filters.wholesalerId = this.wholesaler;
      if (this.month && this.year) { filters.month = Number(this.month); filters.year = Number(this.year); }
      return filters;
    },
    periodIncomplete() { return Boolean(this.month) !== Boolean(this.year); },
    emptyMessage() {
      if (this.query.trim() || this.wholesaler || (this.month && this.year)) return "No purchase bills match these filters.";
      return "No purchase bills yet. Add your first supplier invoice to get started.";
    },
    filtered() {
      const query = this.query.trim().toLowerCase();
      if (!query) return this.rows;
      return this.rows.filter((bill) => String(bill.billNumber || "").toLowerCase().includes(query) || String(bill.wholesalerName || "").toLowerCase().includes(query));
    },
  },
  watch: {
    billFilters: { immediate: true, handler(filters) { const key = JSON.stringify(filters); if (key === this.loadedKey) return; this.loadedKey = key; this.load(); } },
  },
  async created() { try { this.wholesalers = await fetchWholesalers(); } catch (err) { this.wholesalers = []; } },
  methods: {
    formatInr, formatBillDate, nameInitials, nameTone,
    paidFor(bill) { if (bill && bill.paidAmount !== undefined && bill.paidAmount !== null) return Number(bill.paidAmount) || 0; if (bill && bill.amountPaid !== undefined && bill.amountPaid !== null) return Number(bill.amountPaid) || 0; return Number(bill && bill.initialPayment && bill.initialPayment.amount) || 0; },
    dueFor(bill) { return Math.max((Number(bill && bill.totalAmount) || 0) - this.paidFor(bill), 0); },
    wholesalerLink(bill) { return bill && bill.wholesalerId ? `/admin/wholesalers/${bill.wholesalerId}` : "/admin/wholesalers"; },
    async load() {
      const requestId = this.requestId + 1; this.requestId = requestId; this.loading = true; this.error = "";
      try { const rows = await fetchPurchaseBills(this.billFilters); if (this.requestId !== requestId) return; this.rows = rows; }
      catch (err) { if (this.requestId !== requestId) return; this.rows = []; this.error = err.message || "Could not load purchase bills."; }
      finally { if (this.requestId === requestId) this.loading = false; }
    },
    attached(bill) { return Array.isArray(bill.attachments) && bill.attachments.length > 0; },
  },
};
</script>

<style scoped>
.page { min-height: 100vh; background: #f6f8fa; color: #0f172a; }
.head { display: flex; align-items: center; justify-content: space-between; gap: 1rem; padding: 1.1rem 1.6rem 1rem; background: #fff; border-bottom: 1px solid #eef1f4; }
h1 { margin: 0; font-size: 1.45rem; font-weight: 700; letter-spacing: -0.02em; line-height: 1.25; }
.head p { margin: 0.2rem 0 0; color: #64748b; font-size: 0.84rem; }
.btn-primary { display: inline-flex; align-items: center; gap: 0.45rem; height: 40px; padding: 0 1rem; border-radius: 10px; background: #0f766e; color: #fff; font-size: 0.88rem; font-weight: 600; text-decoration: none; white-space: nowrap; box-shadow: 0 6px 16px rgba(15, 118, 110, 0.18); }
.btn-primary:hover { background: #0c645d; color: #fff; }
.body { max-width: 1240px; padding: 1.6rem; }
.panel { margin-top: 1.25rem; border: 1px solid #e8edf1; border-radius: 16px; background: #fff; overflow: hidden; }
.toolbar { display: flex; align-items: center; gap: 0.75rem; padding: 1rem 1.25rem; border-bottom: 1px solid #eef1f4; }
.search { position: relative; display: flex; align-items: center; flex: 1 1 260px; max-width: 360px; color: #94a3b8; }
.search svg { position: absolute; left: 0.8rem; pointer-events: none; }
.search input { width: 100%; height: 38px; padding: 0 0.85rem 0 2.35rem; border: 1px solid #dfe5eb; border-radius: 10px; background: #f8fafb; color: #0f172a; font: inherit; font-size: 0.86rem; }
.search input::placeholder { color: #94a3b8; } .search input:focus { outline: none; border-color: #0f766e; background: #fff; box-shadow: 0 0 0 3px rgba(15, 118, 110, 0.12); }
.filters { display: flex; gap: 0.5rem; margin-left: auto; }
.filter-field { position: relative; display: inline-flex; align-items: center; }
.filter-field select { appearance: none; height: 38px; min-width: 112px; padding: 0 2rem 0 0.75rem; border: 1px solid #dfe5eb; border-radius: 9px; background: #fff; color: #334155; font: inherit; font-size: 0.8rem; font-weight: 600; cursor: pointer; }
.filter-field::after { content: ""; position: absolute; right: 0.7rem; width: 6px; height: 6px; border-right: 1.5px solid #64748b; border-bottom: 1.5px solid #64748b; transform: translateY(-2px) rotate(45deg); pointer-events: none; }
.filter-field select:focus { outline: none; border-color: #0f766e; box-shadow: 0 0 0 3px rgba(15, 118, 110, 0.12); } .filter-field:first-child select { min-width: 180px; }
.hint { margin: 0; padding: 0.7rem 1.25rem 0; color: #64748b; font-size: 0.8rem; }
table { width: 100%; border-collapse: collapse; } th, td { padding: 0.85rem 1.15rem; border-bottom: 1px solid #eef1f4; text-align: left; font-size: 0.84rem; white-space: nowrap; }
th { padding-top: 0.75rem; padding-bottom: 0.75rem; background: #f8fafb; color: #64748b; font-size: 0.68rem; font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase; }
tbody tr:hover td { background: #fbfcfd; } .num { text-align: right; } .act { width: 1%; text-align: right; } .muted { color: #475569; } .strong { color: #0f172a; font-weight: 700; } .paid { color: #0f766e; font-weight: 600; }
.empty { padding: 1.75rem 1.25rem; color: #64748b; text-align: center; white-space: normal; } .load-error { color: #b91c1c; font-weight: 600; }
.who { display: flex; align-items: center; gap: 0.65rem; min-width: 0; }
.avatar { display: inline-grid; place-items: center; width: 32px; height: 32px; flex: none; border-radius: 9px; font-size: 0.68rem; font-weight: 700; }
.avatar--teal { background: #e3f6ef; color: #0f766e; } .avatar--orange { background: #fdeee2; color: #c2410c; } .avatar--blue { background: #e7f0fd; color: #1d4ed8; } .avatar--violet { background: #f1eafd; color: #6d28d9; } .avatar--rose { background: #fde8ec; color: #be123c; } .avatar--amber { background: #fdf3d8; color: #a16207; }
.name, .bill-link { color: #0f172a; font-weight: 600; text-decoration: none; } .bill-link { color: #0f766e; font-weight: 700; } .name:hover, .bill-link:hover { color: #0c645d; }
.bill-id { display: block; margin-top: 0.16rem; color: #94a3b8; font-size: 0.7rem; }
.due-value { color: #b45309; font-weight: 700; } .due-value.is-clear { color: #0f766e; }
.badge { display: inline-flex; align-items: center; gap: 0.35rem; padding: 0.25rem 0.55rem; border-radius: 999px; font-size: 0.72rem; font-weight: 600; } .badge__dot { width: 6px; height: 6px; border-radius: 50%; background: currentColor; } .badge--ready { background: #ecf8f3; color: #0f766e; } .badge--pending { background: #fff6e2; color: #b45309; }
.row-btn { display: inline-flex; align-items: center; justify-content: center; height: 32px; padding: 0 0.7rem; border: 1px solid #dfe5eb; border-radius: 8px; background: #fff; color: #334155; font: inherit; font-size: 0.76rem; font-weight: 600; text-decoration: none; } .row-btn:hover { border-color: #b7dcd5; color: #0f766e; }
.panel__foot { padding: 0.8rem 1.25rem; color: #64748b; font-size: 0.76rem; }
.cards { display: none; flex-direction: column; gap: 0.65rem; margin: 0; padding: 0.85rem; list-style: none; }
.card { padding: 0.9rem; border: 1px solid #e8edf1; border-radius: 16px; background: #fff; }
.card__top { display: flex; align-items: flex-start; justify-content: space-between; gap: 0.75rem; }
.card__date { display: block; margin-top: 0.2rem; color: #64748b; font-size: 0.76rem; }
.card__who { display: flex; align-items: center; gap: 0.65rem; margin-top: 0.9rem; padding-top: 0.75rem; border-top: 1px solid #eef1f4; }
.card__metrics { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 0.45rem; margin-top: 0.85rem; }
.card__metrics div { display: flex; flex-direction: column; gap: 0.22rem; min-width: 0; }
.card__metrics span { color: #94a3b8; font-size: 0.65rem; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; }
.card__metrics strong { color: #0f172a; font-size: 0.8rem; white-space: nowrap; }
.card__action { display: block; margin-top: 0.9rem; padding: 0.65rem; border-radius: 9px; background: #f2fbf9; color: #0f766e; font-size: 0.8rem; font-weight: 700; text-align: center; text-decoration: none; }
.sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); border: 0; }
@media (max-width: 1120px) { .toolbar { flex-wrap: wrap; } .search { max-width: none; } .filters { order: 3; flex: 1 1 100%; margin-left: 0; } }
@media (max-width: 800px) { .head { padding: 1.1rem 1rem 0; background: transparent; border-bottom: 0; } h1 { font-size: 1.6rem; font-weight: 800; } .head p { margin-top: 0.3rem; font-size: 0.9rem; } .btn-primary { height: 42px; padding: 0 0.85rem; border-radius: 12px; } .body { padding: 1rem; } .panel { margin-top: 1rem; border: 0; background: transparent; overflow: visible; } .toolbar { padding: 0 0 0.75rem; border-bottom: 0; } .search { flex-basis: 100%; max-width: none; } .search input { height: 44px; border-radius: 12px; background: #fff; } .filters { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); width: 100%; gap: 0.4rem; margin-left: 0; overflow: visible; } .filter-field, .filter-field select { min-width: 0; width: 100%; } .filter-field:first-child { grid-column: 1 / -1; } .filter-field select { height: 36px; padding-right: 1.45rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 0.72rem; } .filter-field::after { right: 0.55rem; } .table-wrap { display: none; } .cards { display: flex; padding: 0; } .panel__foot { padding: 0.85rem 0.15rem 0; } }
@media (max-width: 520px) { .head { align-items: flex-start; } .btn-primary span { display: none; } .btn-primary { width: 42px; padding: 0; justify-content: center; } }
</style>
