<template>
  <section class="page">
    <p v-if="!bill" class="missing">
      This purchase bill was not found.
      <RouterLink to="/admin/purchase-bills">Back to purchase bills</RouterLink>
    </p>

    <form v-else class="card" novalidate @submit.prevent="onSubmit">
      <p class="crumb">
        <RouterLink :to="`/admin/purchase-bills/${bill.id}`">{{ bill.billNumber || "Purchase bill" }}</RouterLink>
        <span aria-hidden="true"> / </span>
        Edit
      </p>
      <h1>Edit purchase bill</h1>
      <p class="sub">{{ bill.wholesalerName }}</p>

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
        <input v-model.trim="form.billNumber" type="text" />
      </label>

      <label class="field">
        <span>Bill date <abbr title="required">*</abbr></span>
        <input v-model="form.billDate" type="date" :aria-invalid="errors.billDate ? 'true' : 'false'" />
        <small v-if="errors.billDate" class="field__error">{{ errors.billDate }}</small>
      </label>

      <label class="field">
        <span>Total amount (₹) <abbr title="required">*</abbr></span>
        <input
          :value="form.totalAmount"
          type="text"
          inputmode="decimal"
          :aria-invalid="errors.totalAmount ? 'true' : 'false'"
          @input="onMoney"
          @blur="formatMoney"
        />
        <small v-if="errors.totalAmount" class="field__error">{{ errors.totalAmount }}</small>
      </label>

      <label class="field">
        <span>Notes (optional)</span>
        <textarea v-model.trim="form.notes" rows="3" />
      </label>

      <p class="hint">Received stock as per bill. Part payment made.</p>

      <label class="field">
        <span>Reason for correction <abbr title="required">*</abbr></span>
        <textarea
          v-model.trim="form.reason"
          rows="3"
          placeholder="Enter the reason for this correction"
          :aria-invalid="errors.reason ? 'true' : 'false'"
        />
        <small v-if="errors.reason" class="field__error">{{ errors.reason }}</small>
      </label>

      <div class="actions">
        <button class="btn-save" type="submit">Save changes</button>
        <RouterLink class="btn-cancel" :to="`/admin/purchase-bills/${bill.id}`">Cancel</RouterLink>
      </div>
    </form>
  </section>
</template>

<script>
import { fetchWholesalers } from "../../../data/wholesalers";
import { getPurchaseBill, updatePurchaseBill } from "../../../data/purchaseBills";

const MONEY_INPUT = /^\d*(?:\.\d{0,2})?/;
const MONEY_VALUE = /^\d+(?:\.\d{1,2})?$/;

export default {
  name: "EditPurchaseBill",
  data() {
    return {
      bill: null,
      wholesalers: [],
      form: {
        wholesalerId: "",
        billNumber: "",
        billDate: "",
        totalAmount: "",
        notes: "",
        reason: "",
      },
      errors: {},
    };
  },
  async created() {
    this.wholesalers = await fetchWholesalers().catch(() => []);
    this.load(this.$route.params.id);
  },
  watch: {
    "$route.params.id"(id) {
      this.load(id);
    },
  },
  methods: {
    load(id) {
      const bill = getPurchaseBill(id);
      this.bill = bill;
      this.errors = {};
      if (!bill) return;
      const match = this.wholesalers.find((item) => item.name === bill.wholesalerName || String(item.id) === String(bill.wholesalerId));
      this.form = {
        wholesalerId: match ? String(match.id) : "",
        billNumber: bill.billNumber,
        billDate: bill.billDate,
        totalAmount: Number(bill.totalAmount).toFixed(2),
        notes: bill.notes,
        reason: "",
      };
    },
    onMoney(event) {
      const cleaned = event.target.value.replace(/[^\d.]/g, "");
      const match = cleaned.match(MONEY_INPUT);
      const next = match ? match[0] : "";
      this.form.totalAmount = next;
      event.target.value = next;
    },
    formatMoney() {
      const value = String(this.form.totalAmount).trim();
      if (value === "" || value === ".") {
        this.form.totalAmount = "";
        return;
      }
      if (MONEY_VALUE.test(value)) this.form.totalAmount = Number(value).toFixed(2);
    },
    onSubmit() {
      this.formatMoney();
      const errors = {};
      const total = String(this.form.totalAmount).trim();
      if (!this.form.wholesalerId) errors.wholesalerId = "Select a wholesaler.";
      if (!this.form.billDate) errors.billDate = "Choose the bill date.";
      if (!total || !MONEY_VALUE.test(total) || Number(total) <= 0) {
        errors.totalAmount = "Enter a total greater than 0, with up to 2 decimal places.";
      } else if (Number(total) < Number(this.bill.amountPaid)) {
        errors.totalAmount = "Total cannot be less than the amount already paid.";
      }
      if (!this.form.reason) errors.reason = "Enter a reason for this correction.";
      this.errors = errors;
      if (Object.keys(errors).length) return;
      const wholesaler = this.wholesalers.find((item) => String(item.id) === this.form.wholesalerId);
      updatePurchaseBill(this.bill.id, {
        wholesalerId: this.form.wholesalerId,
        wholesalerName: wholesaler ? wholesaler.name : this.bill.wholesalerName,
        billNumber: this.form.billNumber,
        billDate: this.form.billDate,
        totalAmount: Number(this.form.totalAmount),
        notes: this.form.notes,
        correctionReason: this.form.reason,
      });
      this.$router.push(`/admin/purchase-bills/${this.bill.id}`);
    },
  },
};
</script>

<style scoped>
.page {
  max-width: 640px;
  padding: 1.5rem 1.75rem 2.5rem;
}

.card {
  background: #fff;
  border: 1px solid #e6eeec;
  border-radius: 14px;
  padding: 1.15rem 1.2rem 1.3rem;
}

.crumb,
.sub,
.missing,
.hint {
  color: #64748b;
}

.crumb {
  margin: 0 0 0.8rem;
  font-size: 0.8125rem;
}

.crumb a,
.missing a {
  color: #0f766e;
  font-weight: 600;
  text-decoration: none;
}

h1 {
  margin: 0;
  font-size: 1.45rem;
  letter-spacing: -0.03em;
}

.sub {
  margin: 0.25rem 0 1rem;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  margin-bottom: 0.9rem;
  font-size: 0.875rem;
  font-weight: 600;
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
.field select[aria-invalid="true"],
.field textarea[aria-invalid="true"] {
  border-color: #dc2626;
}

.field .field__error {
  color: #b91c1c;
  font-weight: 500;
}

.hint {
  margin: -0.3rem 0 0.9rem;
  font-size: 0.82rem;
}

.actions {
  display: flex;
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

.btn-cancel {
  border: 1px solid #e2e8f0;
  background: #fff;
  color: #334155;
}

@media (max-width: 800px) {
  .page {
    padding: 1rem;
  }

  .card {
    border: 0;
    background: transparent;
    padding: 0;
  }

  .actions {
    flex-direction: column;
  }

  .btn-cancel {
    border-color: transparent;
    background: transparent;
  }
}
</style>
