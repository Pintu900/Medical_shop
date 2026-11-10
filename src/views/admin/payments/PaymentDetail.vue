<template>
  <section class="page">
    <p v-if="loading" class="missing">Loading payment…</p>
    <p v-else-if="loadError" class="missing">{{ loadError }}</p>
    <p v-else-if="!payment" class="missing">
      This payment was not found.
      <RouterLink to="/admin/payments">Back to payments</RouterLink>
    </p>

    <template v-else>
      <p class="crumb">
        <RouterLink to="/admin/payments">Payments</RouterLink>
        <span aria-hidden="true"> / </span>
        Payment details
      </p>

      <article class="card">
        <header class="card__head">
          <p v-if="saved" class="status">
            <span aria-hidden="true">✓</span>
            Payment recorded
          </p>
          <p v-else-if="corrected" class="status">
            <span aria-hidden="true">✓</span>
            Payment corrected
          </p>
          <button type="button" class="btn-edit" @click="openCorrect">Edit / Correct</button>
        </header>

        <h1>Payment details</h1>
        <dl class="details">
          <div>
            <dt>Payment ID</dt>
            <dd>{{ payment.id }}</dd>
          </div>
          <div>
            <dt>Date</dt>
            <dd>{{ formatPaymentDate(payment.paymentDate) }}</dd>
          </div>
          <div>
            <dt>Wholesaler</dt>
            <dd>
              <RouterLink :to="`/admin/wholesalers/${payment.wholesalerId}`">{{ payment.wholesalerName }}</RouterLink>
            </dd>
          </div>
          <div>
            <dt>Amount</dt>
            <dd>{{ formatInr(payment.amount) }}</dd>
          </div>
          <div>
            <dt>Payment method</dt>
            <dd>{{ methodLabel(payment.method) }}</dd>
          </div>
          <div>
            <dt>Reference</dt>
            <dd>{{ payment.reference || "—" }}</dd>
          </div>
          <div class="wide">
            <dt>Notes</dt>
            <dd>{{ payment.notes || "—" }}</dd>
          </div>
        </dl>

        <footer v-if="payment.recordedBy || payment.recordedAt" class="meta">
          <p v-if="payment.recordedBy"><span>Recorded by</span> {{ payment.recordedBy }}</p>
          <p v-if="payment.recordedAt"><span>Recorded on</span> {{ formatRecordedAt(payment.recordedAt) }}</p>
        </footer>
      </article>

      <div v-if="correcting" class="backdrop" @click.self="closeCorrect">
        <form class="modal" role="dialog" aria-labelledby="correct-title" novalidate @submit.prevent="onCorrect">
          <header class="modal__head">
            <h2 id="correct-title">Correct payment <small>Owner only</small></h2>
            <button type="button" class="close" aria-label="Close" @click="closeCorrect">×</button>
          </header>
          <p class="warn">This will update the payment record. Only owners can make corrections.</p>

          <div class="grid">
            <label class="field">
              <span>Amount <abbr title="required">*</abbr></span>
              <span class="money">
                <span aria-hidden="true">₹</span>
                <input
                  :value="form.amount"
                  type="text"
                  inputmode="decimal"
                  :aria-invalid="errors.amount ? 'true' : 'false'"
                  @input="onMoney"
                  @blur="formatMoney"
                />
              </span>
              <small v-if="errors.amount" class="field__error">{{ errors.amount }}</small>
            </label>
            <label class="field">
              <span>Date <abbr title="required">*</abbr></span>
              <input v-model="form.date" type="date" :aria-invalid="errors.date ? 'true' : 'false'" />
              <small v-if="errors.date" class="field__error">{{ errors.date }}</small>
            </label>
          </div>

          <div class="grid">
            <label class="field">
              <span>Payment method <abbr title="required">*</abbr></span>
              <select v-model="form.method" :aria-invalid="errors.method ? 'true' : 'false'">
                <option v-for="method in methods" :key="method.value" :value="method.value">{{ method.label }}</option>
              </select>
              <small v-if="errors.method" class="field__error">{{ errors.method }}</small>
            </label>
            <label class="field">
              <span>Reference (optional)</span>
              <input v-model.trim="form.reference" type="text" />
            </label>
          </div>

          <label class="field">
            <span>Correction reason <abbr title="required">*</abbr></span>
            <input
              v-model.trim="form.correctionReason"
              type="text"
              placeholder="Entered wrong reference earlier"
              :aria-invalid="errors.correctionReason ? 'true' : 'false'"
            />
            <small v-if="errors.correctionReason" class="field__error">{{ errors.correctionReason }}</small>
          </label>

          <div class="actions">
            <button type="button" class="btn-cancel" @click="closeCorrect">Cancel</button>
            <button class="btn-save" type="submit">Save correction</button>
          </div>
        </form>
      </div>
    </template>
  </section>
</template>

<script>
import { formatInr } from "../../../data/wholesalers";
import {
  fetchPayment,
  formatPaymentDate,
  formatRecordedAt,
  methodLabel,
  PAYMENT_METHODS,
  updatePayment,
} from "../../../data/payments";

const MONEY_INPUT = /^\d*(?:\.\d{0,2})?/;
const MONEY_VALUE = /^\d+(?:\.\d{1,2})?$/;

export default {
  name: "PaymentDetail",
  data() {
    return {
      payment: null,
      loading: false,
      loadError: "",
      correcting: false,
      methods: PAYMENT_METHODS,
      form: {
        amount: "",
        date: "",
        method: "",
        reference: "",
        correctionReason: "",
      },
      errors: {},
    };
  },
  computed: {
    saved() {
      return this.$route.query.saved === "1";
    },
    corrected() {
      return this.$route.query.corrected === "1";
    },
  },
  watch: {
    "$route.params.id": {
      immediate: true,
      async handler(id) {
        this.correcting = false;
        this.loadError = "";
        this.payment = null;
        this.loading = true;
        try {
          this.payment = await fetchPayment(id);
        } catch (err) {
          this.loadError = err.message || "Could not load this payment.";
        } finally {
          this.loading = false;
        }
      },
    },
  },
  methods: {
    formatInr,
    formatPaymentDate,
    formatRecordedAt,
    methodLabel,
    openCorrect() {
      this.form = {
        amount: Number(this.payment.amount).toFixed(2),
        date: this.payment.paymentDate,
        method: this.payment.method,
        reference: this.payment.reference || "",
        correctionReason: "",
      };
      this.errors = {};
      this.correcting = true;
    },
    closeCorrect() {
      this.correcting = false;
    },
    onMoney(event) {
      const cleaned = event.target.value.replace(/[^\d.]/g, "");
      const match = cleaned.match(MONEY_INPUT);
      const next = match ? match[0] : "";
      this.form.amount = next;
      event.target.value = next;
    },
    formatMoney() {
      const value = String(this.form.amount).trim();
      if (MONEY_VALUE.test(value)) this.form.amount = Number(value).toFixed(2);
    },
    onCorrect() {
      this.formatMoney();
      const errors = {};
      if (!MONEY_VALUE.test(String(this.form.amount).trim()) || Number(this.form.amount) <= 0) {
        errors.amount = "Enter an amount greater than 0, with up to 2 decimal places.";
      }
      if (!this.form.date) errors.date = "Choose the payment date.";
      if (!this.form.method) errors.method = "Select a payment method.";
      if (!this.form.correctionReason) errors.correctionReason = "Enter the reason for this correction.";
      this.errors = errors;
      if (Object.keys(errors).length) return;

      const patch = {
        amount: Number(this.form.amount),
        paymentDate: this.form.date,
        method: this.form.method,
        reference: this.form.reference,
        correctionReason: this.form.correctionReason,
      };
      this.payment = updatePayment(this.payment.id, patch) || { ...this.payment, ...patch };
      this.correcting = false;
      this.$router.replace({ query: { corrected: "1" } });
    },
  },
};
</script>

<style scoped>
.page {
  max-width: 820px;
  padding: 1.5rem 1.75rem 2.5rem;
}

.crumb,
.missing {
  margin: 0;
  color: #64748b;
  font-size: 0.8125rem;
}

.crumb a,
.missing a,
.details a {
  color: #0f766e;
  font-weight: 600;
  text-decoration: none;
}

.card {
  margin-top: 1rem;
  background: #fff;
  border: 1px solid #e6eeec;
  border-radius: 14px;
  padding: 1.15rem 1.2rem 1.3rem;
}

.card__head,
.modal__head,
.actions,
.meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
}

.status {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  margin: 0;
  color: #166534;
  font-weight: 700;
}

.status span {
  width: 1.2rem;
  height: 1.2rem;
  border-radius: 999px;
  background: #dcfce7;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
}

.btn-edit,
.btn-cancel,
.btn-save,
.close {
  font: inherit;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
}

.btn-edit,
.btn-cancel {
  border: 1px solid #e2e8f0;
  background: #fff;
  color: #0f172a;
  padding: 0.55rem 0.8rem;
}

h1 {
  margin: 1rem 0 0.4rem;
  font-size: 1.45rem;
  letter-spacing: -0.03em;
}

.details {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.85rem 1.5rem;
  margin: 1rem 0 0;
}

.details div {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.wide {
  grid-column: 1 / -1;
}

dt,
.meta span {
  color: #64748b;
  font-size: 0.8rem;
}

dd,
.meta p {
  margin: 0;
  font-weight: 600;
}

.meta {
  margin-top: 1.2rem;
  padding-top: 0.9rem;
  border-top: 1px solid #eef3f2;
  align-items: flex-start;
}

.meta p {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  font-weight: 600;
}

.backdrop {
  position: fixed;
  inset: 0;
  z-index: 50;
  background: rgba(15, 23, 42, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.modal {
  width: min(560px, 100%);
  background: #fff;
  border-radius: 16px;
  padding: 1.1rem 1.15rem 1.2rem;
}

.modal h2 {
  margin: 0;
  font-size: 1.15rem;
}

.modal h2 small {
  margin-left: 0.35rem;
  color: #64748b;
  font-size: 0.78rem;
  font-weight: 600;
}

.close {
  border: 0;
  background: transparent;
  color: #64748b;
  font-size: 1.4rem;
  line-height: 1;
}

.warn {
  margin: 0.85rem 0 1rem;
  background: #fff7ed;
  color: #9a3412;
  border-radius: 10px;
  padding: 0.75rem 0.85rem;
  font-size: 0.88rem;
  font-weight: 600;
}

.grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.85rem;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  margin-bottom: 0.85rem;
  font-size: 0.85rem;
  font-weight: 600;
}

.field abbr {
  color: #dc2626;
  text-decoration: none;
}

.field input,
.field select,
.money {
  width: 100%;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: #fff;
  font: inherit;
  font-weight: 500;
  color: #0f172a;
}

.field input,
.field select {
  padding: 0.65rem 0.75rem;
}

.money {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  padding-left: 0.75rem;
}

.money input {
  border: 0;
  padding-left: 0;
}

.field input:focus,
.field select:focus,
.money:focus-within {
  outline: 2px solid rgba(15, 118, 110, 0.25);
  border-color: #0f766e;
}

.money input:focus {
  outline: none;
}

.field input[aria-invalid="true"],
.field select[aria-invalid="true"],
.money:has(input[aria-invalid="true"]) {
  border-color: #dc2626;
}

.field .field__error {
  color: #b91c1c;
  font-weight: 500;
  font-size: 0.78rem;
}

.actions {
  justify-content: flex-end;
}

.btn-save {
  border: 0;
  background: #0f766e;
  color: #fff;
  padding: 0.65rem 0.95rem;
}

.btn-save:hover {
  background: #115e59;
}

@media (max-width: 800px) {
  .page {
    padding: 1rem;
  }

  .details,
  .grid,
  .meta,
  .card__head,
  .actions {
    grid-template-columns: 1fr;
    flex-direction: column;
    align-items: stretch;
  }

  .btn-save,
  .btn-cancel,
  .btn-edit {
    width: 100%;
  }
}
</style>
