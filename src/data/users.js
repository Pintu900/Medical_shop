import { get, patch, post, put } from "../api";

export const USER_ROLES = [
  { value: "OWNER", label: "Owner" },
  { value: "STAFF", label: "Staff" },
  { value: "VIEWER", label: "Viewer" },
];

export function roleLabel(value) {
  const found = USER_ROLES.find((role) => role.value === value);
  return found ? found.label : value || "—";
}

export async function fetchUsers(page, size) {
  const data = await get(`/users?page=${encodeURIComponent(page)}&size=${encodeURIComponent(size)}`);
  const body = data && typeof data === "object" ? data : {};
  return {
    items: Array.isArray(body.items) ? body.items : [],
    page: Number(body.page) || 0,
    size: Number(body.size) || size,
    totalElements: Number(body.totalElements) || 0,
    totalPages: Number(body.totalPages) || 0,
  };
}

export function createUser(input) {
  return post("/users", {
    name: input.name,
    email: input.email,
    password: input.password,
    role: input.role,
  });
}

export function updateUser(id, input) {
  const body = {
    name: input.name,
    role: input.role,
    reason: input.reason,
  };
  if (input.password) body.password = input.password;
  return put(`/users/${encodeURIComponent(id)}`, body);
}

export function updateUserStatus(id, active, reason) {
  return patch(`/users/${encodeURIComponent(id)}/status`, { active, reason });
}
