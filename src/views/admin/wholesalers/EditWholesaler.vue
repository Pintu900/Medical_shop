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
          <RouterLink class="crumb__name" :to="`/admin/wholesalers/${item.id}`">{{ item.name }}</RouterLink>
          <svg viewBox="0 0 24 24" width="13" height="13" aria-hidden="true">
            <path d="m9 6 6 6-6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          <span>Edit</span>
        </nav>
        <div class="head__who">
          <span class="avatar" :class="`avatar--${tone}`" aria-hidden="true">{{ initials }}</span>
          <div>
            <h1>Edit wholesaler</h1>
            <p>{{ item.name }}</p>
          </div>
        </div>
      </header>

      <form class="body form" novalidate @submit.prevent="onSubmit">
        <section class="card">
          <header class="card__head">
            <span class="card__icon card__icon--teal" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="18" height="18">
                <path d="M4 20V8l8-4 8 4v12M9 20v-6h6v6M3 20h18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </span>
            <div>
              <h2>Business details</h2>
              <p>Name and contact details shown across the app.</p>
            </div>
          </header>

          <div class="row">
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
              <span>Phone <em>(optional)</em></span>
              <div class="phone">
                <span class="phone__code">+91</span>
                <input
                  id="edit-phone"
                  :value="form.phone"
                  type="tel"
                  inputmode="numeric"
                  autocomplete="tel-national"
                  maxlength="10"
                  placeholder="10-digit mobile"
                  :aria-invalid="errors.phone ? 'true' : 'false'"
                  @input="onPhone"
                />
              </div>
              <small v-if="errors.phone" class="field__error">{{ errors.phone }}</small>
            </label>
          </div>

          <label class="field" for="edit-address">
            <span>Address <em>(optional)</em></span>
            <textarea id="edit-address" v-model.trim="form.address" rows="3" placeholder="Shop number, street, city" />
          </label>
        </section>

        <section class="card">
          <header class="card__head">
            <span class="card__icon card__icon--amber" aria-hidden="true">₹</span>
            <div>
              <h2>Opening balance</h2>
              <p>Changes here are recorded in the audit history.</p>
            </div>
          </header>

          <div class="balance">
            <div>
              <span>Current opening balance</span>
              <strong>₹{{ openingLabel }}</strong>
            </div>
            <label class="switch">
              <input v-model="form.correctOpening" type="checkbox" />
              <span class="switch__track" aria-hidden="true"></span>
              <span>Correct opening balance</span>
            </label>
          </div>

          <div v-if="form.correctOpening" class="correction">
            <div class="row">
              <label class="field" for="edit-opening-due">
                <span>Opening due (₹)</span>
                <div class="money">
                  <span class="money__sign" aria-hidden="true">₹</span>
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
                </div>
                <small v-if="errors.openingDue" class="field__error">{{ errors.openingDue }}</small>
                <small v-else>Amount already owed before tracking starts.</small>
              </label>

              <label class="field" for="edit-balance-date">
                <span>Opening balance date <em>(optional)</em></span>
                <input id="edit-balance-date" v-model="form.balanceDate" type="date" />
                <small>Leave blank to use the creation date in India.</small>
              </label>
            </div>

            <label class="field" for="edit-reason">
              <span>Correction reason <abbr title="required">*</abbr></span>
              <textarea
                id="edit-reason"
                v-model.trim="form.reason"
                rows="3"
                placeholder="Why is the opening balance changing?"
                :aria-invalid="errors.reason ? 'true' : 'false'"
              />
              <small v-if="errors.reason" class="field__error">{{ errors.reason }}</small>
            </label>

            <p class="note">
              <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true">
                <path d="M12 3 4.5 6v5.5c0 4.4 3.1 8.2 7.5 9.5 4.4-1.3 7.5-5.1 7.5-9.5V6z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" />
              </svg>
              This will be saved in audit history.
            </p>
          </div>
        </section>

        <p v-if="submitError" class="banner banner--error" role="alert">{{ submitError }}</p>

        <div class="actions">
          <RouterLink class="btn btn--ghost" :to="`/admin/wholesalers/${item.id}`">Cancel</RouterLink>
          <button class="btn btn--primary" type="submit" :disabled="submitting">
            {{ submitting ? "Saving…" : "Save changes" }}
          </button>
        </div>
      </form>
    </template>
  </section>
</template>

<script>
import { put } from "../../../api";
import { fetchWholesaler, formatInrExact, nameInitials, nameTone } from "../../../data/wholesalers";

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
    initials() {
      return this.item ? nameInitials(this.item.name) : "";
    },
    tone() {
      return this.item ? nameTone(this.item.name) : "teal";
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
  min-height: 100vh;
  background: #f6f8fa;
  color: #0f172a;
}

.head {
  padding: 0.9rem 1.6rem 1.1rem;
  background: #fff;
  border-bottom: 1px solid #eef1f4;
}

.crumb {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  min-width: 0;
  margin-bottom: 0.75rem;
  color: #94a3b8;
  font-size: 0.78rem;
}

.crumb a {
  color: #0f766e;
  font-weight: 600;
  text-decoration: none;
}

.crumb__name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.crumb span {
  color: #64748b;
}

.head__who {
  display: flex;
  align-items: center;
  gap: 0.85rem;
}

h1 {
  margin: 0;
  font-size: 1.45rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  line-height: 1.25;
}

.head__who p {
  margin: 0.15rem 0 0;
  color: #64748b;
  font-size: 0.84rem;
}

.avatar {
  display: inline-grid;
  place-items: center;
  width: 48px;
  height: 48px;
  flex: none;
  border-radius: 13px;
  font-size: 0.95rem;
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

.body {
  max-width: 820px;
  padding: 1.6rem 1.6rem 2.5rem;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
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

.card {
  padding: 1.2rem 1.25rem 1.3rem;
  border: 1px solid #e8edf1;
  border-radius: 16px;
  background: #fff;
}

.card__head {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.15rem;
  padding-bottom: 0.95rem;
  border-bottom: 1px solid #eef1f4;
}

.card__head h2 {
  margin: 0;
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: -0.01em;
}

.card__head p {
  margin: 0.1rem 0 0;
  color: #64748b;
  font-size: 0.8rem;
}

.card__icon {
  display: inline-grid;
  place-items: center;
  width: 38px;
  height: 38px;
  flex: none;
  border-radius: 11px;
  font-weight: 700;
}

.card__icon--teal {
  background: #e6f6f2;
  color: #0f766e;
}

.card__icon--amber {
  background: #fdecc8;
  color: #b45309;
}

.row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
  gap: 0 1rem;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  margin-bottom: 1rem;
  color: #334155;
  font-size: 0.84rem;
  font-weight: 600;
}

.field em {
  color: #94a3b8;
  font-style: normal;
  font-weight: 500;
}

.field abbr {
  color: #dc2626;
  text-decoration: none;
}

.field input,
.field textarea {
  width: 100%;
  min-height: 44px;
  padding: 0 0.85rem;
  border: 1px solid #dfe5eb;
  border-radius: 10px;
  background: #fff;
  color: #0f172a;
  font: inherit;
  font-size: 0.9rem;
  font-weight: 400;
}

.field textarea {
  min-height: 5.5rem;
  padding: 0.7rem 0.85rem;
  resize: vertical;
}

.field input::placeholder,
.field textarea::placeholder {
  color: #94a3b8;
}

.field input:focus,
.field textarea:focus {
  outline: none;
  border-color: #0f766e;
  box-shadow: 0 0 0 3px rgba(15, 118, 110, 0.12);
}

.field input[aria-invalid="true"],
.field textarea[aria-invalid="true"],
.phone:has(input[aria-invalid="true"]),
.money:has(input[aria-invalid="true"]) {
  border-color: #dc2626;
}

.field small {
  color: #64748b;
  font-size: 0.76rem;
  font-weight: 400;
}

.field .field__error {
  color: #b91c1c;
  font-weight: 500;
}

.phone,
.money {
  display: flex;
  align-items: center;
  min-height: 44px;
  border: 1px solid #dfe5eb;
  border-radius: 10px;
  background: #fff;
}

.phone:focus-within,
.money:focus-within {
  border-color: #0f766e;
  box-shadow: 0 0 0 3px rgba(15, 118, 110, 0.12);
}

.phone__code,
.money__sign {
  align-self: stretch;
  display: inline-flex;
  align-items: center;
  padding: 0 0.75rem;
  border-right: 1px solid #eef1f4;
  border-radius: 10px 0 0 10px;
  background: #f8fafb;
  color: #64748b;
  font-weight: 600;
}

.field .phone input,
.field .money input,
.field .phone input:focus,
.field .money input:focus {
  min-height: 42px;
  border: 0;
  box-shadow: none;
}

.balance {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.9rem 1rem;
  border: 1px solid #eef1f4;
  border-radius: 12px;
  background: #f8fafb;
}

.balance > div > span {
  display: block;
  color: #64748b;
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.balance > div > strong {
  display: block;
  margin-top: 0.2rem;
  font-size: 1.25rem;
  font-weight: 700;
  letter-spacing: -0.02em;
}

.switch {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  flex: none;
  color: #334155;
  font-size: 0.84rem;
  font-weight: 600;
  cursor: pointer;
}

.switch input {
  position: absolute;
  width: 1px;
  height: 1px;
  opacity: 0;
}

.switch__track {
  position: relative;
  width: 38px;
  height: 22px;
  flex: none;
  border-radius: 999px;
  background: #cbd5e1;
  transition: background 0.15s ease;
}

.switch__track::after {
  content: "";
  position: absolute;
  top: 3px;
  left: 3px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.2);
  transition: transform 0.15s ease;
}

.switch input:checked + .switch__track {
  background: #0f766e;
}

.switch input:checked + .switch__track::after {
  transform: translateX(16px);
}

.switch input:focus-visible + .switch__track {
  box-shadow: 0 0 0 3px rgba(15, 118, 110, 0.2);
}

.correction {
  margin-top: 1rem;
  padding: 1rem 1rem 0.9rem;
  border: 1px solid #f6dfae;
  border-radius: 12px;
  background: #fffcf5;
}

.note {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  margin: 0;
  color: #b45309;
  font-size: 0.8rem;
  font-weight: 600;
}

.banner {
  margin: 0;
  padding: 0.7rem 0.9rem;
  border-radius: 12px;
  font-size: 0.86rem;
  font-weight: 600;
}

.banner--error {
  border: 1px solid #fecaca;
  background: #fef2f2;
  color: #b91c1c;
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.6rem;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 44px;
  padding: 0 1.2rem;
  border-radius: 10px;
  font: inherit;
  font-size: 0.88rem;
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
}

.btn--ghost {
  border: 1px solid #dfe5eb;
  background: #fff;
  color: #334155;
}

.btn--ghost:hover {
  border-color: #cbd5e1;
}

.btn--primary {
  border: 1px solid #0f766e;
  background: #0f766e;
  color: #fff;
  box-shadow: 0 6px 16px rgba(15, 118, 110, 0.18);
}

.btn--primary:hover {
  background: #0c645d;
}

.btn--primary:disabled {
  opacity: 0.7;
  cursor: default;
}

@media (max-width: 800px) {
  .head {
    padding: 1rem 1rem 0;
    background: transparent;
    border-bottom: 0;
  }

  h1 {
    font-size: 1.45rem;
    font-weight: 800;
  }

  .body {
    padding: 1rem 1rem 2rem;
  }

  .card {
    padding: 1rem;
  }

  .row {
    grid-template-columns: 1fr;
  }

  .balance {
    flex-direction: column;
    align-items: flex-start;
  }

  .correction {
    padding: 0.9rem 0.85rem 0.8rem;
  }

  .actions {
    flex-direction: column-reverse;
  }

  .btn {
    width: 100%;
    height: 48px;
    border-radius: 12px;
  }
}
</style>
