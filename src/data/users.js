const users = [
  { id: 1, name: "Pintu Sah", email: "pintu@example.com", role: "OWNER", active: true },
  { id: 2, name: "Rahul Kumar", email: "rahul@example.com", role: "STAFF", active: true },
  { id: 3, name: "Neha Singh", email: "neha@example.com", role: "VIEWER", active: false },
];

let nextId = 4;

export const USER_ROLES = [
  { value: "OWNER", label: "Owner" },
  { value: "STAFF", label: "Staff" },
  { value: "VIEWER", label: "Viewer" },
];

export function roleLabel(value) {
  const found = USER_ROLES.find((role) => role.value === value);
  return found ? found.label : value || "—";
}

export function listUsers() {
  return users.map((user) => ({ ...user }));
}

export function createUser(input) {
  const user = {
    id: nextId,
    name: input.name,
    email: input.email,
    role: input.role,
    active: true,
  };
  nextId += 1;
  users.push(user);
  return { ...user };
}

export function updateUser(id, input) {
  const user = users.find((item) => item.id === id);
  if (!user) return null;
  user.name = input.name;
  user.role = input.role;
  if (typeof input.active === "boolean") user.active = input.active;
  return { ...user };
}
