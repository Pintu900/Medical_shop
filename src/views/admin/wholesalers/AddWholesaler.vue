<template>
  <section class="page">
    <p class="crumb">Wholesalers / Add wholesaler</p>
    <h1>Add wholesaler</h1>
    <p class="lead">Save supplier details and any existing dues.</p>

    <form class="grid" novalidate @submit.prevent="onSubmit">
      <div class="card">
        <h2>Business details</h2>

        <label class="field" for="wholesaler-name">
          <span>Wholesaler name <abbr title="required">*</abbr></span>
          <input
            id="wholesaler-name"
            v-model.trim="form.name"
            type="text"
            autocomplete="organization"
            placeholder="e.g. ABC Distributors"
            :aria-invalid="fieldErrors.name ? 'true' : 'false'"
            @input="clearStatus"
          />
          <small v-if="fieldErrors.name" class="field__error">{{ fieldErrors.name }}</small>
        </label>

        <label class="field" for="wholesaler-phone">
          <span>Phone number (optional)</span>
          <div class="phone">
            <span class="phone__code">+91</span>
            <input
              id="wholesaler-phone"
              :value="form.phone"
              type="tel"
              inputmode="numeric"
              autocomplete="tel-national"
              maxlength="10"
              :aria-invalid="fieldErrors.phone ? 'true' : 'false'"
              @input="onPhone"
            />
          </div>
          <small v-if="fieldErrors.phone" class="field__error">{{ fieldErrors.phone }}</small>
        </label>

        <label class="field" for="wholesaler-address">
          <span>Address (optional)</span>
          <textarea
            id="wholesaler-address"
            v-model.trim="form.address"
            rows="3"
            placeholder="Enter complete address (optional)"
            @input="clearStatus"
          />
        </label>
      </div>

      <aside class="card card--next">
        <h2>What happens next</h2>
        <ul>
          <li>
            <span class="icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="18" height="18">
                <path d="M7 3h7l5 5v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zM14 3v6h6M8 13h8M8 17h5" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </span>
            <span>
              <strong>Add purchase bills</strong>
              Record bills from this wholesaler.
            </span>
          </li>
          <li>
            <span class="icon" aria-hidden="true">₹</span>
            <span>
              <strong>Record payments</strong>
              Add payments made to this wholesaler.
            </span>
          </li>
          <li>
            <span class="icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="18" height="18">
                <path d="M4 19V5M4 19h16M8 16l3-4 3 2 4-6" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </span>
            <span>
              <strong>Track outstanding dues</strong>
              See current balance based on bills and payments.
            </span>
          </li>
        </ul>
      </aside>

      <div class="card">
        <h2>Opening balance</h2>

        <label class="field" for="opening-due">
          <span>Opening due (₹)</span>
          <input
            id="opening-due"
            :value="form.openingDue"
            type="text"
            inputmode="decimal"
            placeholder="0.00"
            :aria-invalid="fieldErrors.openingDue ? 'true' : 'false'"
            @blur="formatDue"
            @input="onOpeningDue"
          />
          <small>Amount already owed before tracking starts.</small>
          <small v-if="fieldErrors.openingDue" class="field__error">{{ fieldErrors.openingDue }}</small>
        </label>

        <label class="field" for="balance-date">
          <span>Opening balance date (optional)</span>
          <div class="date" :class="{ 'is-empty': !form.balanceDate }">
            <input id="balance-date" v-model="form.balanceDate" type="date" @input="clearStatus" />
            <span v-if="!form.balanceDate" class="date__hint">Defaults to creation date</span>
          </div>
          <small>Leave blank to use the creation date in India.</small>
        </label>

        <div class="note">
          <span class="note__icon" aria-hidden="true">i</span>
          <p>
            <strong>Entering older bills?</strong>
            Choose a date on or before your first bill. Opening due should cover only amounts before that date.
          </p>
        </div>
      </div>

      <div class="actions">
        <p v-if="success" class="banner" role="status">{{ success }}</p>
        <div class="actions__row">
          <button class="btn-save" type="submit" :disabled="submitting">
            {{ submitting ? "Saving…" : "Create wholesaler" }}
          </button>
          <button class="btn-cancel" type="button" @click="onCancel">Cancel</button>
        </div>
      </div>
    </form>
  </section>
</template>

<script>
import { post } from "../../../api";
const PHONE_INPUT = /^\d{0,10}/;
const PHONE_VALUE = /^\d{10}$/;
const OPENING_DUE_INPUT = /^\d*(?:\.\d{0,2})?/;
const OPENING_DUE_VALUE = /^\d+(?:\.\d{1,2})?$/;

const EMPTY_FORM = () => ({
  name: "",
  phone: "",
  address: "",
  openingDue: "",
  balanceDate: "",
});

export default {
  name: "AddWholesaler",
  data() {
    return {
      form: EMPTY_FORM(),
      fieldErrors: {},
      success: "",
      submitting: false,
    };
  },
  methods: {
    clearStatus() {
      this.success = "";
    },
    onPhone(event) {
      const cleaned = event.target.value.replace(/\D/g, "");
      const match = cleaned.match(PHONE_INPUT);
      const next = match ? match[0] : "";
      this.form.phone = next;
      event.target.value = next;
      this.clearStatus();
    },
    onOpeningDue(event) {
      const cleaned = event.target.value.replace(/[^\d.]/g, "");
      const match = cleaned.match(OPENING_DUE_INPUT);
      const next = match ? match[0] : "";
      this.form.openingDue = next;
      event.target.value = next;
      this.clearStatus();
    },
    formatDue() {
      const value = String(this.form.openingDue).trim();
      if (value === "" || value === ".") {
        this.form.openingDue = "";
        return;
      }
      if (!OPENING_DUE_VALUE.test(value)) return;
      this.form.openingDue = Number(value).toFixed(2);
    },
    validate() {
      const errors = {};
      if (!this.form.name) errors.name = "Enter the wholesaler name.";
      if (this.form.phone && !PHONE_VALUE.test(this.form.phone)) {
        errors.phone = "Enter a 10-digit phone number, or leave it blank.";
      }
      const due = String(this.form.openingDue).trim();
      if (due !== "" && !OPENING_DUE_VALUE.test(due)) {
        errors.openingDue = "Enter a number with up to 2 decimal places.";
      }
      this.fieldErrors = errors;
      return Object.keys(errors).length === 0;
    },
    payload() {
      const amount = Number(String(this.form.openingDue).trim() || "0");
      return {
        name: this.form.name,
        phone: this.form.phone ? `+91${this.form.phone}` : "",
        address: this.form.address,
        openingDue: amount.toFixed(2),
        balanceDate: this.form.balanceDate || null,
      };
    },
    async onSubmit() {
      this.success = "";
      this.formatDue();
      if (!this.validate()) return;
      this.submitting = true;
      try {
        const body = this.payload();
        // Replace this with your API call, for example:
        await post("/wholesalers", body);
        await Promise.resolve(body);
        this.success = "Details captured. Saving to the server is not connected yet.";
      } finally {
        this.submitting = false;
      }
    },
    onCancel() {
      this.form = EMPTY_FORM();
      this.fieldErrors = {};
      this.success = "";
    },
  },
};
</script>

<style scoped>
.page {
  max-width: 1040px;
  padding: 1.5rem 1.75rem 2.5rem;
}

.crumb {
  margin: 0 0 0.85rem;
  color: #64748b;
  font-size: 0.8125rem;
}

h1 {
  margin: 0;
  font-size: 1.7rem;
  letter-spacing: -0.03em;
  line-height: 1.2;
}

.lead {
  margin: 0.35rem 0 1.25rem;
  color: #64748b;
}

.grid {
  display: grid;
  grid-template-columns: minmax(0, 1.45fr) minmax(240px, 0.8fr);
  gap: 1rem 1.15rem;
  align-items: start;
}

.card--next {
  grid-column: 2;
  grid-row: 1;
}

.card {
  background: #fff;
  border: 1px solid #e6eeec;
  border-radius: 14px;
  padding: 1.15rem 1.2rem 1.25rem;
}

h2 {
  margin: 0 0 1rem;
  font-size: 1rem;
  letter-spacing: -0.02em;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  margin-bottom: 0.95rem;
  font-size: 0.875rem;
  font-weight: 600;
}

.field abbr {
  color: #dc2626;
  text-decoration: none;
}

.field input,
.field textarea {
  width: 100%;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 0.7rem 0.8rem;
  font: inherit;
  font-weight: 400;
  color: #0f172a;
  background: #fff;
}

.field textarea {
  resize: vertical;
  min-height: 5.5rem;
}

.field input::placeholder,
.field textarea::placeholder {
  color: #94a3b8;
}

.field input:focus,
.field textarea:focus {
  outline: 2px solid rgba(15, 118, 110, 0.25);
  border-color: #0f766e;
}

.field small {
  font-weight: 400;
  color: #64748b;
  font-size: 0.78rem;
}

.field .field__error {
  color: #b91c1c;
  font-weight: 500;
}

.field input[aria-invalid="true"],
.phone:has(input[aria-invalid="true"]) {
  border-color: #dc2626;
}

.phone {
  display: flex;
  align-items: center;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: #fff;
}

.phone:focus-within {
  outline: 2px solid rgba(15, 118, 110, 0.25);
  border-color: #0f766e;
}

.phone__code {
  padding: 0 0.75rem;
  color: #64748b;
  font-weight: 500;
  border-right: 1px solid #e2e8f0;
}

.phone input,
.phone input:focus {
  border: 0;
  outline: none;
  box-shadow: none;
}

.date {
  position: relative;
}

.date__hint {
  position: absolute;
  left: 0.8rem;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
  font-weight: 400;
  pointer-events: none;
}

.date.is-empty:not(:focus-within) input::-webkit-datetime-edit {
  color: transparent;
}

.card--next ul {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.card--next li {
  display: flex;
  gap: 0.75rem;
  align-items: flex-start;
  color: #64748b;
  font-size: 0.84rem;
  font-weight: 400;
  line-height: 1.45;
}

.card--next strong {
  display: block;
  color: #0f172a;
  font-size: 0.9rem;
  margin-bottom: 0.1rem;
}

.icon {
  width: 36px;
  height: 36px;
  border-radius: 999px;
  background: #e7f6f3;
  color: #0f766e;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-weight: 700;
}

.note {
  display: flex;
  gap: 0.7rem;
  align-items: flex-start;
  background: #f8fafc;
  border: 1px solid #e8eef2;
  border-radius: 10px;
  padding: 0.8rem 0.85rem;
  color: #64748b;
  font-size: 0.82rem;
  line-height: 1.45;
}

.note p {
  margin: 0;
}

.note strong {
  display: block;
  color: #0f172a;
  margin-bottom: 0.15rem;
}

.note__icon {
  width: 18px;
  height: 18px;
  border-radius: 999px;
  border: 1.5px solid #64748b;
  color: #475569;
  font-size: 0.72rem;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 0.1rem;
}

.actions {
  grid-column: 1;
}

.banner {
  margin: 0 0 0.75rem;
  color: #0f766e;
  font-size: 0.875rem;
  font-weight: 600;
}

.actions__row {
  display: flex;
  align-items: center;
  gap: 0.7rem;
}

.btn-save,
.btn-cancel {
  font: inherit;
  font-size: 0.925rem;
  font-weight: 600;
  border-radius: 8px;
  padding: 0.7rem 1.05rem;
  cursor: pointer;
}

.btn-save {
  background: #0f766e;
  color: #fff;
  border: 1px solid #0f766e;
}

.btn-save:hover {
  background: #115e59;
}

.btn-save:disabled {
  opacity: 0.7;
  cursor: default;
}

.btn-cancel {
  background: #fff;
  color: #334155;
  border: 1px solid #e2e8f0;
}

.btn-cancel:hover {
  border-color: #cbd5e1;
}

@media (max-width: 800px) {
  .page {
    padding: 1rem 1rem 2rem;
  }

  h1 {
    font-size: 1.45rem;
  }

  .grid {
    grid-template-columns: 1fr;
  }

  .card--next {
    display: none;
  }

  .actions__row {
    flex-direction: column;
    align-items: stretch;
  }

  .btn-cancel {
    background: transparent;
    border-color: transparent;
  }
}
</style>
