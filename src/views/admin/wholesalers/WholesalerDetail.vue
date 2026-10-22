<template>
  <section class="page">
    <p v-if="loading" class="missing">Loading wholesaler…</p>
    <p v-else-if="loadError" class="missing">{{ loadError }}</p>
    <p v-else-if="!item" class="missing">
      This wholesaler was not found.
      <RouterLink to="/admin/wholesalers">Back to wholesalers</RouterLink>
    </p>

    <template v-else>
      <p class="crumb">
        <RouterLink to="/admin/wholesalers">Wholesalers</RouterLink>
        <span aria-hidden="true"> / </span>
        {{ item.name }}
      </p>

      <p v-if="saved" class="banner" role="status">Wholesaler details saved.</p>
      <p v-if="notice" class="banner" role="status">{{ notice }}</p>

      <header class="profile">
        <div class="profile__main">
          <span class="avatar" aria-hidden="true">{{ initial }}</span>
          <div>
            <h1>{{ item.name }}</h1>
            <p>
              <span>{{ formatPhone(item.phone) }}</span>
              <span>{{ item.address || "No address provided" }}</span>
            </p>
          </div>
        </div>
        <div class="profile__side">
          <span class="status" :class="item.status === 'Active' ? 'is-active' : 'is-inactive'">
            {{ item.status }}
          </span>
          <RouterLink class="btn-edit" :to="`/admin/wholesalers/${item.id}/edit`">Edit wholesaler</RouterLink>
        </div>
      </header>

      <p v-if="reportError" class="banner" role="alert">{{ reportError }}</p>

      <div class="stats">
        <article class="stat stat--green">
          <span>Opening Due</span>
          <strong>{{ formatInr(report.openingDue) }}</strong>
        </article>
        <article class="stat stat--green">
          <span>Total Purchases</span>
          <strong>{{ formatInr(report.totalPurchases) }}</strong>
        </article>
        <article class="stat stat--blue">
          <span>Total Payments</span>
          <strong>{{ formatInr(report.totalPayments) }}</strong>
        </article>
        <article class="stat stat--amber">
          <span>Current Due</span>
          <strong>{{ formatInr(report.currentDue) }}</strong>
        </article>
      </div>

      <div class="tabs" role="tablist">
        <button type="button" role="tab" :aria-selected="tab === 'bills'" :class="{ 'is-on': tab === 'bills' }" @click="tab = 'bills'">
          Bills
        </button>
        <button type="button" role="tab" :aria-selected="tab === 'payments'" :class="{ 'is-on': tab === 'payments' }" @click="tab = 'payments'">
          Payments
        </button>
        <button type="button" role="tab" :aria-selected="tab === 'statement'" :class="{ 'is-on': tab === 'statement' }" @click="tab = 'statement'">
          Statement
        </button>
      </div>

      <section v-if="tab === 'bills'" class="panel">
        <header class="panel__head">
          <h2>Purchase Bills ({{ bills.length }})</h2>
          <RouterLink class="btn-add" :to="`/admin/payments/new?wholesalerId=${item.id}`">+ Record payment</RouterLink>
        </header>
        <p v-if="billsError" class="banner" role="alert">{{ billsError }}</p>
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
              <tr v-if="billsLoading">
                <td colspan="6" class="empty">Loading purchase bills…</td>
              </tr>
              <tr v-else-if="!bills.length && !billsError">
                <td colspan="6" class="empty">No purchase bills yet.</td>
              </tr>
              <template v-else>
                <tr v-for="bill in bills" :key="bill.id">
                  <td>{{ formatBillDate(bill.billDate) }}</td>
                  <td>
                    <RouterLink class="link" :to="`/admin/purchase-bills/${bill.id}`">{{ bill.billNumber || "—" }}</RouterLink>
                  </td>
                  <td>{{ bill.wholesalerName || item.name }}</td>
                  <td class="amount">{{ formatInr(bill.totalAmount) }}</td>
                  <td>{{ formatInr(bill.paidAmount) }}</td>
                  <td>
                    <span class="badge" :class="attached(bill) ? 'is-ready' : 'is-pending'">
                      {{ attached(bill) ? "Attached" : "Upload pending" }}
                    </span>
                  </td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>
        <ul class="bill-cards">
          <li v-if="billsLoading" class="bill-card empty">Loading purchase bills…</li>
          <li v-else-if="!bills.length && !billsError" class="bill-card empty">No purchase bills yet.</li>
          <template v-else>
            <li v-for="bill in bills" :key="bill.id" class="bill-card bill-card--stack">
              <div class="bill-card__top">
                <RouterLink class="link" :to="`/admin/purchase-bills/${bill.id}`">{{ bill.billNumber || "No bill number" }}</RouterLink>
                <span class="badge" :class="attached(bill) ? 'is-ready' : 'is-pending'">
                  {{ attached(bill) ? "Attached" : "Upload pending" }}
                </span>
              </div>
              <p>{{ bill.wholesalerName || item.name }}</p>
              <p>{{ formatBillDate(bill.billDate) }}</p>
              <p class="amount">{{ formatInr(bill.totalAmount) }} · Paid {{ formatInr(bill.paidAmount) }}</p>
            </li>
          </template>
        </ul>
      </section>

      <section v-else-if="tab === 'payments'" class="panel">
        <header class="panel__head">
          <h2>Payments ({{ payments.length }})</h2>
          <RouterLink class="btn-add" :to="`/admin/payments/new?wholesalerId=${item.id}`">+ Record payment</RouterLink>
        </header>
        <p v-if="paymentsError" class="banner" role="alert">{{ paymentsError }}</p>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th scope="col">Date</th>
                <th scope="col">Amount (₹)</th>
                <th scope="col">Method</th>
                <th scope="col">Reference</th>
                <th scope="col">Notes</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="paymentsLoading">
                <td colspan="5" class="empty">Loading payments…</td>
              </tr>
              <tr v-else-if="!payments.length && !paymentsError">
                <td colspan="5" class="empty">No payments yet.</td>
              </tr>
              <template v-else>
                <tr v-for="payment in payments" :key="payment.id">
                  <td>
                    <RouterLink class="link" :to="`/admin/payments/${payment.id}`">{{ formatPaymentDate(payment.paymentDate) }}</RouterLink>
                  </td>
                  <td class="amount">{{ formatInr(payment.amount) }}</td>
                  <td>{{ methodLabel(payment.method) }}</td>
                  <td>{{ payment.reference || "—" }}</td>
                  <td>{{ payment.notes || "—" }}</td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>
        <ul class="bill-cards">
          <li v-if="paymentsLoading" class="bill-card empty">Loading payments…</li>
          <li v-else-if="!payments.length && !paymentsError" class="bill-card empty">No payments yet.</li>
          <template v-else>
            <li v-for="payment in payments" :key="payment.id" class="bill-card bill-card--stack">
              <div class="bill-card__top">
                <RouterLink class="link" :to="`/admin/payments/${payment.id}`">{{ formatPaymentDate(payment.paymentDate) }}</RouterLink>
                <strong>{{ formatInr(payment.amount) }}</strong>
              </div>
              <p>{{ methodLabel(payment.method) }}<template v-if="payment.reference"> · {{ payment.reference }}</template></p>
              <p v-if="payment.notes">{{ payment.notes }}</p>
            </li>
          </template>
        </ul>
      </section>

      <section v-else class="panel">
        <h2>Statement</h2>
        <dl class="statement">
          <div>
            <dt>Opening due</dt>
            <dd>{{ formatInr(report.openingDue) }}</dd>
          </div>
          <div>
            <dt>Total purchases</dt>
            <dd>{{ formatInr(report.totalPurchases) }}</dd>
          </div>
          <div>
            <dt>Total payments</dt>
            <dd>{{ formatInr(report.totalPayments) }}</dd>
          </div>
          <div>
            <dt>Current due</dt>
            <dd>{{ formatInr(report.currentDue) }}</dd>
          </div>
        </dl>
      </section>
    </template>
  </section>
</template>

<script>
import { fetchWholesaler, fetchWholesalerReport, formatInr, formatPhone } from "../../../data/wholesalers";
import { fetchWholesalerPurchaseBills, formatBillDate } from "../../../data/purchaseBills";
import { fetchWholesalerPayments, formatPaymentDate, methodLabel } from "../../../data/payments";

const EMPTY_REPORT = () => ({
  openingDue: 0,
  totalPurchases: 0,
  totalPayments: 0,
  currentDue: 0,
});

export default {
  name: "WholesalerDetail",
  data() {
    return {
      item: null,
      report: EMPTY_REPORT(),
      bills: [],
      payments: [],
      tab: "bills",
      notice: "",
      loading: false,
      loadError: "",
      reportError: "",
      billsLoading: false,
      billsError: "",
      paymentsLoading: false,
      paymentsError: "",
    };
  },
  computed: {
    initial() {
      return this.item && this.item.name ? this.item.name.charAt(0) : "";
    },
    saved() {
      return this.$route.query.saved === "1";
    },
  },
  watch: {
    "$route.params.id": {
      immediate: true,
      async handler() {
        this.tab = "bills";
        this.notice = "";
        this.loading = true;
        this.loadError = "";
        this.reportError = "";
        this.billsError = "";
        this.paymentsError = "";
        this.item = null;
        this.report = EMPTY_REPORT();
        this.bills = [];
        this.payments = [];
        const id = this.$route.params.id;
        try {
          const item = await fetchWholesaler(id);
          this.item = item;
          if (!item) return;
          this.billsLoading = true;
          this.paymentsLoading = true;
          await Promise.all([
            fetchWholesalerReport(id)
              .then((report) => {
                this.report = report;
              })
              .catch((err) => {
                this.reportError = err.message || "Could not load the wholesaler totals.";
              }),
            fetchWholesalerPurchaseBills(id)
              .then((bills) => {
                this.bills = bills;
              })
              .catch((err) => {
                this.billsError = err.message || "Could not load purchase bills.";
              }),
            fetchWholesalerPayments(id)
              .then((payments) => {
                this.payments = payments.sort((a, b) => String(b.paymentDate).localeCompare(String(a.paymentDate)) || (Number(b.id) || 0) - (Number(a.id) || 0));
              })
              .catch((err) => {
                this.paymentsError = err.message || "Could not load payments.";
              }),
          ]);
        } catch (err) {
          this.loadError = err.message || "Could not load this wholesaler.";
        } finally {
          this.billsLoading = false;
          this.paymentsLoading = false;
          this.loading = false;
        }
      },
    },
  },
  methods: {
    formatInr,
    formatPhone,
    formatBillDate,
    formatPaymentDate,
    methodLabel,
    attached(bill) {
      return Array.isArray(bill.attachments) && bill.attachments.length > 0;
    },
    formatAmount(amount) {
      return new Intl.NumberFormat("en-IN").format(amount);
    },
    soon(action) {
      this.notice = `${action} is not connected yet.`;
    },
  },
};
</script>

<style scoped>
.page {
  max-width: 1100px;
  padding: 1.5rem 1.75rem 2.5rem;
}

.crumb {
  margin: 0 0 1rem;
  color: #64748b;
  font-size: 0.8125rem;
}

.crumb a {
  color: #0f766e;
  text-decoration: none;
  font-weight: 600;
}

.banner,
.missing {
  margin: 0 0 1rem;
  color: #0f766e;
  font-weight: 600;
}

.missing a {
  display: inline-block;
  margin-left: 0.4rem;
}

.profile {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  background: #fff;
  border: 1px solid #e6eeec;
  border-radius: 14px;
  padding: 1.1rem 1.2rem;
}

.profile__main,
.profile__side {
  display: flex;
  align-items: center;
  gap: 0.85rem;
}

.avatar {
  width: 44px;
  height: 44px;
  border-radius: 999px;
  background: #e7f6f3;
  color: #0f766e;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
}

h1 {
  margin: 0;
  font-size: 1.45rem;
  letter-spacing: -0.03em;
}

.profile p {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem 0.8rem;
  margin: 0.25rem 0 0;
  color: #64748b;
  font-size: 0.9rem;
}

.status {
  border-radius: 999px;
  padding: 0.25rem 0.65rem;
  font-size: 0.78rem;
  font-weight: 700;
}

.is-active {
  background: #dcfce7;
  color: #166534;
}

.is-inactive {
  background: #f1f5f9;
  color: #64748b;
}

.btn-edit,
.btn-add,
.row-actions button,
.bill-card button {
  font: inherit;
  font-size: 0.88rem;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  text-decoration: none;
}

.btn-edit {
  border: 1px solid #e2e8f0;
  background: #fff;
  color: #0f172a;
  padding: 0.55rem 0.8rem;
}

.stats {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 0.75rem;
  margin: 1rem 0;
}

.stat {
  border-radius: 12px;
  padding: 0.9rem 1rem;
}

.stat span {
  display: block;
  color: #64748b;
  font-size: 0.8rem;
  margin-bottom: 0.3rem;
}

.stat strong {
  font-size: 1.25rem;
  letter-spacing: -0.03em;
}

.stat--green {
  background: #ecfdf5;
}

.stat--blue {
  background: #eff6ff;
}

.stat--amber {
  background: #fff7ed;
}

.stat--amber strong {
  color: #c2410c;
}

.tabs {
  display: flex;
  gap: 0.25rem;
  border-bottom: 1px solid #e6eeec;
  margin-bottom: 1rem;
}

.tabs button {
  border: 0;
  background: transparent;
  font: inherit;
  font-weight: 600;
  color: #64748b;
  padding: 0.7rem 0.85rem;
  border-bottom: 2px solid transparent;
  cursor: pointer;
}

.tabs button.is-on {
  color: #0f766e;
  border-bottom-color: #0f766e;
}

.panel {
  background: #fff;
  border: 1px solid #e6eeec;
  border-radius: 14px;
  padding: 1rem 1.1rem 1.15rem;
}

.panel__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  margin-bottom: 0.8rem;
}

h2 {
  margin: 0;
  font-size: 1rem;
}

.btn-add {
  border: 0;
  background: #0f766e;
  color: #fff;
  padding: 0.6rem 0.85rem;
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
  text-align: left;
  padding: 0.8rem 0.7rem;
  border-bottom: 1px solid #eef3f2;
  font-size: 0.9rem;
}

th {
  color: #64748b;
  font-size: 0.78rem;
}

.row-actions {
  display: flex;
  gap: 0.4rem;
}

.row-actions button,
.bill-card button {
  border: 1px solid #e2e8f0;
  background: #fff;
  color: #0f172a;
  padding: 0.35rem 0.6rem;
}

.empty {
  color: #64748b;
}

.bill-cards {
  display: none;
  list-style: none;
  margin: 0;
  padding: 0;
  gap: 0.7rem;
}

.bill-card {
  border: 1px solid #e6eeec;
  border-radius: 12px;
  padding: 0.85rem;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 0.45rem 0.75rem;
}

.bill-card span,
.bill-card .empty {
  display: block;
  color: #64748b;
  font-weight: 400;
  margin-top: 0.15rem;
}

.bill-card--stack {
  flex-direction: column;
  flex-wrap: nowrap;
  gap: 0.3rem;
}

.bill-card__top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
}

.bill-card--stack p {
  margin: 0;
  color: #64748b;
  font-size: 0.92rem;
}

.link {
  color: #0f766e;
  font-weight: 700;
  text-decoration: none;
}

.amount,
.bill-card--stack p.amount {
  font-weight: 700;
}

.badge,
.bill-card span.badge {
  display: inline-flex;
  margin: 0;
  border-radius: 999px;
  padding: 0.2rem 0.6rem;
  font-size: 0.75rem;
  font-weight: 700;
}

.badge.is-ready,
.bill-card span.badge.is-ready {
  background: #dcfce7;
  color: #166534;
}

.badge.is-pending,
.bill-card span.badge.is-pending {
  background: #fff7ed;
  color: #c2410c;
}

.bill-card__actions {
  display: flex;
  width: 100%;
  gap: 0.45rem;
}

.bill-card__actions button {
  flex: 1;
}

.statement {
  margin: 0.8rem 0 0;
}

.statement div {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.75rem 0;
  border-bottom: 1px solid #eef3f2;
}

.statement dt {
  color: #64748b;
}

.statement dd {
  margin: 0;
  font-weight: 700;
}

@media (max-width: 800px) {
  .page {
    padding: 1rem 1rem 2rem;
  }

  .profile,
  .profile__side,
  .panel__head {
    flex-direction: column;
    align-items: stretch;
  }

  .profile__main {
    align-items: flex-start;
  }

  .btn-edit,
  .btn-add {
    text-align: center;
  }

  .stats {
    grid-template-columns: 1fr 1fr;
  }

  .tabs {
    overflow-x: auto;
  }

  .table-wrap {
    display: none;
  }

  .bill-cards {
    display: flex;
    flex-direction: column;
  }

  h1 {
    font-size: 1.3rem;
  }
}
</style>
