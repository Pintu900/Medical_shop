<template>
  <section class="page">
    <p v-if="loading" class="missing">Loading wholesaler…</p>
    <p v-else-if="loadError" class="missing">{{ loadError }}</p>
    <p v-else-if="!item" class="missing">
      This wholesaler was not found.
      <RouterLink to="/admin/wholesalers">Back to wholesalers</RouterLink>
    </p>

    <form v-else class="card" novalidate @submit.prevent="onSubmit">
      <p class="crumb">
        <RouterLink :to="`/admin/wholesalers/${item.id}`">{{ item.name }}</RouterLink>
        <span aria-hidden="true"> / </span>
        Edit
      </p>
      <h1>Edit Wholesaler</h1>
      <p class="sub">{{ item.name }}</p>

      <label class="field" for="edit-name">
        <span>Name <abbr title="required">*</abbr></span>
        <input
          id="edit-name"
          v-model.trim="form.name"
          type="text"
          autocomplete="organization"
          :aria-invalid="errors.name ? 'true' : 'false'"
        />
        <small v-if="errors.name" class="field__error">{{ errors.name }}</small>
      </label>

      <label class="field" for="edit-phone">
        <span>Phone (Optional)</span>
        <div class="phone">
          <span class="phone__code">+91</span>
          <input
            id="edit-phone"
            :value="form.phone"
            type="tel"
            inputmode="numeric"
            autocomplete="tel-national"
            maxlength="10"
            :aria-invalid="errors.phone ? 'true' : 'false'"
            @input="onPhone"
          />
        </div>
        <small v-if="errors.phone" class="field__error">{{ errors.phone }}</small>
      </label>

      <label class="field" for="edit-address">
        <span>Address (Optional)</span>
        <textarea id="edit-address" v-model.trim="form.address" rows="3" placeholder="Enter complete address (optional)" />
      </label>

      <div class="balance">
        <span>Opening Balance (₹)</span>
        <strong>{{ openingLabel }}</strong>
        <small>Opening balance can only be changed separately.</small>
      </div>

      <label class="check">
        <input v-model="form.correctOpening" type="checkbox" />
        <span>Correct opening balance</span>
      </label>

      <template v-if="form.correctOpening">
        <label class="field" for="edit-opening-due">
          <span>Opening due (₹)</span>
          <input
            id="edit-opening-due"
            :value="form.openingDue"
            type="text"
            inputmode="decimal"
            placeholder="0.00"
            :aria-invalid="errors.openingDue ? 'true' : 'false'"
            @blur="formatDue"
            @input="onOpeningDue"
          />
          <small>Amount already owed before tracking starts.</small>
          <small v-if="errors.openingDue" class="field__error">{{ errors.openingDue }}</small>
        </label>

        <label class="field" for="edit-balance-date">
          <span>Opening balance date (optional)</span>
          <input id="edit-balance-date" v-model="form.balanceDate" type="date" />
          <small>Leave blank to use the creation date in India.</small>
        </label>

        <label class="field" for="edit-reason">
          <span>Correction Reason <abbr title="required">*</abbr></span>
          <textarea
            id="edit-reason"
            v-model.trim="form.reason"
            rows="3"
            placeholder="Enter reason for this correction"
            :aria-invalid="errors.reason ? 'true' : 'false'"
          />
          <small v-if="errors.reason" class="field__error">{{ errors.reason }}</small>
        </label>

        <p class="note">This will be saved in audit history.</p>
      </template>

      <p v-if="submitError" class="field__error submit-error" role="alert">{{ submitError }}</p>

      <div class="actions">
        <button class="btn-save" type="submit" :disabled="submitting">
          {{ submitting ? "Saving…" : "Save changes" }}
        </button>
        <RouterLink class="btn-cancel" :to="`/admin/wholesalers/${item.id}`">Cancel</RouterLink>
      </div>
    </form>
  </section>
</template>

<script>
import { put } from "../../api";
import { fetchWholesaler, formatInrExact } from "../../data/wholesalers";

const PHONE_INPUT = /^\d{0,10}/;
const PHONE_VALUE = /^\d{10}$/;
const OPENING_DUE_INPUT = /^\d*(?:\.\d{0,2})?/;
const OPENING_DUE_VALUE = /^\d+(?:\.\d{1,2})?$/;

export default {
  name: "EditWholesaler",
  data() {
    return {
      item: null,
      loading: false,
      loadError: "",
      submitError: "",
      submitting: false,
      form: {
        name: "",
        phone: "",
        address: "",
        openingDue: "",
        balanceDate: "",
        correctOpening: false,
        reason: "",
      },
      errors: {},
    };
  },
  computed: {
    openingLabel() {
      return this.item ? formatInrExact(this.item.openingDue) : "";
    },
  },
  watch: {
    "$route.params.id": {
      immediate: true,
      async handler(id) {
        this.loading = true;
        this.loadError = "";
        this.errors = {};
        this.item = null;
        try {
          const item = await fetchWholesaler(id);
          this.item = item;
          if (item) {
            this.form = {
              name: item.name,
              phone: item.phone,
              address: item.address,
              openingDue: Number(item.openingDue || 0).toFixed(2),
              balanceDate: item.openingBalanceDate || "",
              correctOpening: false,
              reason: "",
            };
          }
        } catch (err) {
          this.loadError = err.message || "Could not load this wholesaler.";
        } finally {
          this.loading = false;
        }
      },
    },
  },
  methods: {
    onPhone(event) {
      const cleaned = event.target.value.replace(/\D/g, "");
      const match = cleaned.match(PHONE_INPUT);
      const next = match ? match[0] : "";
      this.form.phone = next;
      event.target.value = next;
    },
    onOpeningDue(event) {
      const cleaned = event.target.value.replace(/[^\d.]/g, "");
      const match = cleaned.match(OPENING_DUE_INPUT);
      const next = match ? match[0] : "";
      this.form.openingDue = next;
      event.target.value = next;
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
      if (this.form.correctOpening) {
        this.formatDue();
        const due = String(this.form.openingDue).trim();
        if (due !== "" && !OPENING_DUE_VALUE.test(due)) {
          errors.openingDue = "Enter a number with up to 2 decimal places.";
        }
        if (!this.form.reason) errors.reason = "Enter a reason for this correction.";
      }
      this.errors = errors;
      return Object.keys(errors).length === 0;
    },
    payload() {
      const correcting = this.form.correctOpening;
      const amount = correcting
        ? Number(String(this.form.openingDue).trim() || "0")
        : Number(this.item.openingDue) || 0;
      return {
        name: this.form.name,
        phone: this.form.phone ? `+91${this.form.phone}` : "",
        address: this.form.address,
        active: this.item.status === "Active",
        openingDue: Number(amount.toFixed(2)),
        openingBalanceDate: correcting
          ? this.form.balanceDate || null
          : this.item.openingBalanceDate || null,
        correctionReason: correcting ? this.form.reason : "",
      };
    },
    async onSubmit() {
      this.submitError = "";
      if (!this.validate()) return;
      this.submitting = true;
      try {
        await put(`/wholesalers/${this.item.id}`, this.payload());
        this.$router.push({
          name: "admin-wholesaler",
          params: { id: this.item.id },
          query: { saved: "1" },
        });
      } catch (err) {
        this.submitError = err.message || "Could not save this wholesaler.";
      } finally {
        this.submitting = false;
      }
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

.crumb {
  margin: 0 0 0.8rem;
  color: #64748b;
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

.sub,
.missing {
  margin: 0.25rem 0 1rem;
  color: #64748b;
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
.field textarea {
  width: 100%;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 0.7rem 0.8rem;
  font: inherit;
  font-weight: 500;
  color: #0f172a;
}

.field input:focus,
.field textarea:focus {
  outline: 2px solid rgba(15, 118, 110, 0.25);
  border-color: #0f766e;
}

.field input[aria-invalid="true"],
.field textarea[aria-invalid="true"] {
  border-color: #dc2626;
}

.field small {
  font-weight: 400;
  color: #64748b;
  font-size: 0.78rem;
}

.field .field__error,
.submit-error {
  color: #b91c1c;
  font-weight: 500;
}

.submit-error {
  margin: 0 0 0.8rem;
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

.phone:has(input[aria-invalid="true"]) {
  border-color: #dc2626;
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

.balance {
  background: #f8fafc;
  border: 1px solid #e8eef2;
  border-radius: 10px;
  padding: 0.8rem 0.85rem;
  margin-bottom: 0.9rem;
}

.balance span,
.balance small {
  display: block;
  color: #64748b;
  font-size: 0.8rem;
}

.balance strong {
  display: block;
  margin: 0.2rem 0;
  font-size: 1rem;
}

.check {
  display: flex;
  align-items: center;
  gap: 0.55rem;
  margin-bottom: 0.9rem;
  font-weight: 600;
}

.note {
  margin: 0 0 1rem;
  color: #64748b;
  font-size: 0.82rem;
}

.actions {
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
  text-decoration: none;
  text-align: center;
}

.btn-save {
  border: 1px solid #0f766e;
  background: #0f766e;
  color: #fff;
  cursor: pointer;
}

.btn-save:disabled {
  opacity: 0.7;
  cursor: default;
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
    align-items: stretch;
  }

  .btn-cancel {
    border-color: transparent;
    background: transparent;
  }
}
</style>
