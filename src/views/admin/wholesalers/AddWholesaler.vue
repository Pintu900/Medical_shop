<template>
  <section class="page">
    <header class="head">
      <nav class="crumb" aria-label="Breadcrumb">
        <RouterLink to="/admin/wholesalers">Wholesalers</RouterLink>
        <svg viewBox="0 0 24 24" width="13" height="13" aria-hidden="true">
          <path d="m9 6 6 6-6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        <span>Add wholesaler</span>
      </nav>
      <h1>Add wholesaler</h1>
      <p>Save supplier details and any dues you already owe them.</p>
    </header>

    <form class="body grid" novalidate @submit.prevent="onSubmit">
      <div class="main">
        <section class="card">
          <header class="card__head">
            <span class="card__icon card__icon--teal" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="18" height="18">
                <path d="M4 20V8l8-4 8 4v12M9 20v-6h6v6M3 20h18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </span>
            <div>
              <h2>Business details</h2>
              <p>Who you buy from and how to reach them.</p>
            </div>
          </header>

          <div class="row">
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
              <span>Phone number <em>(optional)</em></span>
              <div class="phone">
                <span class="phone__code">+91</span>
                <input
                  id="wholesaler-phone"
                  :value="form.phone"
                  type="tel"
                  inputmode="numeric"
                  autocomplete="tel-national"
                  maxlength="10"
                  placeholder="10-digit mobile"
                  :aria-invalid="fieldErrors.phone ? 'true' : 'false'"
                  @input="onPhone"
                />
              </div>
              <small v-if="fieldErrors.phone" class="field__error">{{ fieldErrors.phone }}</small>
            </label>
          </div>

          <label class="field" for="wholesaler-address">
            <span>Address <em>(optional)</em></span>
            <textarea
              id="wholesaler-address"
              v-model.trim="form.address"
              rows="3"
              placeholder="Shop number, street, city"
              @input="clearStatus"
            />
          </label>
        </section>

        <section class="card">
          <header class="card__head">
            <span class="card__icon card__icon--amber" aria-hidden="true">₹</span>
            <div>
              <h2>Opening balance</h2>
              <p>Anything you owed before you started tracking here.</p>
            </div>
          </header>

          <div class="row">
            <label class="field" for="opening-due">
              <span>Opening due (₹)</span>
              <div class="money">
                <span class="money__sign" aria-hidden="true">₹</span>
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
              </div>
              <small v-if="fieldErrors.openingDue" class="field__error">{{ fieldErrors.openingDue }}</small>
              <small v-else>Amount already owed before tracking starts.</small>
            </label>

            <label class="field" for="balance-date">
              <span>Opening balance date <em>(optional)</em></span>
              <div class="date" :class="{ 'is-empty': !form.balanceDate }">
                <input id="balance-date" v-model="form.balanceDate" type="date" @input="clearStatus" />
                <span v-if="!form.balanceDate" class="date__hint">Defaults to creation date</span>
              </div>
              <small>Leave blank to use the creation date in India.</small>
            </label>
          </div>

          <div class="note">
            <span class="note__icon" aria-hidden="true">i</span>
            <p>
              <strong>Entering older bills?</strong>
              Choose a date on or before your first bill. Opening due should cover only amounts before that date.
            </p>
          </div>
        </section>

        <div class="actions">
          <p v-if="success" class="banner" role="status">{{ success }}</p>
          <p v-if="submitError" class="banner banner--error" role="alert">{{ submitError }}</p>
          <div class="actions__row">
            <button class="btn btn--ghost" type="button" @click="onCancel">Cancel</button>
            <button class="btn btn--primary" type="submit" :disabled="submitting">
              {{ submitting ? "Saving…" : "Create wholesaler" }}
            </button>
          </div>
        </div>
      </div>

      <aside class="side">
        <section class="card preview" aria-label="Preview">
          <span class="side__label">Preview</span>
          <div class="preview__who">
            <span class="avatar" :class="`avatar--${previewTone}`" aria-hidden="true">{{ previewInitials }}</span>
            <div>
              <strong>{{ form.name || "Wholesaler name" }}</strong>
              <small>{{ form.phone ? `+91 ${form.phone}` : "No phone added" }}</small>
            </div>
          </div>
          <div class="preview__due">
            <span>Opening due</span>
            <strong>{{ previewDue }}</strong>
          </div>
        </section>

        <section class="card next">
          <span class="side__label">What happens next</span>
          <ul>
            <li>
              <span class="icon icon--blue" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="17" height="17">
                  <path d="M7 3h7l5 5v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zM14 3v6h6M8 13h8M8 17h5" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </span>
              <span>
                <strong>Add purchase bills</strong>
                Record bills from this wholesaler.
              </span>
            </li>
            <li>
              <span class="icon icon--teal" aria-hidden="true">₹</span>
              <span>
                <strong>Record payments</strong>
                Add payments made to this wholesaler.
              </span>
            </li>
            <li>
              <span class="icon icon--amber" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="17" height="17">
                  <path d="M4 19V5M4 19h16M8 16l3-4 3 2 4-6" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </span>
              <span>
                <strong>Track outstanding dues</strong>
                See the current balance based on bills and payments.
              </span>
            </li>
          </ul>
        </section>
      </aside>
    </form>
  </section>
</template>

<script>
import { post } from "../../../api";
import { formatInrExact, nameInitials, nameTone } from "../../../data/wholesalers";

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
      submitError: "",
      submitting: false,
    };
  },
  computed: {
    previewInitials() {
      return this.form.name ? nameInitials(this.form.name) : "?";
    },
    previewTone() {
      return this.form.name ? nameTone(this.form.name) : "grey";
    },
    previewDue() {
      return `₹${formatInrExact(this.form.openingDue)}`;
    },
  },
  methods: {
    clearStatus() {
      this.success = "";
      this.submitError = "";
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
        openingBalanceDate: this.form.balanceDate || null,
      };
    },
    async onSubmit() {
      this.success = "";
      this.submitError = "";
      this.formatDue();
      if (!this.validate()) return;
      this.submitting = true;
      try {
        const created = await post("/wholesalers", this.payload());
        if (!created || created.id == null) {
          this.submitError = "The wholesaler was saved, but its page could not be opened.";
          return;
        }
        await this.$router.push(`/admin/wholesalers/${created.id}`);
      } catch (err) {
        this.submitError = err.message || "Could not save this wholesaler.";
      } finally {
        this.submitting = false;
      }
    },
    onCancel() {
      this.form = EMPTY_FORM();
      this.fieldErrors = {};
      this.success = "";
      this.submitError = "";
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
  margin-bottom: 0.6rem;
  color: #94a3b8;
  font-size: 0.78rem;
}

.crumb a {
  color: #0f766e;
  font-weight: 600;
  text-decoration: none;
}

.crumb span {
  color: #64748b;
}

h1 {
  margin: 0;
  font-size: 1.45rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  line-height: 1.25;
}

.head p {
  margin: 0.2rem 0 0;
  color: #64748b;
  font-size: 0.84rem;
}

.body {
  max-width: 1180px;
  padding: 1.6rem 1.6rem 2.5rem;
}

.grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 280px;
  gap: 1.25rem;
  align-items: start;
}

.main,
.side {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  min-width: 0;
}

.side {
  position: sticky;
  top: 1.25rem;
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

.date {
  position: relative;
}

.date__hint {
  position: absolute;
  top: 50%;
  left: 0.85rem;
  color: #94a3b8;
  font-weight: 400;
  pointer-events: none;
  transform: translateY(-50%);
}

.date.is-empty:not(:focus-within) input::-webkit-datetime-edit {
  color: transparent;
}

.note {
  display: flex;
  align-items: flex-start;
  gap: 0.7rem;
  padding: 0.8rem 0.9rem;
  border: 1px solid #e3ecf8;
  border-radius: 12px;
  background: #f5f9ff;
  color: #475569;
  font-size: 0.8rem;
  line-height: 1.45;
}

.note p {
  margin: 0;
}

.note strong {
  display: block;
  margin-bottom: 0.1rem;
  color: #0f172a;
}

.note__icon {
  display: inline-grid;
  place-items: center;
  width: 20px;
  height: 20px;
  flex: none;
  margin-top: 0.05rem;
  border-radius: 50%;
  background: #1d4ed8;
  color: #fff;
  font-size: 0.7rem;
  font-weight: 700;
}

.actions__row {
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

.banner {
  margin: 0 0 0.75rem;
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

.side__label {
  display: block;
  margin-bottom: 0.85rem;
  color: #64748b;
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.preview__who {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  min-width: 0;
}

.preview__who div {
  min-width: 0;
}

.preview__who strong {
  display: block;
  overflow: hidden;
  font-size: 0.95rem;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.preview__who small {
  color: #64748b;
  font-size: 0.78rem;
}

.preview__due {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 1rem;
  padding: 0.7rem 0.85rem;
  border-radius: 12px;
  background: #fffaf0;
  color: #b45309;
  font-size: 0.8rem;
}

.preview__due strong {
  font-size: 0.95rem;
}

.avatar {
  display: inline-grid;
  place-items: center;
  width: 44px;
  height: 44px;
  flex: none;
  border-radius: 12px;
  font-size: 0.9rem;
  font-weight: 700;
}

.avatar--grey {
  background: #f1f4f7;
  color: #94a3b8;
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

.next ul {
  display: flex;
  flex-direction: column;
  gap: 0.95rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.next li {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  color: #64748b;
  font-size: 0.8rem;
  line-height: 1.45;
}

.next li strong {
  display: block;
  margin-bottom: 0.05rem;
  color: #0f172a;
  font-size: 0.86rem;
}

.icon {
  display: inline-grid;
  place-items: center;
  width: 34px;
  height: 34px;
  flex: none;
  border-radius: 10px;
  font-weight: 700;
}

.icon--blue {
  background: #eaf1ff;
  color: #1d4ed8;
}

.icon--teal {
  background: #e6f6f2;
  color: #0f766e;
}

.icon--amber {
  background: #fdecc8;
  color: #b45309;
}

@media (max-width: 980px) {
  .grid {
    grid-template-columns: 1fr;
  }

  .side {
    position: static;
    order: -1;
  }

  .next {
    display: none;
  }
}

@media (max-width: 800px) {
  .head {
    padding: 1rem 1rem 0;
    background: transparent;
    border-bottom: 0;
  }

  h1 {
    font-size: 1.6rem;
    font-weight: 800;
  }

  .head p {
    margin-top: 0.3rem;
    font-size: 0.9rem;
  }

  .body {
    padding: 1rem 1rem 2rem;
  }

  .side {
    display: none;
  }

  .card {
    padding: 1rem;
  }

  .row {
    grid-template-columns: 1fr;
  }

  .actions__row {
    flex-direction: column-reverse;
  }

  .btn {
    width: 100%;
    height: 48px;
    border-radius: 12px;
  }
}
</style>
