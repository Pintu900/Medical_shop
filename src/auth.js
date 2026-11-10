import { reactive } from "vue";
import { clearCsrf, ensureCsrf, get, postEmpty, postForm } from "./api";

export const SESSION_ENDPOINT_MISSING =
  "GET /api/v1/auth/me is not available. The backend needs to return the signed-in user, or 401 when there is no session.";

export const session = reactive({
  ready: false,
  status: "unknown",
  user: null,
  error: "",
  profileMissing: false,
  loggingOut: false,
});

let initPromise = null;

export function safeInternalPath(value) {
  const path = String(value || "");
  const route = path.split("?")[0];
  if (!path.startsWith("/") || path.startsWith("//") || path.includes("://") || path.includes("\\")) return "/admin/overview";
  if (route === "/login") return "/admin/overview";
  return path;
}

function sanitizeUser(user) {
  if (!user || typeof user !== "object" || Array.isArray(user)) return null;
  const copy = Object.assign({}, user);
  delete copy.passwordHash;
  delete copy.password;
  return copy;
}

async function readSession() {
  try {
    const user = await get("/auth/me", { skipAuthRedirect: true, timeout: 10000 });
    session.user = sanitizeUser(user);
    session.status = "authenticated";
    session.profileMissing = false;
    session.error = "";
    return "authenticated";
  } catch (err) {
    if (err.status === 401) {
      session.user = null;
      session.status = "anonymous";
      session.profileMissing = false;
      session.error = "";
      return "anonymous";
    }
    if (err.status === 404) {
      session.user = null;
      session.error = SESSION_ENDPOINT_MISSING;
      return "missing";
    }
    session.user = null;
    session.error = err.message || "Could not check your session. The server did not respond.";
    return "error";
  }
}

async function runInit() {
  try {
    const [, result] = await Promise.all([
      ensureCsrf().catch(() => {}),
      readSession(),
    ]);
    if (result === "missing" || result === "error") session.status = "unavailable";
  } catch (err) {
    session.user = null;
    session.status = "unavailable";
    session.error = err.message || "Could not check your session.";
  } finally {
    session.ready = true;
  }
}

export function initAuth() {
  if (session.ready) return Promise.resolve();
  if (!initPromise) initPromise = runInit().finally(() => { initPromise = null; });
  return initPromise;
}

export function retrySession() {
  session.ready = false;
  session.status = "unknown";
  session.error = "";
  return initAuth();
}

export function markSignedOut() {
  session.user = null;
  session.status = "anonymous";
  session.profileMissing = false;
  session.ready = true;
  clearCsrf();
}

export async function login(email, password) {
  await ensureCsrf();
  const form = new URLSearchParams();
  form.set("email", email);
  form.set("password", password);
  await postForm("/auth/login", form, { skipAuthRedirect: true });
  clearCsrf();
  await ensureCsrf();
  const result = await readSession();
  if (result === "authenticated") return session.user;
  if (result === "missing") {
    session.status = "authenticated";
    session.user = null;
    session.profileMissing = true;
    session.ready = true;
    return null;
  }
  if (result === "anonymous") {
    throw new Error("Signed in, but the browser did not keep the session cookie.");
  }
  throw new Error(session.error || "Could not load your account after signing in.");
}

export async function logout() {
  session.loggingOut = true;
  try {
    try {
      await postEmpty("/auth/logout");
    } catch (err) {
      if (!err || err.status !== 401) throw err;
    }
    session.user = null;
    session.status = "anonymous";
    session.profileMissing = false;
    session.error = "";
    clearCsrf();
    await ensureCsrf().catch(() => {});
  } finally {
    session.loggingOut = false;
  }
}
