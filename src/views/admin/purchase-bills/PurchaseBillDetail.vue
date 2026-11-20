<template>
  <section class="page">
    <p v-if="loading" class="state">Loading purchase bill…</p>
    <p v-else-if="loadError" class="state state--error">{{ loadError }}</p>
    <p v-else-if="!bill" class="state">
      This purchase bill was not found.
      <RouterLink to="/admin/purchase-bills">Back to purchase bills</RouterLink>
    </p>

    <template v-else>
      <RouterLink class="back" to="/admin/purchase-bills">
        <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M19 12H5M11 18l-6-6 6-6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" /></svg>
        Purchase bills
      </RouterLink>

      <header class="title">
        <div>
          <div class="eyebrow">Purchase invoice</div>
          <h1>{{ bill.billNumber || "Purchase bill" }}</h1>
          <p>{{ bill.wholesalerName }} <span aria-hidden="true">·</span> {{ formatBillDate(bill.billDate) }}</p>
        </div>
        <div class="title__actions">
          <span class="status" :class="due > 0 ? 'status--due' : 'status--settled'">
            <span class="status__dot" aria-hidden="true"></span>
            {{ due > 0 ? "Payment due" : "Settled" }}
          </span>
          <RouterLink class="btn-edit" :to="`/admin/purchase-bills/${bill.id}/edit`">Edit bill</RouterLink>
        </div>
      </header>

      <div class="stats">
        <article class="stat">
          <span class="stat__label">Total amount</span>
          <strong>{{ formatInr(bill.totalAmount) }}</strong>
          <span class="stat__sub">Invoice value</span>
        </article>
        <article class="stat stat--paid">
          <span class="stat__label">Paid</span>
          <strong>{{ formatInr(paidAmount) }}</strong>
          <span class="stat__sub">Initial payment</span>
        </article>
        <article class="stat stat--due" :class="{ 'stat--clear': due <= 0 }">
          <span class="stat__label">Outstanding due</span>
          <strong>{{ formatInr(due) }}</strong>
          <span class="stat__sub">{{ due > 0 ? "To be settled" : "Fully settled" }}</span>
        </article>
        <article class="stat stat--attachment">
          <span class="stat__label">Attachment</span>
          <strong>{{ attachments.length }}</strong>
          <span class="stat__sub">{{ attachments.length === 1 ? "Image uploaded" : "Images uploaded" }}</span>
        </article>
      </div>

      <div class="layout">
        <article class="card details">
          <header class="card__head">
            <div>
              <h2>Bill details</h2>
              <p>Invoice and payment information</p>
            </div>
            <span class="card__icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="19" height="19"><path d="M7 3h7l5 5v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zM14 3v6h6M8 13h8M8 17h5" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" /></svg>
            </span>
          </header>
          <dl>
            <div><dt>Wholesaler</dt><dd>{{ bill.wholesalerName }}</dd></div>
            <div><dt>Bill number</dt><dd>{{ bill.billNumber || "—" }}</dd></div>
            <div><dt>Bill date</dt><dd>{{ formatBillDate(bill.billDate) }}</dd></div>
            <div><dt>Payment method</dt><dd>{{ paymentMethod }}</dd></div>
            <div><dt>Reference number</dt><dd>{{ paymentReference }}</dd></div>
            <div><dt>Notes</dt><dd>{{ bill.notes || "—" }}</dd></div>
          </dl>

          <div class="section-divider"></div>
          <div class="subheading">
            <div><h3>Attachments</h3><p>Upload the supplier invoice for your records</p></div>
            <span class="count">{{ attachments.length }}</span>
          </div>
          <p v-if="uploadWarning" class="warn" role="alert">The bill was saved, but the images were not uploaded. Add them below.</p>
          <p v-if="attachmentError" class="warn" role="alert">{{ attachmentError }}</p>
          <p v-if="attachmentsLoading" class="muted">Loading attachments…</p>
          <p v-else-if="!attachments.length" class="muted">No image attached yet.</p>
          <div v-else class="files">
            <button v-for="file in attachments" :key="file.id" type="button" :class="{ 'is-on': selected && selected.id === file.id }" @click="selectAttachment(file)">
              <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true"><path d="M5 4h10l4 4v12H5zM15 4v5h4M8 14h8M8 17h5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" /></svg>
              {{ file.originalFilename }}
            </button>
          </div>
          <label v-if="canUpload" class="upload">
            <span><strong>Add images</strong> <small>JPG or PNG, up to the allowed limit</small></span>
            <input type="file" accept="image/jpeg,image/png" multiple :disabled="uploading" @change="onFiles" />
          </label>
        </article>

        <article class="card preview">
          <header class="card__head">
            <div><h2>Invoice preview</h2><p>{{ selected ? selected.originalFilename : "Select an attachment to preview" }}</p></div>
            <span class="preview__badge">{{ selected ? "Preview" : "Empty" }}</span>
          </header>
          <p v-if="previewLoading" class="muted preview__loading">Loading image…</p>
          <img v-else-if="previewUrl" :src="previewUrl" :alt="selected ? selected.originalFilename : 'Attachment'" />
          <div v-else class="placeholder">
            <span class="placeholder__icon" aria-hidden="true"><svg viewBox="0 0 24 24" width="26" height="26"><path d="M4 5h16v14H4zM7 15l3-3 2.2 2.2 1.8-1.7 3 2.5M8 9.5h.01" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" /></svg></span>
            <strong>{{ selected ? selected.originalFilename : "No image selected" }}</strong>
            <span>{{ previewError || (selected ? "The image could not be shown." : "This bill has no attachment yet.") }}</span>
          </div>
        </article>
      </div>
    </template>
  </section>
</template>

<script>
import { session } from "../../../auth";
import { attachmentSelectionError, fetchAttachmentContent, fetchAttachments, uploadAttachments } from "../../../data/attachments";
import { formatInr } from "../../../data/wholesalers";
import { fetchPurchaseBill, formatBillDate } from "../../../data/purchaseBills";

const METHOD_LABELS = { CASH: "Cash", UPI: "UPI", BANK_TRANSFER: "Bank transfer", CHEQUE: "Cheque" };

export default {
  name: "PurchaseBillDetail",
  data() { return { bill: null, attachments: [], selected: null, previewUrl: "", previewLoading: false, previewError: "", attachmentsLoading: false, attachmentError: "", uploading: false, uploadWarning: false, loading: false, loadError: "" }; },
  computed: {
    paidAmount() { if (!this.bill) return 0; if (this.bill.paidAmount !== undefined && this.bill.paidAmount !== null) return this.bill.paidAmount; return this.bill.initialPayment ? this.bill.initialPayment.amount || 0 : 0; },
    due() { return this.bill ? (Number(this.bill.totalAmount) || 0) - (Number(this.paidAmount) || 0) : 0; },
    paymentMethod() { const method = this.bill && this.bill.initialPayment && this.bill.initialPayment.method; return METHOD_LABELS[method] || method || "—"; },
    paymentReference() { const reference = this.bill && this.bill.initialPayment && this.bill.initialPayment.reference; return reference || "—"; },
    canUpload() { return (session.user && session.user.role) !== "VIEWER"; },
  },
  watch: {
    "$route.params.id": { immediate: true, async handler(id) { this.loading = true; this.loadError = ""; this.revokePreview(); this.bill = null; this.attachments = []; this.selected = null; this.uploadWarning = this.$route.query.uploadError === "1"; try { this.bill = await fetchPurchaseBill(id); if (this.bill) await this.loadAttachments(id); } catch (err) { this.loadError = err.message || "Could not load this purchase bill."; } finally { this.loading = false; } } },
  },
  beforeUnmount() { this.revokePreview(); },
  methods: {
    formatInr, formatBillDate,
    revokePreview() { if (this.previewUrl) URL.revokeObjectURL(this.previewUrl); this.previewUrl = ""; },
    async loadAttachments(purchaseId) { this.attachmentsLoading = true; this.attachmentError = ""; try { this.attachments = await fetchAttachments(purchaseId); if (this.attachments.length) await this.selectAttachment(this.attachments[0]); else this.selected = null; } catch (err) { this.attachments = []; this.attachmentError = err.message || "Could not load attachments."; } finally { this.attachmentsLoading = false; } },
    async selectAttachment(file) { this.selected = file; this.revokePreview(); this.previewError = ""; this.previewLoading = true; try { const blob = await fetchAttachmentContent(this.bill.id, file.id); this.previewUrl = URL.createObjectURL(blob); } catch (err) { this.previewError = err.message || "Could not load this image."; } finally { this.previewLoading = false; } },
    async onFiles(event) { const selected = Array.from(event.target.files || []); const message = attachmentSelectionError(0, selected); event.target.value = ""; if (message) { this.attachmentError = message; return; } this.uploading = true; this.attachmentError = ""; try { await uploadAttachments(this.bill.id, selected); this.uploadWarning = false; await this.loadAttachments(this.bill.id); } catch (err) { this.attachmentError = err.message || "Could not upload these images."; } finally { this.uploading = false; } },
  },
};
</script>

<style scoped>
.page { min-height: 100vh; padding: 1.5rem 1.6rem 2.5rem; background: #f6f8fa; color: #0f172a; }
.page > * { max-width: 1160px; margin-left: auto; margin-right: auto; }
.back { display: inline-flex; align-items: center; gap: 0.35rem; color: #0f766e; font-size: 0.84rem; font-weight: 600; text-decoration: none; }
.back:hover { color: #0c645d; }
.title { display: flex; align-items: flex-start; justify-content: space-between; gap: 1rem; margin-top: 1rem; }
.eyebrow { margin-bottom: 0.25rem; color: #64748b; font-size: 0.68rem; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; }
h1 { margin: 0; font-size: 1.65rem; letter-spacing: -0.03em; }
.title p { display: flex; gap: 0.45rem; margin: 0.3rem 0 0; color: #64748b; font-size: 0.86rem; }
.title__actions { display: flex; align-items: center; gap: 0.6rem; }
.status { display: inline-flex; align-items: center; gap: 0.4rem; padding: 0.32rem 0.65rem; border-radius: 999px; font-size: 0.76rem; font-weight: 600; }
.status__dot { width: 6px; height: 6px; border-radius: 50%; background: currentColor; }
.status--due { background: #fff6e2; color: #b45309; } .status--settled { background: #ecf8f3; color: #0f766e; }
.btn-edit { display: inline-flex; align-items: center; height: 36px; padding: 0 0.85rem; border: 1px solid #dfe5eb; border-radius: 9px; background: #fff; color: #334155; font-size: 0.8rem; font-weight: 600; text-decoration: none; }
.btn-edit:hover { border-color: #b7dcd5; color: #0f766e; }
.stats { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 0.85rem; margin-top: 1.25rem; }
.stat { padding: 0.95rem 1rem; border: 1px solid #e8edf1; border-radius: 14px; background: #fff; }
.stat__label { display: block; color: #64748b; font-size: 0.68rem; font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase; }
.stat strong { display: block; margin-top: 0.45rem; color: #0f172a; font-size: 1.2rem; letter-spacing: -0.03em; }
.stat__sub { display: block; margin-top: 0.22rem; color: #94a3b8; font-size: 0.76rem; }
.stat--paid strong { color: #1d4ed8; } .stat--due { border-color: #f6dfae; background: #fffaf0; } .stat--due strong, .stat--due .stat__label, .stat--due .stat__sub { color: #b45309; } .stat--clear { border-color: #e8edf1; background: #fff; } .stat--clear strong, .stat--clear .stat__sub { color: #0f766e; } .stat--attachment strong { color: #0f766e; }
.layout { display: grid; grid-template-columns: minmax(0, 0.95fr) minmax(0, 1.05fr); gap: 1rem; margin-top: 1rem; align-items: start; }
.card { border: 1px solid #e8edf1; border-radius: 16px; background: #fff; padding: 1.15rem 1.2rem; }
.card__head { display: flex; align-items: flex-start; justify-content: space-between; gap: 1rem; }
h2 { margin: 0; font-size: 1rem; letter-spacing: -0.01em; } .card__head p, .subheading p { margin: 0.22rem 0 0; color: #94a3b8; font-size: 0.76rem; }
.card__icon { display: inline-grid; place-items: center; width: 34px; height: 34px; border-radius: 10px; background: #e6f6f2; color: #0f766e; }
dl { margin: 1rem 0 0; } dl div { display: grid; grid-template-columns: 9rem 1fr; gap: 0.75rem; padding: 0.72rem 0; border-bottom: 1px solid #eef1f4; } dt { color: #64748b; font-size: 0.8rem; } dd { margin: 0; color: #0f172a; font-size: 0.84rem; font-weight: 600; overflow-wrap: anywhere; }
.section-divider { height: 1px; margin: 1.15rem 0; background: #eef1f4; } .subheading { display: flex; align-items: flex-start; justify-content: space-between; gap: 1rem; } h3 { margin: 0; font-size: 0.9rem; } .count { display: inline-grid; min-width: 24px; height: 24px; place-items: center; padding: 0 0.35rem; border-radius: 999px; background: #f1f4f7; color: #475569; font-size: 0.72rem; font-weight: 700; }
.muted { color: #64748b; font-size: 0.82rem; } .warn { margin: 0.65rem 0 0; color: #b42318; font-size: 0.8rem; }
.files { display: flex; flex-wrap: wrap; gap: 0.45rem; margin-top: 0.8rem; } .files button { display: inline-flex; align-items: center; gap: 0.35rem; max-width: 100%; border: 1px solid #dfe5eb; border-radius: 8px; background: #fff; color: #334155; padding: 0.45rem 0.6rem; font: inherit; font-size: 0.76rem; font-weight: 600; cursor: pointer; } .files button.is-on { border-color: #0f766e; background: #e7f6f3; color: #0f766e; }
.upload { display: flex; align-items: center; justify-content: space-between; gap: 0.7rem; margin-top: 0.9rem; padding: 0.7rem 0.75rem; border: 1px dashed #b7dcd5; border-radius: 10px; background: #f7fcfb; color: #0f766e; font-size: 0.8rem; cursor: pointer; } .upload strong { display: block; } .upload small { display: block; margin-top: 0.15rem; color: #64748b; font-size: 0.7rem; font-weight: 400; } .upload input { max-width: 10rem; font: inherit; font-size: 0.72rem; }
.preview__badge { padding: 0.25rem 0.55rem; border-radius: 999px; background: #f1f4f7; color: #64748b; font-size: 0.7rem; font-weight: 600; } .preview img, .placeholder { width: 100%; margin-top: 1rem; border-radius: 12px; } .preview img { display: block; max-height: 620px; object-fit: contain; background: #f8fafc; } .preview__loading { margin-top: 1rem; }
.placeholder { min-height: 320px; border: 1px dashed #cbd5e1; background: #f8fafc; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 0.45rem; padding: 1.5rem; text-align: center; } .placeholder__icon { display: inline-grid; place-items: center; width: 52px; height: 52px; margin-bottom: 0.25rem; border-radius: 14px; background: #e7f6f3; color: #0f766e; } .placeholder strong { font-size: 0.86rem; overflow-wrap: anywhere; } .placeholder > span:last-child { max-width: 18rem; color: #64748b; font-size: 0.78rem; }
.state { max-width: 1160px; margin-top: 1.5rem; color: #64748b; } .state a { color: #0f766e; font-weight: 600; } .state--error { color: #b91c1c; font-weight: 600; }
@media (max-width: 900px) { .stats { grid-template-columns: repeat(2, minmax(0, 1fr)); } .layout { grid-template-columns: 1fr; } }
@media (max-width: 600px) { .page { padding: 1rem 1rem 2rem; } .title { flex-direction: column; } .title__actions { width: 100%; justify-content: space-between; } h1 { font-size: 1.45rem; } .stats { gap: 0.65rem; } .stat { padding: 0.85rem; } .stat strong { font-size: 1.05rem; } .card { padding: 1rem; } dl div { grid-template-columns: 7.5rem 1fr; } .upload { align-items: flex-start; flex-direction: column; } .upload input { max-width: none; width: 100%; } }
</style>
