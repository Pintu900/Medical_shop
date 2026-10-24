function defaultBaseUrl() {
  const host = typeof window !== "undefined" ? window.location.hostname : "localhost";
  return `http://${host}:8081/api/v1`;
}

const baseUrl = process.env.VUE_APP_API_BASE_URL || defaultBaseUrl();

const WRITE_METHODS = { POST: true, PUT: true, PATCH: true, DELETE: true };

let csrf = null;
let csrfPromise = null;
let unauthorizedHandler = null;

export function registerUnauthorized(handler) {
  unauthorizedHandler = handler;
}

export function clearCsrf() {
  csrf = null;
  csrfPromise = null;
}

function cookieValue(name) {
  if (typeof document === "undefined" || !document.cookie) return null;
  const parts = document.cookie.split("; ");
  for (let i = 0; i < parts.length; i += 1) {
    const part = parts[i];
    const eq = part.indexOf("=");
    if (eq === -1) continue;
    const key = decodeURIComponent(part.slice(0, eq));
    if (key === name) return decodeURIComponent(part.slice(eq + 1));
  }
  return null;
}

function cookieCsrfToken() {
  return cookieValue("XSRF-TOKEN") || cookieValue("CSRF-TOKEN");
}

function resolveCsrfHeader(tokenInfo) {
  const fromCookie = cookieCsrfToken();
  return {
    headerName: tokenInfo.headerName,
    token: fromCookie || tokenInfo.token,
  };
}

export function ensureCsrf() {
  if (csrf) return Promise.resolve(csrf);
  if (!csrfPromise) {
    const pending = get("/auth/csrf", { skipAuthRedirect: true, timeout: 10000 })
      .then((data) => {
        if (!data || !data.token || !data.headerName) {
          throw new Error("The server did not return a CSRF token.");
        }
        csrf = {
          headerName: data.headerName,
          parameterName: data.parameterName,
          token: data.token,
        };
        return csrf;
      })
      .finally(() => {
        if (csrfPromise === pending) csrfPromise = null;
      });
    csrfPromise = pending;
  }
  return csrfPromise;
}

function failureMessage(status, data) {
  if (data && data.message) return data.message;
  if (status === 403) {
    return "You do not have permission for that action, or the request could not be verified. Refresh the page and try again.";
  }
  if (status === 401) return "Your session has ended.";
  return "Request failed";
}

async function request(path, options = {}) {
  const method = (options.method || "GET").toUpperCase();
  const headers = Object.assign({}, options.headers || {});

  if (WRITE_METHODS[method] && !options.skipCsrf) {
    const tokenInfo = await ensureCsrf();
    const resolved = resolveCsrfHeader(tokenInfo);
    headers[resolved.headerName] = resolved.token;
  }

  if (!options.skipJson && options.body != null && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), options.timeout || 20000);
  let response;
  try {
    response = await fetch(`${baseUrl}${path}`, {
      method,
      credentials: "include",
      headers,
      body: options.body,
      signal: controller.signal,
    });
  } catch (err) {
    const error = new Error(err && err.name === "AbortError" ? "The server did not respond." : "Could not reach the server.");
    error.status = 0;
    throw error;
  } finally {
    clearTimeout(timer);
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    if (response.status === 401 && !options.skipAuthRedirect && unauthorizedHandler) unauthorizedHandler();
    if (response.status === 403 && WRITE_METHODS[method] && !options.skipCsrf) clearCsrf();
    const error = new Error(failureMessage(response.status, data));
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

export function get(path, options) {
  return request(path, options);
}

export function post(path, body, options) {
  return request(path, Object.assign({}, options, { method: "POST", body: JSON.stringify(body) }));
}

export function put(path, body, options) {
  return request(path, Object.assign({}, options, { method: "PUT", body: JSON.stringify(body) }));
}

export function postForm(path, params, options) {
  return request(path, Object.assign({}, options, {
    method: "POST",
    body: params,
    skipJson: true,
    headers: Object.assign({ "Content-Type": "application/x-www-form-urlencoded" }, (options && options.headers) || {}),
  }));
}

export function postEmpty(path, options) {
  return request(path, Object.assign({}, options, { method: "POST", skipJson: true }));
}
