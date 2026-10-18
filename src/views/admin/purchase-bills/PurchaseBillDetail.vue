<template>
  <section class="page">
    <p v-if="loading" class="missing">Loading purchase bill…</p>
    <p v-else-if="loadError" class="missing">{{ loadError }}</p>
    <p v-else-if="!bill" class="missing">
      This purchase bill was not found.
      <RouterLink to="/admin/purchase-bills">Back to purchase bills</RouterLink>
    </p>

    <template v-else>
      <RouterLink class="back" to="/admin/purchase-bills">← Back to purchase bills</RouterLink>
      <header class="title">
        <div>
          <h1>Purchase bill {{ bill.billNumber || "—" }}</h1>
          <p>{{ bill.wholesalerName }} · {{ formatBillDate(bill.billDate) }}</p>
        </div>
        <RouterLink class="btn-edit" :to="`/admin/purchase-bills/${bill.id}/edit`">Edit</RouterLink>
      </header>

      <div class="layout">
        <article class="card">
          <h2>Bill details</h2>
          <dl>
            <div>
              <dt>Wholesaler</dt>
              <dd>{{ bill.wholesalerName }}</dd>
            </div>
            <div>
              <dt>Bill number</dt>
              <dd>{{ bill.billNumber || "—" }}</dd>
            </div>
            <div>
              <dt>Bill date</dt>
              <dd>{{ formatBillDate(bill.billDate) }}</dd>
            </div>
            <div>
              <dt>Total amount</dt>
              <dd>{{ formatInr(bill.totalAmount) }}</dd>
            </div>
            <div>
              <dt>Initial payment</dt>
              <dd>{{ formatInr(paidAmount) }}</dd>
            </div>
            <div>
              <dt>Due added at purchase</dt>
              <dd>{{ formatInr(due) }}</dd>
            </div>
            <div>
              <dt>Payment method</dt>
              <dd>{{ paymentMethod }}</dd>
            </div>
            <div>
              <dt>Reference number</dt>
              <dd>{{ paymentReference }}</dd>
            </div>
            <div>
              <dt>Notes</dt>
              <dd>{{ bill.notes || "—" }}</dd>
            </div>
          </dl>

          <h2>Attachments</h2>
          <p v-if="!attachments.length" class="muted">No image attached.</p>
          <div v-else class="files">
            <button
              v-for="file in attachments"
              :key="file.id"
              type="button"
              :class="{ 'is-on': selected && selected.id === file.id }"
              @click="selected = file"
            >
              {{ file.name }}
            </button>
          </div>
        </article>

        <article class="card preview">
          <h2>Image preview</h2>
          <p class="muted">{{ selected ? selected.name : "No attachment selected" }}</p>
          <img v-if="selected && selected.url" :src="selected.url" :alt="selected.name" />
          <div v-else class="placeholder">
            <strong>{{ selected ? selected.name : "No image" }}</strong>
            <span>{{ selected ? "Preview is available after you upload an image." : "This bill has no attachment yet." }}</span>
          </div>
        </article>
      </div>
    </template>
  </section>
</template>

<script>
import { formatInr } from "../../../data/wholesalers";
import { fetchPurchaseBill, formatBillDate } from "../../../data/purchaseBills";

const METHOD_LABELS = {
  CASH: "Cash",
  UPI: "UPI",
  BANK_TRANSFER: "Bank transfer",
  CHEQUE: "Cheque",
};

export default {
  name: "PurchaseBillDetail",
  data() {
    return {
      bill: null,
      selected: null,
      loading: false,
      loadError: "",
    };
  },
  computed: {
    paidAmount() {
      if (!this.bill) return 0;
      if (this.bill.paidAmount !== undefined && this.bill.paidAmount !== null) return this.bill.paidAmount;
      return this.bill.initialPayment ? this.bill.initialPayment.amount || 0 : 0;
    },
    due() {
      if (!this.bill) return 0;
      return (Number(this.bill.totalAmount) || 0) - (Number(this.paidAmount) || 0);
    },
    paymentMethod() {
      const method = this.bill && this.bill.initialPayment && this.bill.initialPayment.method;
      return METHOD_LABELS[method] || method || "—";
    },
    paymentReference() {
      const reference = this.bill && this.bill.initialPayment && this.bill.initialPayment.reference;
      return reference || "—";
    },
    attachments() {
      return this.bill && Array.isArray(this.bill.attachments) ? this.bill.attachments : [];
    },
  },
  watch: {
    "$route.params.id": {
      immediate: true,
      async handler(id) {
        this.loading = true;
        this.loadError = "";
        this.bill = null;
        this.selected = null;
        try {
          const bill = await fetchPurchaseBill(id);
          this.bill = bill;
          this.selected = bill && Array.isArray(bill.attachments) && bill.attachments.length ? bill.attachments[0] : null;
        } catch (err) {
          this.loadError = err.message || "Could not load this purchase bill.";
        } finally {
          this.loading = false;
        }
      },
    },
  },
  methods: {
    formatInr,
    formatBillDate,
  },
};
</script>

<style scoped>
.page {
  max-width: 1100px;
  padding: 1.5rem 1.75rem 2.5rem;
}

.back {
  color: #0f766e;
  font-weight: 600;
  text-decoration: none;
  font-size: 0.9rem;
}

.title {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  align-items: flex-start;
  margin: 0.8rem 0 1rem;
}

h1 {
  margin: 0;
  font-size: 1.55rem;
  letter-spacing: -0.03em;
}

.title p,
.muted,
.missing {
  margin: 0.3rem 0 0;
  color: #64748b;
}

.missing a {
  color: #0f766e;
  font-weight: 600;
}

.btn-edit {
  border: 1px solid #e2e8f0;
  background: #fff;
  color: #0f172a;
  border-radius: 8px;
  padding: 0.55rem 0.8rem;
  font-weight: 600;
  text-decoration: none;
}

.layout {
  display: grid;
  grid-template-columns: 0.9fr 1.1fr;
  gap: 1rem;
  align-items: start;
}

.card {
  background: #fff;
  border: 1px solid #e6eeec;
  border-radius: 14px;
  padding: 1.1rem 1.15rem;
}

h2 {
  margin: 0 0 0.8rem;
  font-size: 1rem;
}

dl {
  margin: 0 0 1.2rem;
}

dl div {
  display: grid;
  grid-template-columns: 11rem 1fr;
  gap: 0.75rem;
  padding: 0.55rem 0;
  border-bottom: 1px solid #eef3f2;
}

dt {
  color: #64748b;
}

dd {
  margin: 0;
  font-weight: 600;
}

.files {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.files button {
  border: 1px solid #e2e8f0;
  background: #fff;
  border-radius: 8px;
  padding: 0.45rem 0.7rem;
  font: inherit;
  font-weight: 600;
  cursor: pointer;
}

.files button.is-on {
  border-color: #0f766e;
  color: #0f766e;
  background: #e7f6f3;
}

.preview img,
.placeholder {
  width: 100%;
  margin-top: 0.8rem;
  border-radius: 12px;
}

.preview img {
  display: block;
  max-height: 640px;
  object-fit: contain;
  background: #f8fafc;
}

.placeholder {
  min-height: 280px;
  border: 1px dashed #cbd5e1;
  background: #f8fafc;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: 0.4rem;
  padding: 1.5rem;
}

.placeholder span {
  color: #64748b;
  max-width: 18rem;
}

@media (max-width: 800px) {
  .page {
    max-width: none;
    padding: 1rem 1rem 2rem;
  }

  .title,
  .layout,
  dl div {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    width: 100%;
  }

  .layout {
    gap: 1rem;
  }

  .card {
    width: 100%;
    box-sizing: border-box;
  }

  .btn-edit {
    text-align: center;
    align-self: flex-start;
  }

  h1 {
    font-size: 1.35rem;
  }
}
</style>
