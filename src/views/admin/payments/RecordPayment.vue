<template>
  <section class="page">
    <p class="crumb">
      <RouterLink to="/admin/payments">Payments</RouterLink>
      <span aria-hidden="true"> / </span>
      Record payment
    </p>
    <h1>Record payment</h1>

    <form class="layout" novalidate @submit.prevent="onSubmit">
      <div class="card">
        <label class="field">
          <span>Wholesaler <abbr title="required">*</abbr></span>
          <select v-model="form.wholesalerId" :aria-invalid="errors.wholesalerId ? 'true' : 'false'">
            <option value="">Select wholesaler</option>
            <option v-for="item in wholesalers" :key="item.id" :value="String(item.id)">{{ item.name }}</option>
          </select>
          <small v-if="errors.wholesalerId" class="field__error">{{ errors.wholesalerId }}</small>
        </label>

        <div class="grid">
          <label class="field">
            <span>Payment date <abbr title="required">*</abbr></span>
            <input v-model="form.date" type="date" :aria-invalid="errors.date ? 'true' : 'false'" />
            <small v-if="errors.date" class="field__error">{{ errors.date }}</small>
          </label>
          <label class="field">
            <span>Amount <abbr title="required">*</abbr></span>
            <span class="money">
              <span aria-hidden="true">₹</span>
              <input
                :value="form.amount"
                type="text"
                inputmode="decimal"
                placeholder="0.00"
                :aria-invalid="errors.amount ? 'true' : 'false'"
                @input="onMoney"
                @blur="formatMoney"
              />
            </span>
            <small v-if="errors.amount" class="field__error">{{ errors.amount }}</small>
          </label>
        </div>

        <label class="field">
          <span>Payment method <abbr title="required">*</abbr></span>
          <select v-model="form.method" :aria-invalid="errors.method ? 'true' : 'false'">
            <option value="">Select method</option>
            <option v-for="method in methods" :key="method.value" :value="method.value">{{ method.label }}</option>
          </select>
          <small v-if="errors.method" class="field__error">{{ errors.method }}</small>
        </label>

        <label class="field">
          <span>Reference (optional)</span>
          <input v-model.trim="form.reference" type="text" placeholder="UPI / cheque / transfer reference" />
        </label>

        <label class="field">
          <span>Notes (optional)</span>
          <textarea v-model.trim="form.notes" rows="3" placeholder="Part payment against outstanding" />
        </label>
      </div>

      <aside class="summary">
        <h2>Payment summary</h2>
        <dl>
          <div>
            <dt>Wholesaler</dt>
            <dd>{{ selected ? selected.name : "—" }}</dd>
          </div>
          <div>
            <dt>Current due</dt>
            <dd class="due">{{ selected ? formatInr(currentDue) : "—" }}</dd>
          </div>
          <div>
            <dt>Payment amount</dt>
            <dd>{{ formatInr(amountNumber) }}</dd>
          </div>
          <div class="balance">
            <dt>Balance after payment</dt>
            <dd>{{ selected ? formatInr(balance) : "—" }}</dd>
          </div>
        </dl>
        <p v-if="loadError" class="field__error" role="alert">{{ loadError }}</p>
        <p v-if="submitError" class="field__error" role="alert">{{ submitError }}</p>
        <button class="btn-save" type="submit" :disabled="submitting">{{ submitting ? "Saving…" : "Save payment" }}</button>
      </aside>
    </form>
  </section>
</template>

<script>
import { post } from "../../../api";
import { fetchOutstandingDues, fetchWholesalers, formatInr } from "../../../data/wholesalers";
import { PAYMENT_METHODS } from "../../../data/payments";

const MONEY_INPUT = /^\d*(?:\.\d{0,2})?/;
const MONEY_VALUE = /^\d+(?:\.\d{1,2})?$/;

function today() {
  const date = new Date();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

export default {
  name: "RecordPayment",
  data() {
    return {
      wholesalers: [],
      dues: [],
      methods: PAYMENT_METHODS,
      form: {
        wholesalerId: "",
        date: today(),
        amount: "",
        method: "",
        reference: "",
        notes: "",
      },
      errors: {},
      loadError: "",
      submitError: "",
      submitting: false,
    };
  },
  computed: {
    selected() {
      return this.wholesalers.find((item) => String(item.id) === this.form.wholesalerId) || null;
    },
    currentDue() {
      const row = this.dues.find((item) => String(item.wholesalerId) === this.form.wholesalerId);
      return row ? Number(row.currentDue) || 0 : 0;
    },
    amountNumber() {
      return Number(this.form.amount) || 0;
    },
    balance() {
      return this.currentDue - this.amountNumber;
    },
  },
  async created() {
    const [wholesalers, dues] = await Promise.allSettled([fetchWholesalers(), fetchOutstandingDues()]);
    if (wholesalers.status === "fulfilled") {
      this.wholesalers = [...wholesalers.value].sort((a, b) => String(a.name || "").localeCompare(String(b.name || "")));
      const requested = String(this.$route.query.wholesalerId || "");
      if (requested && this.wholesalers.some((item) => String(item.id) === requested)) this.form.wholesalerId = requested;
    } else {
      this.loadError = wholesalers.reason.message || "Could not load wholesalers.";
    }
    if (dues.status === "fulfilled") this.dues = dues.value;
  },
  methods: {
    formatInr,
    onMoney(event) {
      const cleaned = event.target.value.replace(/[^\d.]/g, "");
      const match = cleaned.match(MONEY_INPUT);
      const next = match ? match[0] : "";
      this.form.amount = next;
      event.target.value = next;
    },
    formatMoney() {
      const value = String(this.form.amount).trim();
      if (value === "" || value === ".") {
        this.form.amount = "";
        return;
      }
      if (MONEY_VALUE.test(value)) this.form.amount = Number(value).toFixed(2);
    },
    async onSubmit() {
      this.formatMoney();
      const errors = {};
      if (!this.form.wholesalerId) errors.wholesalerId = "Select a wholesaler.";
      if (!this.form.date) errors.date = "Choose the payment date.";
      if (!MONEY_VALUE.test(String(this.form.amount).trim()) || Number(this.form.amount) <= 0) {
        errors.amount = "Enter an amount greater than 0, with up to 2 decimal places.";
      }
      if (!this.form.method) errors.method = "Select a payment method.";
      this.errors = errors;
      if (Object.keys(errors).length || this.submitting) return;

      this.submitting = true;
      this.submitError = "";
      try {
        const payment = await post("/payments", {
          wholesalerId: Number(this.form.wholesalerId),
          paymentDate: this.form.date,
          amount: Number(this.form.amount),
          method: this.form.method,
          reference: this.form.reference,
          notes: this.form.notes,
        });
        if (payment && payment.id) this.$router.push(`/admin/payments/${payment.id}?saved=1`);
        else this.$router.push("/admin/payments");
      } catch (err) {
        this.submitError = err.message || "Could not save this payment.";
      } finally {
        this.submitting = false;
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

.crumb {
  margin: 0;
  color: #64748b;
  font-size: 0.8125rem;
}

.crumb a {
  color: #0f766e;
  font-weight: 600;
  text-decoration: none;
}

h1 {
  margin: 0.7rem 0 1rem;
  font-size: 1.7rem;
  letter-spacing: -0.03em;
}

.layout {
  display: grid;
  grid-template-columns: minmax(0, 1.5fr) minmax(260px, 0.8fr);
  gap: 1rem;
  align-items: start;
}

.card,
.summary {
  background: #fff;
  border: 1px solid #e6eeec;
  border-radius: 14px;
  padding: 1.15rem 1.2rem 1.3rem;
}

.grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.9rem;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  margin-bottom: 0.9rem;
  font-size: 0.875rem;
  font-weight: 600;
}

.grid .field {
  margin-bottom: 0.9rem;
}

.field abbr {
  color: #dc2626;
  text-decoration: none;
}

.field input,
.field select,
.field textarea,
.money {
  width: 100%;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: #fff;
  color: #0f172a;
  font: inherit;
  font-weight: 500;
}

.field input,
.field select,
.field textarea {
  padding: 0.7rem 0.8rem;
}

.money {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  padding-left: 0.8rem;
}

.money input {
  border: 0;
  padding-left: 0;
}

.field input:focus,
.field select:focus,
.field textarea:focus,
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

.field .field__error,
.field__error {
  color: #b91c1c;
  font-weight: 500;
  font-size: 0.78rem;
}

.summary h2 {
  margin: 0 0 0.8rem;
  font-size: 1rem;
}

.summary dl {
  margin: 0;
}

.summary div {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.7rem 0;
  border-bottom: 1px solid #eef3f2;
}

.summary dt {
  color: #64748b;
  font-size: 0.85rem;
}

.summary dd {
  margin: 0;
  font-weight: 700;
  text-align: right;
}

.due {
  color: #c2410c;
}

.balance {
  border-bottom: 0;
}

.balance dd {
  color: #166534;
}

.btn-save {
  width: 100%;
  margin-top: 0.9rem;
  border: 0;
  border-radius: 8px;
  background: #0f766e;
  color: #fff;
  padding: 0.75rem 1rem;
  font: inherit;
  font-weight: 600;
  cursor: pointer;
}

.btn-save:hover {
  background: #115e59;
}

.btn-save:disabled {
  opacity: 0.7;
  cursor: default;
}

@media (max-width: 800px) {
  .page {
    padding: 1rem;
  }

  h1 {
    font-size: 1.45rem;
  }

  .layout,
  .grid {
    grid-template-columns: 1fr;
  }
}
</style>
