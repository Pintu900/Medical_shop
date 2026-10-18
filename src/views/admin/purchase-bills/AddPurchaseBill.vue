<template>
  <section class="page">
    <p class="crumb">Purchase bills / Add purchase bill</p>
    <h1>Add purchase bill</h1>
    <p class="lead">Enter bill details, record a payment if any, and upload an attachment.</p>

    <form class="card" novalidate @submit.prevent="onSubmit">
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
          <input type="file" accept="image/*" multiple @change="onFiles" />
          <ul v-if="form.files.length" class="files">
            <li v-for="file in form.files" :key="file.id">
              <span>{{ file.name }}</span>
              <button type="button" @click="removeFile(file.id)">Remove</button>
            </li>
          </ul>
          <small v-if="errors.file" class="field__error">{{ errors.file }}</small>
        </label>
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
        <span>Due added (₹)</span>
        <strong>{{ formatInr(due) }}</strong>
        <small>This will be added to the wholesaler's dues.</small>
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
    } catch (err) {
      this.submitError = err.message || "Could not load wholesalers.";
    }
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
      const images = selected.filter((file) => file.type.startsWith("image/"));
      this.errors = {
        ...this.errors,
        file: images.length === selected.length ? "" : "Only image files were added.",
      };
      const next = images.map((file, index) => ({
        id: `file-${Date.now()}-${index}`,
        name: file.name,
        url: URL.createObjectURL(file),
      }));
      this.form.files = this.form.files.concat(next);
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
        await post("/purchase-bills", this.payload());
        this.$router.push("/admin/purchase-bills");
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
  max-width: 1040px;
  padding: 1.5rem 1.75rem 2.5rem;
}

.crumb,
.lead {
  margin: 0;
  color: #64748b;
}

.crumb {
  font-size: 0.8125rem;
}

h1 {
  margin: 0.7rem 0 0.35rem;
  font-size: 1.7rem;
  letter-spacing: -0.03em;
}

.lead {
  margin-bottom: 1rem;
}

.card {
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

.grid--4 {
  grid-template-columns: 1.2fr 1fr 0.9fr 1.2fr;
  margin-bottom: 0.9rem;
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
  margin-bottom: 0;
}

.field abbr {
  color: #dc2626;
  text-decoration: none;
}

.field input,
.field select,
.field textarea {
  width: 100%;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
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
  margin: 0.2rem 0 1rem;
  background: #fff7ed;
  border-radius: 12px;
  padding: 0.85rem 1rem;
}

.due span,
.due small {
  display: block;
  color: #9a3412;
  font-size: 0.8rem;
}

.due strong {
  display: block;
  margin: 0.15rem 0;
  color: #c2410c;
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
  border-radius: 8px;
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
    padding: 1rem;
  }

  h1 {
    font-size: 1.45rem;
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
}
</style>
