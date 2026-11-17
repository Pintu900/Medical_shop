<template>
  <section class="page">
    <div v-if="loading || loadError || !item" class="body">
      <p v-if="loading" class="state">Loading wholesaler…</p>
      <p v-else-if="loadError" class="state state--error">{{ loadError }}</p>
      <p v-else class="state">
        This wholesaler was not found.
        <RouterLink to="/admin/wholesalers">Back to wholesalers</RouterLink>
      </p>
    </div>

    <template v-else>
      <header class="head">
        <nav class="crumb" aria-label="Breadcrumb">
          <RouterLink to="/admin/wholesalers">Wholesalers</RouterLink>
          <svg viewBox="0 0 24 24" width="13" height="13" aria-hidden="true">
            <path d="m9 6 6 6-6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          <span>{{ item.name }}</span>
        </nav>

        <div class="profile">
          <div class="profile__main">
            <span class="avatar" :class="`avatar--${tone}`" aria-hidden="true">{{ initials }}</span>
            <div class="profile__text">
              <div class="profile__row">
                <h1>{{ item.name }}</h1>
                <span class="status" :class="item.status === 'Active' ? 'is-active' : 'is-inactive'">
                  <span class="status__dot" aria-hidden="true"></span>
                  {{ item.status }}
                </span>
              </div>
              <p class="meta">
                <span v-if="item.phone">
                  <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
                    <path d="M5 4h3.2l1.6 4-2 1.3a11 11 0 0 0 4.9 4.9l1.3-2 4 1.6V17a2 2 0 0 1-2.2 2A15 15 0 0 1 3 6.2 2 2 0 0 1 5 4z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round" />
                  </svg>
                  {{ formatPhone(item.phone) }}
                </span>
                <span>
                  <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
                    <path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round" />
                    <circle cx="12" cy="10" r="2.3" fill="none" stroke="currentColor" stroke-width="1.7" />
                  </svg>
                  {{ item.address || "No address provided" }}
                </span>
              </p>
            </div>
          </div>

          <div class="profile__actions">
            <RouterLink class="btn btn--ghost" :to="`/admin/wholesalers/${item.id}/edit`">
              <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
                <path d="M4 20h4L19 9a2.8 2.8 0 0 0-4-4L4 16v4z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" />
              </svg>
              Edit
            </RouterLink>
            <RouterLink class="btn btn--ghost" :to="`/admin/purchase-bills/new?wholesalerId=${item.id}`">
              <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
                <path d="M7 3h7l4 4v14H7z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" />
                <path d="M12 11v6M9 14h6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
              </svg>
              Add bill
            </RouterLink>
            <RouterLink class="btn btn--primary" :to="`/admin/payments/new?wholesalerId=${item.id}`">
              <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
                <rect x="3" y="6" width="18" height="12" rx="2.5" fill="none" stroke="currentColor" stroke-width="1.8" />
                <circle cx="12" cy="12" r="2.4" fill="none" stroke="currentColor" stroke-width="1.8" />
              </svg>
              Record payment
            </RouterLink>
          </div>
        </div>
      </header>

      <div class="body">
        <p v-if="saved" class="banner" role="status">
          <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
            <path d="m5 12.5 4.5 4.5L19 7.5" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          Wholesaler details saved.
        </p>
        <p v-if="notice" class="banner" role="status">{{ notice }}</p>
        <p v-if="reportError" class="banner banner--error" role="alert">{{ reportError }}</p>

        <div class="stats">
          <article class="stat stat--opening">
            <span class="stat__label">Opening due</span>
            <strong class="stat__value">{{ formatInr(report.openingDue) }}</strong>
            <p class="stat__sub">Balance carried in</p>
          </article>
          <article class="stat stat--purchases">
            <span class="stat__label">Total purchases</span>
            <strong class="stat__value">{{ formatInr(report.totalPurchases) }}</strong>
            <p class="stat__sub">{{ bills.length }} {{ bills.length === 1 ? "bill" : "bills" }}</p>
          </article>
          <article class="stat stat--payments">
            <span class="stat__label">Total payments</span>
            <strong class="stat__value">{{ formatInr(report.totalPayments) }}</strong>
            <p class="stat__sub">{{ payments.length }} {{ payments.length === 1 ? "payment" : "payments" }}</p>
          </article>
          <article class="stat stat--due" :class="{ 'stat--clear': report.currentDue <= 0 }">
            <span class="stat__label">Current due</span>
            <strong class="stat__value">{{ report.currentDue > 0 ? formatInr(report.currentDue) : "Settled" }}</strong>
            <div class="meter" role="img" :aria-label="`${clearedPercent}% of the total cleared`">
              <span :style="{ width: `${clearedPercent}%` }"></span>
            </div>
            <p class="stat__sub">{{ clearedPercent }}% cleared</p>
          </article>
        </div>

        <section class="panel">
          <header class="panel__head">
            <div class="tabs" role="tablist" aria-label="Wholesaler records">
              <button
                v-for="option in tabOptions"
                :key="option.value"
                type="button"
                role="tab"
                :aria-selected="tab === option.value ? 'true' : 'false'"
                :class="{ 'is-on': tab === option.value }"
                @click="tab = option.value"
              >
                {{ option.label }}
                <span v-if="option.count !== null" class="tabs__count">{{ option.count }}</span>
              </button>
            </div>
            <RouterLink v-if="tab === 'bills'" class="btn btn--soft" :to="`/admin/purchase-bills/new?wholesalerId=${item.id}`">+ Add bill</RouterLink>
            <RouterLink v-else-if="tab === 'payments'" class="btn btn--soft" :to="`/admin/payments/new?wholesalerId=${item.id}`">+ Record payment</RouterLink>
          </header>

          <template v-if="tab === 'bills'">
            <p v-if="billsError" class="banner banner--error banner--inset" role="alert">{{ billsError }}</p>
            <div class="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th scope="col">Bill date</th>
                    <th scope="col">Bill number</th>
                    <th scope="col" class="num">Amount</th>
                    <th scope="col" class="num">Paid</th>
                    <th scope="col">Balance</th>
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
                      <td class="muted">{{ formatBillDate(bill.billDate) }}</td>
                      <td>
                        <RouterLink class="link" :to="`/admin/purchase-bills/${bill.id}`">{{ bill.billNumber || "—" }}</RouterLink>
                      </td>
                      <td class="num strong">{{ formatInr(bill.totalAmount) }}</td>
                      <td class="num muted">{{ formatInr(bill.paidAmount) }}</td>
                      <td>
                        <span class="chip" :class="`chip--${billState(bill).tone}`">{{ billState(bill).label }}</span>
                      </td>
                      <td>
                        <span class="chip" :class="attached(bill) ? 'chip--teal' : 'chip--grey'">
                          {{ attached(bill) ? "Attached" : "Upload pending" }}
                        </span>
                      </td>
                    </tr>
                  </template>
                </tbody>
              </table>
            </div>
            <ul class="cards">
              <li v-if="billsLoading" class="card empty">Loading purchase bills…</li>
              <li v-else-if="!bills.length && !billsError" class="card empty">No purchase bills yet.</li>
              <template v-else>
                <li v-for="bill in bills" :key="bill.id" class="card">
                  <div class="card__top">
                    <div>
                      <RouterLink class="link" :to="`/admin/purchase-bills/${bill.id}`">{{ bill.billNumber || "No bill number" }}</RouterLink>
                      <small>{{ formatBillDate(bill.billDate) }}</small>
                    </div>
                    <strong>{{ formatInr(bill.totalAmount) }}</strong>
                  </div>
                  <div class="card__foot">
                    <span class="chip" :class="`chip--${billState(bill).tone}`">{{ billState(bill).label }}</span>
                    <span class="chip" :class="attached(bill) ? 'chip--teal' : 'chip--grey'">
                      {{ attached(bill) ? "Attached" : "Upload pending" }}
                    </span>
                    <span class="card__paid">Paid {{ formatInr(bill.paidAmount) }}</span>
                  </div>
                </li>
              </template>
            </ul>
          </template>

          <template v-else-if="tab === 'payments'">
            <p v-if="paymentsError" class="banner banner--error banner--inset" role="alert">{{ paymentsError }}</p>
            <div class="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th scope="col">Date</th>
                    <th scope="col" class="num">Amount</th>
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
                      <td class="num strong paid">{{ formatInr(payment.amount) }}</td>
                      <td><span class="chip chip--blue">{{ methodLabel(payment.method) }}</span></td>
                      <td class="muted">{{ payment.reference || "—" }}</td>
                      <td class="muted notes">{{ payment.notes || "—" }}</td>
                    </tr>
                  </template>
                </tbody>
              </table>
            </div>
            <ul class="cards">
              <li v-if="paymentsLoading" class="card empty">Loading payments…</li>
              <li v-else-if="!payments.length && !paymentsError" class="card empty">No payments yet.</li>
              <template v-else>
                <li v-for="payment in payments" :key="payment.id" class="card">
                  <div class="card__top">
                    <div>
                      <RouterLink class="link" :to="`/admin/payments/${payment.id}`">{{ formatPaymentDate(payment.paymentDate) }}</RouterLink>
                      <small v-if="payment.reference">Ref: {{ payment.reference }}</small>
                    </div>
                    <strong class="paid">{{ formatInr(payment.amount) }}</strong>
                  </div>
                  <div class="card__foot">
                    <span class="chip chip--blue">{{ methodLabel(payment.method) }}</span>
                    <span v-if="payment.notes" class="card__note">{{ payment.notes }}</span>
                  </div>
                </li>
              </template>
            </ul>
          </template>

          <div v-else class="statement">
            <dl>
              <div class="statement__row">
                <dt>Opening due</dt>
                <dd>{{ formatInr(report.openingDue) }}</dd>
              </div>
              <div class="statement__row">
                <dt><span class="sign sign--plus" aria-hidden="true">+</span>Total purchases</dt>
                <dd>{{ formatInr(report.totalPurchases) }}</dd>
              </div>
              <div class="statement__row">
                <dt><span class="sign sign--minus" aria-hidden="true">−</span>Total payments</dt>
                <dd class="paid">{{ formatInr(report.totalPayments) }}</dd>
              </div>
              <div class="statement__row statement__row--total" :class="{ 'is-clear': report.currentDue <= 0 }">
                <dt>Current due</dt>
                <dd>{{ formatInr(report.currentDue) }}</dd>
              </div>
            </dl>
            <p class="statement__note">Current due is the opening due plus all purchase bills, minus every payment recorded.</p>
          </div>
        </section>
      </div>
    </template>
  </section>
</template>

<script>
import { fetchWholesaler, fetchWholesalerReport, formatInr, formatPhone, nameInitials, nameTone } from "../../../data/wholesalers";
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
    initials() {
      return this.item ? nameInitials(this.item.name) : "";
    },
    tone() {
      return this.item ? nameTone(this.item.name) : "teal";
    },
    saved() {
      return this.$route.query.saved === "1";
    },
    clearedPercent() {
      const owed = (Number(this.report.openingDue) || 0) + (Number(this.report.totalPurchases) || 0);
      if (owed <= 0) return this.report.currentDue > 0 ? 0 : 100;
      return Math.min(100, Math.round(((Number(this.report.totalPayments) || 0) / owed) * 100));
    },
    tabOptions() {
      return [
        { value: "bills", label: "Bills", count: this.bills.length },
        { value: "payments", label: "Payments", count: this.payments.length },
        { value: "statement", label: "Statement", count: null },
      ];
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
    billState(bill) {
      const total = Number(bill.totalAmount) || 0;
      const paid = Number(bill.paidAmount) || 0;
      if (total > 0 && paid >= total) return { label: "Paid", tone: "teal" };
      if (paid > 0) return { label: `${formatInr(total - paid)} left`, tone: "amber" };
      return { label: "Unpaid", tone: "rose" };
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
  padding: 0.9rem 1.6rem 1.15rem;
  background: #fff;
  border-bottom: 1px solid #eef1f4;
}

.crumb {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  margin-bottom: 0.85rem;
  color: #94a3b8;
  font-size: 0.78rem;
}

.crumb a {
  color: #0f766e;
  font-weight: 600;
  text-decoration: none;
}

.crumb span {
  overflow: hidden;
  color: #64748b;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.profile {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem 1.5rem;
}

.profile__main {
  display: flex;
  align-items: center;
  gap: 0.9rem;
  min-width: 0;
}

.profile__text {
  min-width: 0;
}

.profile__row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.35rem 0.7rem;
}

h1 {
  margin: 0;
  font-size: 1.45rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  line-height: 1.25;
}

.meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.3rem 1rem;
  margin: 0.3rem 0 0;
  color: #64748b;
  font-size: 0.84rem;
}

.meta span {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
}

.meta svg {
  flex: none;
  color: #94a3b8;
}

.avatar {
  display: inline-grid;
  place-items: center;
  width: 52px;
  height: 52px;
  flex: none;
  border-radius: 14px;
  font-size: 1rem;
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

.status {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.22rem 0.6rem;
  border-radius: 999px;
  font-size: 0.74rem;
  font-weight: 600;
}

.status.is-active {
  background: #ecf8f3;
  color: #0f766e;
}

.status.is-inactive {
  background: #f1f4f7;
  color: #64748b;
}

.status__dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
}

.profile__actions {
  display: flex;
  flex: none;
  gap: 0.5rem;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.45rem;
  height: 40px;
  padding: 0 0.95rem;
  border-radius: 10px;
  font-size: 0.86rem;
  font-weight: 600;
  text-decoration: none;
  white-space: nowrap;
}

.btn--ghost {
  border: 1px solid #dfe5eb;
  background: #fff;
  color: #334155;
}

.btn--ghost:hover {
  border-color: #b7dcd5;
  color: #0f766e;
}

.btn--primary {
  border: 1px solid #0f766e;
  background: #0f766e;
  color: #fff;
  box-shadow: 0 6px 16px rgba(15, 118, 110, 0.18);
}

.btn--primary:hover {
  background: #0c645d;
  color: #fff;
}

.btn--soft {
  height: 34px;
  padding: 0 0.8rem;
  border-radius: 9px;
  background: #e8f5f2;
  color: #0f5f58;
  font-size: 0.8rem;
}

.btn--soft:hover {
  background: #d6efe9;
}

.body {
  max-width: 1180px;
  padding: 1.6rem 1.6rem 2.5rem;
}

.state {
  margin: 0;
  padding: 1.5rem;
  border: 1px solid #e8edf1;
  border-radius: 16px;
  background: #fff;
  color: #475569;
  font-weight: 600;
}

.state a {
  margin-left: 0.4rem;
  color: #0f766e;
}

.state--error {
  color: #b91c1c;
}

.banner {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0 0 1rem;
  padding: 0.7rem 0.9rem;
  border: 1px solid #bfe6d7;
  border-radius: 12px;
  background: #ecf8f3;
  color: #0f5f58;
  font-size: 0.86rem;
  font-weight: 600;
}

.banner--error {
  border-color: #fecaca;
  background: #fef2f2;
  color: #b91c1c;
}

.banner--inset {
  margin: 1rem 1.25rem 0;
}

.stats {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 1rem;
}

.stat {
  padding: 1rem 1.05rem;
  border: 1px solid #e8edf1;
  border-radius: 16px;
  background: #fff;
}

.stat__label {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  color: #475569;
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.stat__label::before {
  content: "";
  width: 8px;
  height: 8px;
  border-radius: 3px;
  background: var(--stat-ink, #94a3b8);
}

.stat__value {
  display: block;
  margin: 0.5rem 0 0.25rem;
  font-size: 1.4rem;
  font-weight: 700;
  letter-spacing: -0.03em;
  line-height: 1.15;
}

.stat__sub {
  margin: 0;
  color: #64748b;
  font-size: 0.78rem;
}

.stat--opening {
  --stat-ink: #94a3b8;
}

.stat--purchases {
  --stat-ink: #1d4ed8;
}

.stat--payments {
  --stat-ink: #0f766e;
}

.stat--due {
  --stat-ink: #b45309;
  border-color: #f6dfae;
  background: #fffaf0;
}

.stat--due .stat__label,
.stat--due .stat__value {
  color: #b45309;
}

.stat--clear {
  --stat-ink: #0f766e;
  border-color: #bfe6d7;
  background: #f2fbf8;
}

.stat--clear .stat__label,
.stat--clear .stat__value {
  color: #0f766e;
}

.meter {
  height: 6px;
  margin: 0.55rem 0 0.4rem;
  overflow: hidden;
  border-radius: 999px;
  background: rgba(180, 83, 9, 0.14);
}

.meter span {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: #0f766e;
}

.stat--clear .meter {
  background: rgba(15, 118, 110, 0.14);
}

.panel {
  margin-top: 1.25rem;
  border: 1px solid #e8edf1;
  border-radius: 16px;
  background: #fff;
}

.panel__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.85rem 1.25rem;
  border-bottom: 1px solid #eef1f4;
}

.tabs {
  display: inline-flex;
  gap: 0.25rem;
  padding: 0.25rem;
  border-radius: 11px;
  background: #f1f4f7;
}

.tabs button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  height: 32px;
  padding: 0 0.85rem;
  border: 0;
  border-radius: 8px;
  background: transparent;
  color: #64748b;
  font: inherit;
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
}

.tabs button:hover {
  color: #0f172a;
}

.tabs button.is-on {
  background: #fff;
  color: #0f5f58;
  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.1);
}

.tabs__count {
  min-width: 20px;
  padding: 0.05rem 0.4rem;
  border-radius: 999px;
  background: #e2e8f0;
  color: #475569;
  font-size: 0.68rem;
  text-align: center;
}

.tabs button.is-on .tabs__count {
  background: #e3f6ef;
  color: #0f766e;
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

tbody tr:last-child td {
  border-bottom: 0;
}

tbody tr:hover td {
  background: #fbfcfd;
}

.num {
  text-align: right;
}

.strong {
  font-weight: 600;
}

.muted {
  color: #475569;
}

.paid {
  color: #0f766e;
}

.notes {
  max-width: 260px;
  overflow: hidden;
  text-overflow: ellipsis;
}

.empty {
  padding: 1.75rem 1.25rem;
  color: #64748b;
  text-align: center;
  white-space: normal;
}

.link {
  color: #0f766e;
  font-weight: 600;
  text-decoration: none;
}

.link:hover {
  text-decoration: underline;
}

.chip {
  display: inline-flex;
  align-items: center;
  padding: 0.2rem 0.55rem;
  border-radius: 6px;
  font-size: 0.74rem;
  font-weight: 600;
  white-space: nowrap;
}

.chip--teal {
  background: #ecf8f3;
  color: #0f766e;
}

.chip--amber {
  background: #fff6e2;
  color: #b45309;
}

.chip--rose {
  background: #fdecef;
  color: #be123c;
}

.chip--blue {
  background: #eaf1ff;
  color: #1d4ed8;
}

.chip--grey {
  background: #f1f4f7;
  color: #64748b;
}

.cards {
  display: none;
  flex-direction: column;
  gap: 0.6rem;
  margin: 0;
  padding: 0.85rem;
  list-style: none;
}

.card {
  padding: 0.85rem 0.9rem;
  border: 1px solid #eef1f4;
  border-radius: 14px;
  background: #fff;
}

.card__top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.75rem;
}

.card__top small {
  display: block;
  margin-top: 0.15rem;
  color: #64748b;
  font-size: 0.76rem;
}

.card__top strong {
  flex: none;
  font-size: 0.95rem;
}

.card__foot {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.4rem;
  margin-top: 0.65rem;
}

.card__paid {
  margin-left: auto;
  color: #64748b;
  font-size: 0.76rem;
}

.card__note {
  color: #64748b;
  font-size: 0.78rem;
}

.statement {
  max-width: 560px;
  padding: 1.1rem 1.25rem 1.3rem;
}

.statement dl {
  margin: 0;
}

.statement__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.8rem 0;
  border-bottom: 1px dashed #e2e8f0;
}

.statement dt {
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  color: #475569;
  font-size: 0.88rem;
}

.statement dd {
  margin: 0;
  font-size: 0.95rem;
  font-weight: 600;
}

.sign {
  display: inline-grid;
  place-items: center;
  width: 20px;
  height: 20px;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 700;
}

.sign--plus {
  background: #eaf1ff;
  color: #1d4ed8;
}

.sign--minus {
  background: #ecf8f3;
  color: #0f766e;
}

.statement__row--total {
  margin-top: 0.4rem;
  padding: 0.85rem 0.95rem;
  border: 1px solid #f6dfae;
  border-radius: 12px;
  background: #fffaf0;
}

.statement__row--total dt,
.statement__row--total dd {
  color: #b45309;
  font-weight: 700;
}

.statement__row--total dd {
  font-size: 1.1rem;
}

.statement__row--total.is-clear {
  border-color: #bfe6d7;
  background: #f2fbf8;
}

.statement__row--total.is-clear dt,
.statement__row--total.is-clear dd {
  color: #0f766e;
}

.statement__note {
  margin: 0.85rem 0 0;
  color: #64748b;
  font-size: 0.78rem;
}

@media (max-width: 1080px) {
  .profile {
    flex-wrap: wrap;
  }

  .stats {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 800px) {
  .head {
    padding: 1rem 1rem 0;
    background: transparent;
    border-bottom: 0;
  }

  .profile {
    flex-direction: column;
    align-items: stretch;
  }

  .profile__main {
    align-items: flex-start;
  }

  .avatar {
    width: 48px;
    height: 48px;
  }

  h1 {
    font-size: 1.35rem;
    font-weight: 800;
  }

  .profile__actions {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }

  .btn {
    height: 44px;
    border-radius: 12px;
  }

  .btn--primary {
    grid-column: 1 / -1;
    grid-row: 1;
  }

  .body {
    padding: 1rem 1rem 2rem;
  }

  .stats {
    gap: 0.75rem;
  }

  .stat--due {
    grid-column: 1 / -1;
    order: -1;
  }

  .stat--opening {
    grid-column: 1 / -1;
    order: 1;
  }

  .stat__value {
    font-size: clamp(1.1rem, 5.2vw, 1.4rem);
    font-weight: 800;
  }

  .stat--due .stat__value {
    font-size: clamp(1.4rem, 7vw, 1.8rem);
  }

  .panel {
    border: 0;
    background: transparent;
  }

  .panel__head {
    flex-direction: column;
    align-items: stretch;
    padding: 0 0 0.75rem;
    border-bottom: 0;
  }

  .tabs {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    background: #e9edf1;
  }

  .tabs button {
    height: 36px;
    padding: 0 0.4rem;
  }

  .btn--soft {
    height: 40px;
    border-radius: 11px;
  }

  .table-wrap {
    display: none;
  }

  .cards {
    display: flex;
    padding: 0;
  }

  .card {
    border-color: #e8edf1;
    border-radius: 16px;
  }

  .banner--inset {
    margin: 0 0 0.75rem;
  }

  .statement {
    max-width: none;
    padding: 0.4rem 1rem 1rem;
    border: 1px solid #e8edf1;
    border-radius: 16px;
    background: #fff;
  }
}
</style>
