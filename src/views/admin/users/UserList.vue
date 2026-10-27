<template>
  <section class="page" :class="{ 'has-drawer': editorOpen }">
    <div v-show="!editorOpen || !narrow" class="list">
      <header class="head">
        <div>
          <p class="crumb">Admin / Users</p>
          <h1>
            Users
            <span class="badge">Owner only</span>
          </h1>
          <p>Manage your team's access.</p>
        </div>
        <button class="btn-add" type="button" @click="openCreate">+ Add user</button>
      </header>

      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th scope="col">Name</th>
              <th scope="col">Email</th>
              <th scope="col">Role</th>
              <th scope="col">Status</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="!users.length">
              <td colspan="5" class="empty">No users yet.</td>
            </tr>
            <template v-else>
              <tr v-for="user in users" :key="user.id" :class="{ 'is-selected': editor && editor.id === user.id }">
                <td class="name">{{ user.name }}</td>
                <td>{{ user.email }}</td>
                <td><span class="role" :class="`role--${user.role}`">{{ roleLabel(user.role) }}</span></td>
                <td>
                  <span class="status" :class="{ 'is-off': !user.active }">{{ user.active ? "Active" : "Inactive" }}</span>
                </td>
                <td>
                  <button class="btn-edit" type="button" @click="openEdit(user)">Edit</button>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>

      <ul class="cards">
        <li v-if="!users.length" class="card empty">No users yet.</li>
        <template v-else>
          <li v-for="user in users" :key="user.id" class="card">
            <div class="card__top">
              <strong>{{ user.name }}</strong>
              <button class="btn-edit" type="button" @click="openEdit(user)">Edit</button>
            </div>
            <p>{{ user.email }}</p>
            <p>
              <span class="role" :class="`role--${user.role}`">{{ roleLabel(user.role) }}</span>
              <span class="status" :class="{ 'is-off': !user.active }">{{ user.active ? "Active" : "Inactive" }}</span>
            </p>
          </li>
        </template>
      </ul>
    </div>

    <aside v-if="editorOpen" class="drawer">
      <header class="drawer__head">
        <button class="back" type="button" @click="closeEditor">‹ Users</button>
        <h2>{{ editor.id ? "Edit user" : "Add user" }}</h2>
        <button class="close" type="button" aria-label="Close" @click="closeEditor">×</button>
      </header>

      <form novalidate @submit.prevent="save">
        <label class="field">
          <span>Full name</span>
          <input v-model.trim="editor.name" type="text" autocomplete="name" :aria-invalid="Boolean(errors.name)" />
          <small v-if="errors.name" class="field__error">{{ errors.name }}</small>
        </label>

        <label class="field">
          <span>Email</span>
          <input v-model.trim="editor.email" type="email" autocomplete="off" :disabled="Boolean(editor.id)" :aria-invalid="Boolean(errors.email)" />
          <small v-if="editor.id" class="hint">Email cannot be changed.</small>
          <small v-if="errors.email" class="field__error">{{ errors.email }}</small>
        </label>

        <label class="field">
          <span>Role</span>
          <select v-model="editor.role" :aria-invalid="Boolean(errors.role)">
            <option v-for="role in roles" :key="role.value" :value="role.value">{{ role.label }}</option>
          </select>
          <small v-if="errors.role" class="field__error">{{ errors.role }}</small>
        </label>

        <label class="field">
          <span>{{ editor.id ? "New password (optional)" : "Password" }}</span>
          <span class="secret">
            <input v-model="editor.password" :type="showPassword ? 'text' : 'password'" autocomplete="new-password" :aria-invalid="Boolean(errors.password)" />
            <button class="secret__toggle" type="button" @click="showPassword = !showPassword">{{ showPassword ? "Hide" : "Show" }}</button>
          </span>
          <small v-if="editor.id" class="hint">Leave empty to keep the current password.</small>
          <small v-if="errors.password" class="field__error">{{ errors.password }}</small>
        </label>

        <label v-if="editor.id" class="field">
          <span>Reason for change</span>
          <textarea v-model.trim="editor.reason" rows="3" placeholder="Enter reason for this change..." :aria-invalid="Boolean(errors.reason)" />
          <small v-if="errors.reason" class="field__error">{{ errors.reason }}</small>
        </label>

        <button v-if="editor.id" class="btn-deactivate" type="button" @click="toggleActive">
          {{ editor.active ? "Deactivate user" : "Activate user" }}
        </button>

        <div class="drawer__actions">
          <button class="btn-cancel" type="button" @click="closeEditor">Cancel</button>
          <button class="btn-save" type="submit">{{ editor.id ? "Save changes" : "Create user" }}</button>
        </div>
      </form>
    </aside>
  </section>
</template>

<script>
import { USER_ROLES, createUser, listUsers, roleLabel, updateUser } from "../../../data/users";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function blankEditor() {
  return { id: null, name: "", email: "", role: "STAFF", password: "", reason: "", active: true };
}

export default {
  name: "UserList",
  data() {
    return {
      users: listUsers(),
      roles: USER_ROLES,
      editorOpen: false,
      editor: blankEditor(),
      errors: {},
      showPassword: false,
      narrow: false,
    };
  },
  mounted() {
    this.onResize();
    window.addEventListener("resize", this.onResize);
  },
  unmounted() {
    window.removeEventListener("resize", this.onResize);
  },
  methods: {
    roleLabel,
    onResize() {
      this.narrow = window.innerWidth <= 800;
    },
    openCreate() {
      this.editor = blankEditor();
      this.errors = {};
      this.showPassword = false;
      this.editorOpen = true;
    },
    openEdit(user) {
      this.editor = { id: user.id, name: user.name, email: user.email, role: user.role, password: "", reason: "", active: user.active };
      this.errors = {};
      this.showPassword = false;
      this.editorOpen = true;
    },
    closeEditor() {
      this.editorOpen = false;
      this.errors = {};
    },
    validate() {
      const errors = {};
      if (!this.editor.name) errors.name = "Enter the full name.";
      if (!this.editor.id) {
        if (!this.editor.email) errors.email = "Enter an email address.";
        else if (!EMAIL_PATTERN.test(this.editor.email)) errors.email = "Enter a valid email address.";
        else if (this.users.some((user) => user.email.toLowerCase() === this.editor.email.toLowerCase())) errors.email = "A user with this email already exists.";
        if (!this.editor.password) errors.password = "Enter a password.";
      }
      if (!this.editor.role) errors.role = "Choose a role.";
      if (this.editor.id && !this.editor.reason) errors.reason = "Enter a reason for this change.";
      this.errors = errors;
      return Object.keys(errors).length === 0;
    },
    save() {
      if (!this.validate()) return;
      if (this.editor.id) {
        updateUser(this.editor.id, { name: this.editor.name, role: this.editor.role, active: this.editor.active });
      } else {
        createUser({ name: this.editor.name, email: this.editor.email, role: this.editor.role });
      }
      this.users = listUsers();
      this.closeEditor();
    },
    toggleActive() {
      if (!this.editor.reason) {
        this.errors = { ...this.errors, reason: "Enter a reason for this change." };
        return;
      }
      this.editor.active = !this.editor.active;
      updateUser(this.editor.id, { name: this.editor.name, role: this.editor.role, active: this.editor.active });
      this.users = listUsers();
      this.closeEditor();
    },
  },
};
</script>

<style scoped>
.page {
  max-width: 1100px;
  padding: 1.5rem 1.75rem 2.5rem;
}

.has-drawer {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 340px;
  gap: 1rem;
  max-width: 1180px;
  align-items: start;
}

.crumb {
  margin: 0 0 0.35rem;
  color: #64748b;
  font-size: 0.8rem;
}

.head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
}

h1 {
  display: flex;
  align-items: center;
  gap: 0.55rem;
  margin: 0;
  color: #0f172a;
  font-size: 1.7rem;
  letter-spacing: -0.03em;
}

.head p,
.card p,
.empty,
.hint {
  margin: 0.35rem 0 0;
  color: #64748b;
  font-size: 0.92rem;
}

.badge {
  border-radius: 999px;
  padding: 0.18rem 0.5rem;
  background: #fff7ed;
  color: #c2410c;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0;
}

.btn-add,
.btn-save {
  border: 0;
  border-radius: 8px;
  background: #0f766e;
  color: #fff;
  font: inherit;
  font-weight: 650;
  cursor: pointer;
}

.btn-add {
  padding: 0.7rem 1rem;
  white-space: nowrap;
}

.btn-add:hover,
.btn-save:hover {
  background: #115e59;
}

.table-wrap,
.card,
.drawer {
  margin-top: 1rem;
  background: #fff;
  border: 1px solid #e6eeec;
  border-radius: 14px;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  padding: 0.9rem 1rem;
  border-bottom: 1px solid #eef3f2;
  text-align: left;
  font-size: 0.92rem;
  color: #0f172a;
}

th {
  color: #64748b;
  font-size: 0.78rem;
  background: #f8fbfa;
}

.is-selected {
  background: #f0fdfa;
}

.name {
  font-weight: 700;
}

.role {
  display: inline-flex;
  border-radius: 999px;
  padding: 0.15rem 0.5rem;
  font-size: 0.78rem;
  font-weight: 700;
}

.role--OWNER {
  background: #fff7ed;
  color: #c2410c;
}

.role--STAFF {
  background: #ecfdf5;
  color: #0f766e;
}

.role--VIEWER {
  background: #f1f5f9;
  color: #475569;
}

.status {
  color: #0f766e;
  font-weight: 650;
}

.status::before {
  content: "";
  display: inline-block;
  width: 0.45rem;
  height: 0.45rem;
  margin-right: 0.35rem;
  border-radius: 50%;
  background: #0f766e;
}

.status.is-off {
  color: #64748b;
}

.status.is-off::before {
  background: #94a3b8;
}

.btn-edit {
  border: 1px solid #99f6e4;
  border-radius: 8px;
  padding: 0.35rem 0.75rem;
  background: #fff;
  color: #0f766e;
  font: inherit;
  font-size: 0.85rem;
  font-weight: 700;
  cursor: pointer;
}

.cards {
  display: none;
  list-style: none;
  margin: 0.75rem 0 0;
  padding: 0;
  gap: 0.75rem;
}

.card {
  padding: 0.95rem 1rem;
}

.card__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
}

.card p .status {
  margin-left: 0.6rem;
}

.drawer {
  margin-top: 0;
  padding: 1rem 1rem 1.1rem;
}

.drawer__head {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.drawer__head h2 {
  margin: 0;
  color: #0f172a;
  font-size: 1.15rem;
}

.back {
  display: none;
  border: 0;
  background: transparent;
  color: #0f766e;
  font: inherit;
  font-weight: 700;
  cursor: pointer;
  padding: 0;
}

.close {
  margin-left: auto;
  border: 0;
  background: transparent;
  color: #64748b;
  font-size: 1.4rem;
  line-height: 1;
  cursor: pointer;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  margin-top: 0.85rem;
}

.field span {
  color: #0f172a;
  font-size: 0.88rem;
  font-weight: 650;
}

.field input,
.field select,
.field textarea {
  width: 100%;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 0.65rem 0.75rem;
  color: #0f172a;
  font: inherit;
  background: #fff;
}

.field input:disabled {
  background: #f8fafc;
  color: #64748b;
}

.secret {
  position: relative;
  display: block;
}

.secret input {
  padding-right: 4.2rem;
}

.secret__toggle {
  position: absolute;
  top: 50%;
  right: 0.7rem;
  transform: translateY(-50%);
  border: 0;
  background: transparent;
  color: #0f766e;
  font: inherit;
  font-size: 0.82rem;
  font-weight: 700;
  cursor: pointer;
}

.field__error {
  color: #b42318;
  font-size: 0.8rem;
}

.hint {
  font-size: 0.78rem;
}

.btn-deactivate {
  width: 100%;
  margin-top: 1rem;
  border: 1px solid #fecaca;
  border-radius: 8px;
  padding: 0.7rem 1rem;
  background: #fff;
  color: #b42318;
  font: inherit;
  font-weight: 650;
  cursor: pointer;
}

.drawer__actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.6rem;
  margin-top: 1rem;
}

.btn-cancel {
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 0.7rem 1rem;
  background: #fff;
  color: #0f172a;
  font: inherit;
  font-weight: 650;
  cursor: pointer;
}

.btn-save {
  padding: 0.7rem 1rem;
}

@media (max-width: 800px) {
  .page,
  .has-drawer {
    display: block;
    max-width: none;
    padding: 1rem;
  }

  h1 {
    font-size: 1.45rem;
    flex-wrap: wrap;
  }

  .head {
    flex-direction: column;
    align-items: stretch;
  }

  .btn-add {
    text-align: center;
  }

  .table-wrap {
    display: none;
  }

  .cards {
    display: flex;
    flex-direction: column;
  }

  .drawer {
    margin-top: 0;
  }

  .back {
    display: inline-flex;
  }

  .close {
    display: none;
  }
}

@media (max-width: 420px) {
  .page {
    padding: 0.85rem 0.75rem 1.5rem;
  }

  .drawer__actions {
    flex-direction: column-reverse;
  }

  .btn-cancel,
  .btn-save,
  .btn-deactivate {
    width: 100%;
  }
}
</style>
