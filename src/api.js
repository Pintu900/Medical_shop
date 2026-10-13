const baseUrl = process.env.VUE_APP_API_BASE_URL || "http://localhost:8081/api/v1";

async function request(path, options = {}) {
  const response = await fetch(`${baseUrl}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const error = new Error((data && data.message) || "Request failed");
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

export function get(path) {
  return request(path);
}

export function post(path, body) {
  return request(path, { method: "POST", body: JSON.stringify(body) });
}
