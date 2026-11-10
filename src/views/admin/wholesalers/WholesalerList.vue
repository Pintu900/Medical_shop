<template>
  <section class="page">
    <header class="head">
      <div>
        <h1>Wholesalers</h1>
        <p>Manage your medicine wholesalers</p>
      </div>
      <RouterLink class="btn-add" to="/admin/wholesalers/new">+ Add wholesaler</RouterLink>
    </header>

    <label class="search">
      <span class="sr-only">Search wholesalers</span>
      <input v-model="query" type="search" placeholder="Search by name or phone..." />
    </label>

    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Name</th>
            <th scope="col">Phone</th>
            <th scope="col">Current Due</th>
            <th scope="col">Status</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="loading">
            <td colspan="6" class="empty">Loading wholesalers…</td>
          </tr>
          <tr v-else-if="error">
            <td colspan="6" class="load-error">{{ error }}</td>
          </tr>
          <tr v-else-if="!filtered.length">
            <td colspan="6" class="empty">No wholesalers match that search.</td>
          </tr>
          <template v-else>
          <tr v-for="(item, index) in filtered" :key="item.id">
            <td>{{ index + 1 }}</td>
            <td class="name">{{ item.name }}</td>
            <td>{{ formatPhone(item.phone) }}</td>
            <td class="due">{{ formatInr(item.currentDue) }}</td>
            <td>
              <span class="status" :class="item.active ? 'is-active' : 'is-inactive'">
                {{ item.active ? "Active" : "Inactive" }}
              </span>
            </td>
            <td>
              <div class="actions" data-menu>
                <RouterLink class="btn-view" :to="`/admin/wholesalers/${item.id}`">View</RouterLink>
                <button
                  type="button"
                  class="btn-more"
                  :aria-expanded="openMenu === item.id ? 'true' : 'false'"
                  aria-label="More actions"
                  @click.stop="toggleMenu(item.id)"
                >
                  ···
                </button>
                <div v-if="openMenu === item.id" class="menu">
                  <RouterLink :to="`/admin/wholesalers/${item.id}`">View</RouterLink>
                  <RouterLink :to="`/admin/wholesalers/${item.id}/edit`">Edit</RouterLink>
                </div>
              </div>
            </td>
          </tr>
          </template>
        </tbody>
      </table>
    </div>

    <ul class="cards">
      <li v-if="loading" class="card empty-card">Loading wholesalers…</li>
      <li v-else-if="error" class="card load-error">{{ error }}</li>
      <li v-else-if="!filtered.length" class="card empty-card">No wholesalers match that search.</li>
      <template v-else>
      <li v-for="item in filtered" :key="item.id" class="card">
        <div class="card__top">
          <strong>{{ item.name }}</strong>
          <span class="status" :class="item.active ? 'is-active' : 'is-inactive'">
            {{ item.active ? "Active" : "Inactive" }}
          </span>
        </div>
        <p>{{ formatPhone(item.phone) }}</p>
        <p class="due">Current due {{ formatInr(item.currentDue) }}</p>
        <div class="card__actions">
          <RouterLink class="btn-view" :to="`/admin/wholesalers/${item.id}`">View</RouterLink>
          <RouterLink class="btn-edit" :to="`/admin/wholesalers/${item.id}/edit`">Edit</RouterLink>
        </div>
      </li>
      </template>
    </ul>

    <p v-if="!loading && !error" class="count">{{ summary }}</p>
  </section>
</template>

<script>
import { fetchWholesalers, formatInr, formatPhone } from "../../../data/wholesalers";

export default {
  name: "WholesalerList",
  data() {
    return {
      rows: [],
      query: "",
      openMenu: "",
      loading: false,
      error: "",
    };
  },
  computed: {
    filtered() {
      const query = this.query.trim().toLowerCase();
      if (!query) return this.rows;
      const digits = query.replace(/\D/g, "");
      return this.rows.filter((item) => {
        const nameMatch = item.name.toLowerCase().includes(query);
        const phoneMatch = digits && item.phone.includes(digits);
        return nameMatch || phoneMatch;
      });
    },
    summary() {
      const total = this.rows.length;
      const shown = this.filtered.length;
      if (!shown) return `Showing 0 of ${total} wholesalers`;
      return `Showing 1 to ${shown} of ${total} wholesalers`;
    },
  },
  async created() {
    this.loading = true;
    this.error = "";
    try {
      this.rows = await fetchWholesalers();
    } catch (err) {
      this.error = err.message || "Could not load wholesalers.";
    } finally {
      this.loading = false;
    }
  },
  mounted() {
    document.addEventListener("click", this.onDocumentClick);
  },
  unmounted() {
    document.removeEventListener("click", this.onDocumentClick);
  },
  methods: {
    formatInr,
    formatPhone,
    toggleMenu(id) {
      this.openMenu = this.openMenu === id ? "" : id;
    },
    onDocumentClick(event) {
      if (!event.target.closest("[data-menu]")) this.openMenu = "";
    },
  },
};
</script>

<style scoped>
.page {
  max-width: 1100px;
  padding: 1.5rem 1.75rem 2.5rem;
}

.head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1rem;
}

h1 {
  margin: 0;
  font-size: 1.7rem;
  letter-spacing: -0.03em;
}

.head p,
.count,
.empty,
.empty-card {
  margin: 0.3rem 0 0;
  color: #64748b;
  font-size: 0.92rem;
}

.load-error {
  color: #b91c1c;
  font-weight: 600;
}

.btn-add,
.btn-view,
.btn-edit,
.btn-more {
  font: inherit;
  font-size: 0.9rem;
  font-weight: 600;
  border-radius: 8px;
  text-decoration: none;
  cursor: pointer;
}

.btn-add {
  background: #0f766e;
  color: #fff;
  padding: 0.7rem 1rem;
  white-space: nowrap;
}

.btn-add:hover {
  background: #115e59;
}

.search input {
  width: 100%;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  background: #fff;
  padding: 0.75rem 0.9rem;
  font: inherit;
  margin-bottom: 1rem;
}

.search input:focus {
  outline: 2px solid rgba(15, 118, 110, 0.25);
  border-color: #0f766e;
}

.table-wrap {
  background: #fff;
  border: 1px solid #e6eeec;
  border-radius: 14px;
  overflow: visible;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  text-align: left;
  padding: 0.9rem 1rem;
  border-bottom: 1px solid #eef3f2;
  font-size: 0.92rem;
}

th {
  color: #64748b;
  font-size: 0.78rem;
  font-weight: 600;
  letter-spacing: 0.03em;
}

.name {
  font-weight: 600;
}

.due {
  font-weight: 700;
  color: #9a3412;
}

.status {
  display: inline-flex;
  align-items: center;
  border-radius: 999px;
  padding: 0.2rem 0.6rem;
  font-size: 0.78rem;
  font-weight: 700;
}

.is-active {
  background: #dcfce7;
  color: #166534;
}

.is-inactive {
  background: #f1f5f9;
  color: #64748b;
}

.actions {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.btn-view,
.btn-edit {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #e2e8f0;
  background: #fff;
  color: #0f172a;
  padding: 0.4rem 0.75rem;
}

.btn-more {
  border: 1px solid #e2e8f0;
  background: #fff;
  color: #334155;
  width: 36px;
  height: 32px;
}

.menu {
  position: absolute;
  right: 0;
  top: calc(100% + 0.3rem);
  z-index: 5;
  min-width: 8rem;
  background: #fff;
  border: 1px solid #e6eeec;
  border-radius: 10px;
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.08);
  padding: 0.3rem;
}

.menu a {
  display: block;
  padding: 0.5rem 0.7rem;
  border-radius: 8px;
  color: #0f172a;
  text-decoration: none;
  font-size: 0.88rem;
  font-weight: 600;
}

.menu a:hover {
  background: #f4fbfa;
}

.count {
  margin-top: 0.85rem;
}

.cards {
  display: none;
  list-style: none;
  margin: 0;
  padding: 0;
  gap: 0.75rem;
}

.card {
  background: #fff;
  border: 1px solid #e6eeec;
  border-radius: 14px;
  padding: 0.95rem 1rem;
}

.card__top,
.card__actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
}

.card p {
  margin: 0.35rem 0 0;
  color: #64748b;
}

.card .due {
  margin-top: 0.45rem;
}

.card__actions {
  margin-top: 0.85rem;
}

.card__actions a {
  flex: 1;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  border: 0;
}

@media (max-width: 800px) {
  .page {
    padding: 1rem 1rem 2rem;
  }

  .head {
    flex-direction: column;
  }

  .btn-add,
  .card__actions a {
    width: 100%;
    text-align: center;
  }

  h1 {
    font-size: 1.45rem;
  }

  .table-wrap {
    display: none;
  }

  .cards {
    display: flex;
    flex-direction: column;
  }
}
</style>
