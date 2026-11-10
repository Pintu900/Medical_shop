import { get, getBlob, postMultipart } from "../api";

export const MAX_ATTACHMENT_FILES = 5;
export const MAX_ATTACHMENT_BYTES = 5 * 1024 * 1024;
export const MAX_ATTACHMENT_BATCH_BYTES = 20 * 1024 * 1024;

export function isJpegOrPng(file) {
  const type = String(file && file.type || "").toLowerCase();
  const name = String(file && file.name || "").toLowerCase();
  return type === "image/jpeg" || type === "image/png" || name.endsWith(".jpg") || name.endsWith(".jpeg") || name.endsWith(".png");
}

export function attachmentSelectionError(existingCount, files) {
  const next = Array.from(files || []);
  if (!next.length) return "";
  if (existingCount + next.length > MAX_ATTACHMENT_FILES) return "Upload at most 5 images at a time.";
  if (next.some((file) => !isJpegOrPng(file))) return "Only JPG and PNG images can be uploaded.";
  if (next.some((file) => file.size > MAX_ATTACHMENT_BYTES)) return "Each image must be 5 MB or smaller.";
  const total = next.reduce((sum, file) => sum + file.size, 0);
  if (total > MAX_ATTACHMENT_BATCH_BYTES) return "Combined image size cannot exceed 20 MB.";
  return "";
}

export async function fetchAttachments(purchaseId) {
  const data = await get(`/purchase-bills/${encodeURIComponent(purchaseId)}/attachments`);
  return Array.isArray(data) ? data : [];
}

export function uploadAttachments(purchaseId, files) {
  const form = new FormData();
  files.forEach((file) => form.append("files", file));
  return postMultipart(`/purchase-bills/${encodeURIComponent(purchaseId)}/attachments`, form, { timeout: 120000 });
}

export function fetchAttachmentContent(purchaseId, attachmentId) {
  return getBlob(
    `/purchase-bills/${encodeURIComponent(purchaseId)}/attachments/${encodeURIComponent(attachmentId)}/content`,
    { timeout: 60000 },
  );
}
