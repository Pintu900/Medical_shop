<template>
  <section class="page">
    <header class="head">
      <div>
        <RouterLink class="back" to="/admin/purchase-bills">
          <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M19 12H5M11 18l-6-6 6-6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" /></svg>
          Purchase bills
        </RouterLink>
        <h1>Add purchase bill</h1>
        <p>Enter bill details, record a payment if any, and upload an attachment.</p>
      </div>
      <span class="required-note"><abbr title="required">*</abbr> Required fields</span>
    </header>

    <form class="card form-card" novalidate @submit.prevent="onSubmit">
      <div class="section-head">
        <div>
          <h2>Invoice details</h2>
          <p>Use the information shown on the supplier invoice.</p>
        </div>
        <span class="section-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="19" height="19"><path d="M7 3h7l5 5v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zM14 3v6h6M8 13h8M8 17h5" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" /></svg>
        </span>
      </div>
      <div class="grid grid--4">
        <label class="field">
          <span>Wholesaler <abbr title="required">*</abbr></span>
          <select v-model="form.wholesalerId" :aria-invalid="errors.wholesalerId ? 'true' : 'false'">
            <option value="">Select wholesaler</option>
            <option v-for="item in wholesalers" :key="item.id" :value="String(item.id)">{{ item.name }}</option>
          </select>
          <small v-if="errors.wholesalerId" class="field__error">{{ errors.wholesalerId }}</small>
        </label>
        <label class="field">
          <span>Bill number (optional)</span>
          <input v-model.trim="form.billNumber" type="text" placeholder="ABC-101" />
        </label>
        <label class="field">
          <span>Bill date <abbr title="required">*</abbr></span>
          <input v-model="form.billDate" type="date" :aria-invalid="errors.billDate ? 'true' : 'false'" />
          <small v-if="errors.billDate" class="field__error">{{ errors.billDate }}</small>
        </label>
        <label class="field">
          <span>Bill attachments (images only)</span>
          <input type="file" accept="image/jpeg,image/png" multiple @change="onFiles" />
          <ul v-if="form.files.length" class="files">
            <li v-for="file in form.files" :key="file.id">
              <span>{{ file.name }}</span>
              <button type="button" @click="removeFile(file.id)">Remove</button>
            </li>
          </ul>
          <small v-if="errors.file" class="field__error">{{ errors.file }}</small>
        </label>
      </div>

      <div class="section-divider"></div>
      <div class="section-head">
        <div>
          <h2>Payment details</h2>
          <p>Record any amount paid at the time of purchase.</p>
        </div>
        <span class="section-icon section-icon--blue" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="19" height="19"><path d="M3 7h18v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7zM3 10h18M7 15h4" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" /></svg>
        </span>
      </div>
      <div class="grid">
        <label class="field">
          <span>Total amount (₹) <abbr title="required">*</abbr></span>
          <input
            :value="form.totalAmount"
            type="text"
            inputmode="decimal"
            placeholder="0.00"
            :aria-invalid="errors.totalAmount ? 'true' : 'false'"
            @input="onMoney('totalAmount', $event)"
            @blur="formatMoney('totalAmount')"
          />
          <small v-if="errors.totalAmount" class="field__error">{{ errors.totalAmount }}</small>
        </label>
        <label class="field">
          <span>Amount paid now (₹)</span>
          <input
            :value="form.amountPaid"
            type="text"
            inputmode="decimal"
            placeholder="0.00"
            :aria-invalid="errors.amountPaid ? 'true' : 'false'"
            @input="onMoney('amountPaid', $event)"
            @blur="formatMoney('amountPaid')"
          />
          <small v-if="errors.amountPaid" class="field__error">{{ errors.amountPaid }}</small>
        </label>
      </div>

      <div class="grid">
        <label class="field">
          <span>Payment method</span>
          <select v-model="form.paymentMethod" :aria-invalid="errors.paymentMethod ? 'true' : 'false'">
            <option value="">Select method</option>
            <option value="CASH">Cash</option>
            <option value="UPI">UPI</option>
            <option value="BANK_TRANSFER">Bank transfer</option>
            <option value="CHEQUE">Cheque</option>
          </select>
          <small v-if="errors.paymentMethod" class="field__error">{{ errors.paymentMethod }}</small>
        </label>
        <label class="field">
          <span>Reference number</span>
          <input
            v-model.trim="form.referenceNumber"
            type="text"
            placeholder="e.g. UPI / Transaction ID"
            :aria-invalid="errors.referenceNumber ? 'true' : 'false'"
          />
          <small v-if="errors.referenceNumber" class="field__error">{{ errors.referenceNumber }}</small>
        </label>
      </div>

      <label class="field">
        <span>Notes (optional)</span>
        <textarea v-model.trim="form.notes" rows="3" placeholder="Received stock as per bill. Part payment made." />
      </label>

      <aside class="due">
        <div>
          <span>Due added</span>
          <small>This amount will be added to the wholesaler's outstanding dues.</small>
        </div>
        <strong>{{ formatInr(due) }}</strong>
      </aside>

      <p v-if="submitError" class="field__error" role="alert">{{ submitError }}</p>

      <div class="actions">
        <RouterLink class="btn-cancel" to="/admin/purchase-bills">Cancel</RouterLink>
        <button class="btn-save" type="submit" :disabled="submitting">
          {{ submitting ? "Saving…" : "Save purchase" }}
        </button>
      </div>
    </form>
  </section>
</template>

<script>
import { post } from "../../../api";
import { attachmentSelectionError, uploadAttachments } from "../../../data/attachments";
import { fetchWholesalers, formatInr } from "../../../data/wholesalers";

const MONEY_INPUT = /^\d*(?:\.\d{0,2})?/;
const MONEY_VALUE = /^\d+(?:\.\d{1,2})?$/;

export default {
  name: "AddPurchaseBill",
  data() {
    return {
      wholesalers: [],
      form: {
        wholesalerId: "",
        billNumber: "",
        billDate: "",
        totalAmount: "",
        amountPaid: "",
        paymentMethod: "",
        referenceNumber: "",
        notes: "",
        files: [],
      },
      errors: {},
      submitError: "",
      submitting: false,
    };
  },
  computed: {
    due() {
      const total = Number(this.form.totalAmount) || 0;
      const paid = Number(this.form.amountPaid) || 0;
      return Math.max(total - paid, 0);
    },
  },
  async created() {
    try {
      this.wholesalers = await fetchWholesalers();
      const requested = String(this.$route.query.wholesalerId || "");
      if (requested && this.wholesalers.some((item) => String(item.id) === requested)) this.form.wholesalerId = requested;
    } catch (err) {
      this.submitError = err.message || "Could not load wholesalers.";
    }
  },
  beforeUnmount() {
    this.form.files.forEach((file) => {
      if (file.url) URL.revokeObjectURL(file.url);
    });
  },
  methods: {
    formatInr,
    onMoney(field, event) {
      const cleaned = event.target.value.replace(/[^\d.]/g, "");
      const match = cleaned.match(MONEY_INPUT);
      const next = match ? match[0] : "";
      this.form[field] = next;
      event.target.value = next;
    },
    formatMoney(field) {
      const value = String(this.form[field]).trim();
      if (value === "" || value === ".") {
        this.form[field] = "";
        return;
      }
      if (MONEY_VALUE.test(value)) this.form[field] = Number(value).toFixed(2);
    },
    onFiles(event) {
      const selected = Array.from(event.target.files || []);
      const message = attachmentSelectionError(this.form.files.length, selected);
      this.errors = { ...this.errors, file: message };
      if (!message) {
        const next = selected.map((file, index) => ({
          id: `file-${Date.now()}-${index}`,
          name: file.name,
          url: URL.createObjectURL(file),
          file,
        }));
        this.form.files = this.form.files.concat(next);
      }
      event.target.value = "";
    },
    removeFile(id) {
      const file = this.form.files.find((item) => item.id === id);
      if (file && file.url) URL.revokeObjectURL(file.url);
      this.form.files = this.form.files.filter((item) => item.id !== id);
    },
    validate() {
      const errors = {};
      if (!this.form.wholesalerId) errors.wholesalerId = "Select a wholesaler.";
      if (!this.form.billDate) errors.billDate = "Choose the bill date.";
      const total = String(this.form.totalAmount).trim();
      const paid = String(this.form.amountPaid).trim();
      if (!total || !MONEY_VALUE.test(total) || Number(total) <= 0) {
        errors.totalAmount = "Enter a total greater than 0, with up to 2 decimal places.";
      }
      if (paid && !MONEY_VALUE.test(paid)) {
        errors.amountPaid = "Enter a number with up to 2 decimal places.";
      } else if (paid && total && Number(paid) > Number(total)) {
        errors.amountPaid = "Paid amount cannot be more than the total.";
      }
      if (Number(paid) > 0 && !this.form.paymentMethod) errors.paymentMethod = "Select a payment method.";
      if (Number(paid) > 0 && !this.form.referenceNumber && this.form.paymentMethod !== "CASH") {
        errors.referenceNumber = "Enter the reference number.";
      }
      this.errors = errors;
      return Object.keys(errors).length === 0;
    },
    payload() {
      const paid = Number(this.form.amountPaid || 0);
      const body = {
        wholesalerId: Number(this.form.wholesalerId),
        billNumber: this.form.billNumber,
        billDate: this.form.billDate,
        totalAmount: Number(this.form.totalAmount),
        notes: this.form.notes,
      };
      if (paid > 0) {
        body.initialPayment = {
          amount: paid,
          paymentDate: this.form.billDate,
          method: this.form.paymentMethod,
          reference: this.form.referenceNumber,
        };
      }
      return body;
    },
    async onSubmit() {
      this.submitError = "";
      this.formatMoney("totalAmount");
      this.formatMoney("amountPaid");
      if (!this.validate()) return;
      this.submitting = true;
      try {
        const created = await post("/purchase-bills", this.payload());
        const id = created && created.id;
        if (id == null) {
          this.submitError = "The bill was saved, but its page could not be opened.";
          return;
        }
        if (this.form.files.length) {
          try {
            await uploadAttachments(id, this.form.files.map((item) => item.file));
          } catch (err) {
            await this.$router.push({ path: `/admin/purchase-bills/${id}`, query: { uploadError: "1" } });
            return;
          }
        }
        await this.$router.push(`/admin/purchase-bills/${id}`);
      } catch (err) {
        this.submitError = err.message || "Could not save this purchase bill.";
      } finally {
        this.submitting = false;
      }
    },
  },
};
</script>

<style scoped>
.page {
  min-height: 100vh;
  padding: 1.5rem 1.6rem 2.5rem;
  background: #f6f8fa;
  color: #0f172a;
}

.page > * {
  max-width: 1040px;
  margin-left: auto;
  margin-right: auto;
}

.head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1.15rem;
}

.back {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  color: #0f766e;
  font-size: 0.84rem;
  font-weight: 600;
  text-decoration: none;
}

.back:hover {
  color: #0c645d;
}

h1 {
  margin: 0.55rem 0 0.25rem;
  font-size: 1.65rem;
  letter-spacing: -0.03em;
}

.head p {
  margin: 0;
  color: #64748b;
  font-size: 0.86rem;
}

.required-note {
  color: #64748b;
  font-size: 0.78rem;
}

.required-note abbr,
.field abbr {
  color: #dc2626;
  text-decoration: none;
}

.card {
  background: #fff;
  border: 1px solid #e8edf1;
  border-radius: 16px;
  padding: 1.3rem 1.35rem 1.35rem;
}

.section-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1rem;
}

.section-head h2 {
  margin: 0;
  font-size: 1rem;
  letter-spacing: -0.01em;
}

.section-head p {
  margin: 0.22rem 0 0;
  color: #94a3b8;
  font-size: 0.76rem;
}

.section-icon {
  display: inline-grid;
  place-items: center;
  width: 34px;
  height: 34px;
  border-radius: 10px;
  background: #e6f6f2;
  color: #0f766e;
}

.section-icon--blue {
  background: #e7f0fd;
  color: #2563eb;
}

.section-divider {
  height: 1px;
  margin: 0.45rem 0 1.15rem;
  background: #eef1f4;
}

.grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.9rem;
}

.grid--4 {
  grid-template-columns: 1.2fr 1fr 0.9fr 1.2fr;
  margin-bottom: 0.9rem;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  margin-bottom: 0.9rem;
  font-size: 0.82rem;
  font-weight: 600;
}

.grid .field {
  margin-bottom: 0;
}

.field input,
.field select,
.field textarea {
  width: 100%;
  box-sizing: border-box;
  border: 1px solid #e2e8f0;
  border-radius: 9px;
  padding: 0.7rem 0.8rem;
  font: inherit;
  font-weight: 500;
  color: #0f172a;
  background: #fff;
}

.field input:focus,
.field select:focus,
.field textarea:focus {
  outline: 2px solid rgba(15, 118, 110, 0.25);
  border-color: #0f766e;
}

.field input[aria-invalid="true"],
.field select[aria-invalid="true"] {
  border-color: #dc2626;
}

.field small {
  font-weight: 400;
  color: #64748b;
  font-size: 0.78rem;
}

.files {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.files li {
  display: flex;
  justify-content: space-between;
  gap: 0.5rem;
  align-items: center;
  font-weight: 500;
}

.files button {
  border: 0;
  background: transparent;
  color: #b91c1c;
  font: inherit;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  padding: 0;
}

.field .field__error {
  color: #b91c1c;
  font-weight: 500;
}

.due {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin: 0.2rem 0 1rem;
  border: 1px solid #f6dfae;
  background: #fffaf0;
  border-radius: 12px;
  padding: 0.85rem 1rem;
}

.due span {
  display: block;
  color: #b45309;
  font-size: 0.84rem;
  font-weight: 700;
}

.due small {
  display: block;
  margin-top: 0.15rem;
  color: #9a3412;
  font-size: 0.76rem;
}

.due strong {
  display: block;
  margin: 0.15rem 0;
  color: #b45309;
  font-size: 1.35rem;
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.7rem;
}

.btn-save,
.btn-cancel {
  font: inherit;
  font-size: 0.925rem;
  font-weight: 600;
  border-radius: 9px;
  padding: 0.7rem 1.05rem;
  text-align: center;
  text-decoration: none;
}

.btn-save {
  border: 1px solid #0f766e;
  background: #0f766e;
  color: #fff;
  cursor: pointer;
}

.btn-save:disabled {
  opacity: 0.7;
}

.btn-cancel {
  border: 1px solid #e2e8f0;
  background: #fff;
  color: #334155;
}

@media (max-width: 800px) {
  .page {
    padding: 1rem 1rem 2rem;
  }

  .head {
    align-items: flex-start;
  }

  h1 {
    font-size: 1.45rem;
  }

  .required-note {
    display: none;
  }

  .grid,
  .grid--4,
  .actions {
    grid-template-columns: 1fr;
    flex-direction: column;
    align-items: stretch;
  }

  .btn-cancel {
    order: 2;
    border-color: transparent;
    background: transparent;
  }

  .due {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>
