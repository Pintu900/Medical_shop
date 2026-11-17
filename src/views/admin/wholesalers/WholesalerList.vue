<template>
  <section class="page">
    <header class="head">
      <div class="head__title">
        <h1>Wholesalers</h1>
        <p>Suppliers, their balances and ledgers in one place</p>
      </div>
      <RouterLink class="btn-primary" to="/admin/wholesalers/new" aria-label="Add wholesaler">
        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
          <path d="M12 5v14M5 12h14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
        </svg>
        <span>Add wholesaler</span>
      </RouterLink>
    </header>

    <div class="body">
      <div class="stats">
        <article class="stat stat--due" :class="{ 'stat--clear': totals.due <= 0 }">
          <div class="stat__top">
            <span class="stat__label">Outstanding dues</span>
            <span class="stat__icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="20" height="20">
                <path d="M10.3 4.2 2.6 17.5A2 2 0 0 0 4.3 20.5h15.4a2 2 0 0 0 1.7-3L13.7 4.2a2 2 0 0 0-3.4 0z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" />
                <path d="M12 9.5v4M12 17h.01" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
              </svg>
            </span>
          </div>
          <strong class="stat__value">{{ formatInr(totals.due) }}</strong>
          <p class="stat__sub">{{ counts.due ? `Pending with ${counts.due} ${plural(counts.due, "wholesaler")}` : "Nothing pending" }}</p>
        </article>

        <article class="stat stat--total">
          <div class="stat__top">
            <span class="stat__label">Wholesalers</span>
            <span class="stat__icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="20" height="20">
                <path d="M16 19v-1a3 3 0 0 0-3-3H7a3 3 0 0 0-3 3v1M10 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM20 19v-1a3 3 0 0 0-2.2-2.9M16.5 6.2a3 3 0 0 1 0 5.6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </span>
          </div>
          <strong class="stat__value">{{ counts.all }}</strong>
          <p class="stat__sub">{{ counts.active }} active</p>
        </article>

        <article class="stat stat--settled">
          <div class="stat__top">
            <span class="stat__label">Settled</span>
            <span class="stat__icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="20" height="20">
                <circle cx="12" cy="12" r="8.5" fill="none" stroke="currentColor" stroke-width="1.8" />
                <path d="m8.5 12.3 2.4 2.4 4.6-4.8" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </span>
          </div>
          <strong class="stat__value">{{ counts.settled }}</strong>
          <p class="stat__sub">No dues pending</p>
        </article>
      </div>

      <section class="panel">
        <div class="toolbar">
          <label class="search">
            <span class="sr-only">Search wholesalers</span>
            <svg viewBox="0 0 24 24" width="17" height="17" aria-hidden="true">
              <circle cx="11" cy="11" r="6.5" fill="none" stroke="currentColor" stroke-width="1.8" />
              <path d="m16 16 4 4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
            </svg>
            <input v-model="query" type="search" placeholder="Search name or phone" />
          </label>

          <div class="filters" role="group" aria-label="Filter wholesalers">
            <button
              v-for="option in filterOptions"
              :key="option.value"
              type="button"
              class="filter"
              :class="{ 'is-on': filter === option.value }"
              :aria-pressed="filter === option.value ? 'true' : 'false'"
              @click="filter = option.value"
            >
              {{ option.label }}
              <span class="filter__count">{{ counts[option.value] }}</span>
            </button>
          </div>

          <label class="sort">
            <span class="sr-only">Sort wholesalers</span>
            <select v-model="sort">
              <option value="due">Highest due</option>
              <option value="name">Name A–Z</option>
            </select>
            <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
              <path d="m6 9 6 6 6-6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </label>
        </div>

        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th scope="col">Wholesaler</th>
                <th scope="col">Phone</th>
                <th scope="col">Status</th>
                <th scope="col" class="num">Current due</th>
                <th scope="col" class="act">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="loading">
                <td colspan="5" class="empty">Loading wholesalers…</td>
              </tr>
              <tr v-else-if="error">
                <td colspan="5" class="empty load-error">{{ error }}</td>
              </tr>
              <tr v-else-if="!filtered.length">
                <td colspan="5" class="empty">{{ emptyMessage }}</td>
              </tr>
              <template v-else>
                <tr v-for="item in filtered" :key="item.id">
                  <td>
                    <div class="who">
                      <span class="avatar" :class="`avatar--${item.tone}`" aria-hidden="true">{{ item.initials }}</span>
                      <RouterLink class="name" :to="`/admin/wholesalers/${item.id}`">{{ item.name }}</RouterLink>
                    </div>
                  </td>
                  <td class="muted">{{ item.phoneLabel || "—" }}</td>
                  <td>
                    <span class="status" :class="item.active ? 'is-active' : 'is-inactive'">
                      <span class="status__dot" aria-hidden="true"></span>
                      {{ item.active ? "Active" : "Inactive" }}
                    </span>
                  </td>
                  <td class="num">
                    <span v-if="item.due > 0" class="badge badge--due">{{ formatInr(item.due) }}</span>
                    <span v-else class="badge badge--clear">
                      <svg viewBox="0 0 24 24" width="12" height="12" aria-hidden="true">
                        <path d="m5 12.5 4.5 4.5L19 7.5" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" />
                      </svg>
                      Settled
                    </span>
                  </td>
                  <td class="act">
                    <div class="row-actions" data-menu>
                      <RouterLink class="row-btn" :to="`/admin/wholesalers/${item.id}`">Ledger</RouterLink>
                      <button
                        type="button"
                        class="row-btn row-btn--icon"
                        :aria-expanded="openMenu === item.id ? 'true' : 'false'"
                        aria-label="More actions"
                        @click.stop="toggleMenu(item.id)"
                      >
                        <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
                          <circle cx="5.5" cy="12" r="1.6" fill="currentColor" />
                          <circle cx="12" cy="12" r="1.6" fill="currentColor" />
                          <circle cx="18.5" cy="12" r="1.6" fill="currentColor" />
                        </svg>
                      </button>
                      <div v-if="openMenu === item.id" class="menu">
                        <RouterLink :to="`/admin/payments/new?wholesalerId=${item.id}`">Record payment</RouterLink>
                        <RouterLink :to="`/admin/purchase-bills/new?wholesalerId=${item.id}`">Add purchase bill</RouterLink>
                        <RouterLink :to="`/admin/wholesalers/${item.id}/edit`">Edit details</RouterLink>
                      </div>
                    </div>
                  </td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>

        <ul class="cards">
          <li v-if="loading" class="card empty">Loading wholesalers…</li>
          <li v-else-if="error" class="card empty load-error">{{ error }}</li>
          <li v-else-if="!filtered.length" class="card empty">{{ emptyMessage }}</li>
          <template v-else>
            <li v-for="item in filtered" :key="item.id" class="card">
              <div class="card__top">
                <div class="who">
                  <span class="avatar" :class="`avatar--${item.tone}`" aria-hidden="true">{{ item.initials }}</span>
                  <span class="who__text">
                    <RouterLink class="name" :to="`/admin/wholesalers/${item.id}`">{{ item.name }}</RouterLink>
                    <small>
                      <span class="status__dot" :class="item.active ? 'is-active' : 'is-inactive'" aria-hidden="true"></span>
                      {{ item.phoneLabel || (item.active ? "Active" : "Inactive") }}
                    </small>
                  </span>
                </div>
                <div class="card__due">
                  <span>{{ item.due > 0 ? "Due" : "Balance" }}</span>
                  <strong :class="{ 'is-due': item.due > 0 }">{{ item.due > 0 ? formatInr(item.due) : "Settled" }}</strong>
                </div>
              </div>
              <div class="card__actions">
                <RouterLink class="row-btn" :to="`/admin/wholesalers/${item.id}`">View ledger</RouterLink>
                <RouterLink v-if="item.due > 0" class="row-btn row-btn--pay" :to="`/admin/payments/new?wholesalerId=${item.id}`">Pay now</RouterLink>
                <RouterLink v-else class="row-btn" :to="`/admin/wholesalers/${item.id}/edit`">Edit</RouterLink>
              </div>
            </li>
          </template>
        </ul>

        <footer v-if="!loading && !error" class="panel__foot">
          Showing {{ filtered.length }} of {{ counts.all }} {{ plural(counts.all, "wholesaler") }}
        </footer>
      </section>
    </div>
  </section>
</template>

<script>
import { currentDue, fetchWholesalers, formatInr, formatPhone, nameInitials, nameTone } from "../../../data/wholesalers";

const FILTERS = [
  { value: "all", label: "All" },
  { value: "due", label: "With dues" },
  { value: "settled", label: "Settled" },
  { value: "inactive", label: "Inactive" },
];

function dueOf(item) {
  if (item.currentDue !== undefined && item.currentDue !== null && item.currentDue !== "") return Number(item.currentDue) || 0;
  return currentDue(item);
}

export default {
  name: "WholesalerList",
  data() {
    return {
      rows: [],
      query: "",
      filter: "all",
      sort: "due",
      filterOptions: FILTERS,
      openMenu: "",
      loading: false,
      error: "",
    };
  },
  computed: {
    items() {
      return this.rows.map((item) => {
        const phone = String(item.phone || "");
        return {
          id: item.id,
          name: item.name || "",
          phone: phone.replace(/\D/g, ""),
          phoneLabel: formatPhone(phone),
          active: Boolean(item.active),
          due: dueOf(item),
          initials: nameInitials(item.name),
          tone: nameTone(item.name),
        };
      });
    },
    counts() {
      const counts = { all: this.items.length, active: 0, due: 0, settled: 0, inactive: 0 };
      this.items.forEach((item) => {
        if (item.active) counts.active += 1;
        else counts.inactive += 1;
        if (item.due > 0) counts.due += 1;
        else counts.settled += 1;
      });
      return counts;
    },
    totals() {
      return { due: this.items.reduce((sum, item) => sum + Math.max(item.due, 0), 0) };
    },
    filtered() {
      const query = this.query.trim().toLowerCase();
      const digits = query.replace(/\D/g, "");
      const list = this.items.filter((item) => {
        if (this.filter === "due" && item.due <= 0) return false;
        if (this.filter === "settled" && item.due > 0) return false;
        if (this.filter === "inactive" && item.active) return false;
        if (!query) return true;
        return item.name.toLowerCase().includes(query) || (digits && item.phone.includes(digits));
      });
      const byName = (a, b) => a.name.localeCompare(b.name);
      return list.sort(this.sort === "due" ? (a, b) => b.due - a.due || byName(a, b) : byName);
    },
    emptyMessage() {
      if (!this.items.length) return "No wholesalers yet. Add your first supplier to get started.";
      return "No wholesalers match these filters.";
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
    plural(count, word) {
      return count === 1 ? word : `${word}s`;
    },
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
  min-height: 100vh;
  background: #f6f8fa;
  color: #0f172a;
}

.head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.1rem 1.6rem 1rem;
  background: #fff;
  border-bottom: 1px solid #eef1f4;
}

h1 {
  margin: 0;
  font-size: 1.45rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  line-height: 1.25;
}

.head p {
  margin: 0.2rem 0 0;
  color: #64748b;
  font-size: 0.84rem;
}

.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  height: 40px;
  padding: 0 1rem;
  border-radius: 10px;
  background: #0f766e;
  color: #fff;
  font-size: 0.88rem;
  font-weight: 600;
  text-decoration: none;
  white-space: nowrap;
  box-shadow: 0 6px 16px rgba(15, 118, 110, 0.18);
}

.btn-primary:hover {
  background: #0c645d;
  color: #fff;
}

.body {
  max-width: 1180px;
  padding: 1.6rem 1.6rem 2.5rem;
}

.stats {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1rem;
}

.stat {
  padding: 1rem 1.05rem;
  border: 1px solid #e8edf1;
  border-radius: 16px;
  background: #fff;
}

.stat__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
}

.stat__label {
  color: #475569;
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.stat__icon {
  display: inline-grid;
  place-items: center;
  width: 34px;
  height: 34px;
  border-radius: 10px;
  background: var(--stat-soft);
  color: var(--stat-ink);
}

.stat__value {
  display: block;
  margin: 0.5rem 0 0.25rem;
  color: var(--stat-value, #0f172a);
  font-size: 1.55rem;
  font-weight: 700;
  letter-spacing: -0.03em;
  line-height: 1.15;
}

.stat__sub {
  margin: 0;
  color: #64748b;
  font-size: 0.78rem;
}

.stat--due {
  --stat-soft: #fdecc8;
  --stat-ink: #b45309;
  --stat-value: #b45309;
  border-color: #f6dfae;
  background: #fffaf0;
}

.stat--due .stat__label,
.stat--due .stat__sub {
  color: #b45309;
}

.stat--clear {
  --stat-soft: #e6f6f2;
  --stat-ink: #0f766e;
  --stat-value: #0f172a;
  border-color: #e8edf1;
  background: #fff;
}

.stat--clear .stat__label {
  color: #475569;
}

.stat--clear .stat__sub {
  color: #0f766e;
}

.stat--total {
  --stat-soft: #eaf1ff;
  --stat-ink: #1d4ed8;
}

.stat--settled {
  --stat-soft: #e6f6f2;
  --stat-ink: #0f766e;
}

.panel {
  margin-top: 1.25rem;
  border: 1px solid #e8edf1;
  border-radius: 16px;
  background: #fff;
}

.toolbar {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.25rem;
  border-bottom: 1px solid #eef1f4;
}

.search {
  position: relative;
  display: flex;
  align-items: center;
  flex: 1 1 260px;
  max-width: 340px;
  color: #94a3b8;
}

.search svg {
  position: absolute;
  left: 0.8rem;
  pointer-events: none;
}

.search input {
  width: 100%;
  height: 38px;
  padding: 0 0.85rem 0 2.35rem;
  border: 1px solid #dfe5eb;
  border-radius: 10px;
  background: #f8fafb;
  color: #0f172a;
  font: inherit;
  font-size: 0.86rem;
}

.search input::placeholder {
  color: #94a3b8;
}

.search input:focus {
  outline: none;
  border-color: #0f766e;
  background: #fff;
  box-shadow: 0 0 0 3px rgba(15, 118, 110, 0.12);
}

.filters {
  display: flex;
  gap: 0.4rem;
  overflow-x: auto;
  scrollbar-width: none;
}

.filters::-webkit-scrollbar {
  display: none;
}

.filter {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  flex: none;
  height: 34px;
  padding: 0 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 999px;
  background: #fff;
  color: #475569;
  font: inherit;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
}

.filter:hover {
  border-color: #b7dcd5;
  color: #0f766e;
}

.filter.is-on {
  border-color: #0f766e;
  background: #0f766e;
  color: #fff;
}

.filter__count {
  min-width: 20px;
  padding: 0.05rem 0.4rem;
  border-radius: 999px;
  background: #f1f4f7;
  color: #475569;
  font-size: 0.7rem;
  text-align: center;
}

.filter.is-on .filter__count {
  background: rgba(255, 255, 255, 0.2);
  color: #fff;
}

.sort {
  position: relative;
  display: inline-flex;
  align-items: center;
  margin-left: auto;
  color: #64748b;
}

.sort select {
  appearance: none;
  height: 34px;
  padding: 0 2rem 0 0.75rem;
  border: 1px solid #dfe5eb;
  border-radius: 9px;
  background: #fff;
  color: #0f172a;
  font: inherit;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
}

.sort select:focus {
  outline: none;
  border-color: #0f766e;
  box-shadow: 0 0 0 3px rgba(15, 118, 110, 0.12);
}

.sort svg {
  position: absolute;
  right: 0.65rem;
  pointer-events: none;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  padding: 0.85rem 1.25rem;
  border-bottom: 1px solid #eef1f4;
  text-align: left;
  font-size: 0.86rem;
  white-space: nowrap;
}

th {
  padding-top: 0.75rem;
  padding-bottom: 0.75rem;
  background: #f8fafb;
  color: #64748b;
  font-size: 0.68rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

tbody tr:hover td {
  background: #fbfcfd;
}

.num {
  text-align: right;
}

.act {
  width: 1%;
  text-align: right;
}

.muted {
  color: #475569;
}

.empty {
  padding: 1.75rem 1.25rem;
  color: #64748b;
  text-align: center;
  white-space: normal;
}

.load-error {
  color: #b91c1c;
  font-weight: 600;
}

.who {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  min-width: 0;
}

.who__text {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.who__text small {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  color: #64748b;
  font-size: 0.74rem;
}

.avatar {
  display: inline-grid;
  place-items: center;
  width: 34px;
  height: 34px;
  flex: none;
  border-radius: 9px;
  font-size: 0.72rem;
  font-weight: 700;
}

.avatar--teal {
  background: #e3f6ef;
  color: #0f766e;
}

.avatar--orange {
  background: #fdeee2;
  color: #c2410c;
}

.avatar--blue {
  background: #e7f0fd;
  color: #1d4ed8;
}

.avatar--violet {
  background: #f1eafd;
  color: #6d28d9;
}

.avatar--rose {
  background: #fde8ec;
  color: #be123c;
}

.avatar--amber {
  background: #fdf3d8;
  color: #a16207;
}

.name {
  color: #0f172a;
  font-weight: 600;
  text-decoration: none;
}

.name:hover {
  color: #0f766e;
}

.status {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.22rem 0.6rem;
  border-radius: 999px;
  font-size: 0.74rem;
  font-weight: 600;
}

.status.is-active {
  background: #ecf8f3;
  color: #0f766e;
}

.status.is-inactive {
  background: #f1f4f7;
  color: #64748b;
}

.status__dot {
  width: 6px;
  height: 6px;
  flex: none;
  border-radius: 50%;
  background: currentColor;
}

.status__dot.is-active {
  background: #14b8a6;
}

.status__dot.is-inactive {
  background: #94a3b8;
}

.badge {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.25rem 0.55rem;
  border-radius: 6px;
  font-size: 0.76rem;
  font-weight: 600;
}

.badge--due {
  border: 1px solid #f6d79a;
  background: #fff6e2;
  color: #b45309;
}

.badge--clear {
  border: 1px solid #bfe6d7;
  background: #ecf8f3;
  color: #0f766e;
}

.row-actions {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
}

.row-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 62px;
  height: 32px;
  padding: 0 0.75rem;
  border: 1px solid #dfe5eb;
  border-radius: 8px;
  background: #fff;
  color: #334155;
  font: inherit;
  font-size: 0.78rem;
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
}

.row-btn:hover {
  border-color: #b7dcd5;
  color: #0f766e;
}

.row-btn--icon {
  min-width: 32px;
  padding: 0;
}

.row-btn--pay {
  border-color: #0f766e;
  background: #0f766e;
  color: #fff;
}

.row-btn--pay:hover {
  background: #0c645d;
  color: #fff;
}

.menu {
  position: absolute;
  top: calc(100% + 0.35rem);
  right: 0;
  z-index: 5;
  min-width: 11rem;
  padding: 0.3rem;
  border: 1px solid #e8edf1;
  border-radius: 12px;
  background: #fff;
  box-shadow: 0 14px 34px rgba(15, 23, 42, 0.1);
  text-align: left;
}

.menu a {
  display: block;
  padding: 0.55rem 0.7rem;
  border-radius: 8px;
  color: #0f172a;
  font-size: 0.84rem;
  font-weight: 500;
  text-decoration: none;
}

.menu a:hover {
  background: #f2fbf9;
  color: #0f5f58;
}

.panel__foot {
  padding: 0.8rem 1.25rem;
  color: #64748b;
  font-size: 0.76rem;
}

.cards {
  display: none;
  flex-direction: column;
  gap: 0.65rem;
  margin: 0;
  padding: 0.85rem;
  list-style: none;
}

.card {
  padding: 0.9rem;
  border: 1px solid #eef1f4;
  border-radius: 14px;
  background: #fff;
}

.card__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
}

.card__due {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  flex: none;
}

.card__due span {
  color: #94a3b8;
  font-size: 0.66rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.card__due strong {
  color: #0f766e;
  font-size: 0.95rem;
}

.card__due strong.is-due {
  color: #b45309;
}

.card__actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
  margin-top: 0.85rem;
}

.card__actions .row-btn {
  height: 38px;
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

@media (max-width: 1200px) {
  .toolbar {
    flex-wrap: wrap;
  }

  .search {
    flex: 1 1 200px;
    max-width: none;
  }

  .filters {
    order: 3;
    flex: 1 1 100%;
  }
}

@media (max-width: 800px) {
  .head {
    padding: 1.1rem 1rem 0;
    background: transparent;
    border-bottom: 0;
  }

  h1 {
    font-size: 1.6rem;
    font-weight: 800;
  }

  .head p {
    margin-top: 0.3rem;
    font-size: 0.9rem;
  }

  .btn-primary {
    height: 42px;
    padding: 0 0.85rem;
    border-radius: 12px;
  }

  .body {
    padding: 1rem 1rem 2rem;
  }

  .stats {
    grid-template-columns: 1fr 1fr;
    gap: 0.75rem;
  }

  .stat--due {
    grid-column: 1 / -1;
  }

  .stat__label {
    font-size: 0.74rem;
    font-weight: 700;
  }

  .stat__value {
    font-size: clamp(1.3rem, 6.4vw, 1.7rem);
    font-weight: 800;
  }

  .panel {
    margin-top: 1rem;
    border: 0;
    background: transparent;
  }

  .toolbar {
    padding: 0 0 0.75rem;
    border-bottom: 0;
  }

  .search input {
    height: 44px;
    border-radius: 12px;
    background: #fff;
  }

  .table-wrap {
    display: none;
  }

  .cards {
    display: flex;
    padding: 0;
  }

  .card {
    border-color: #e8edf1;
    border-radius: 16px;
  }

  .panel__foot {
    padding: 0.85rem 0.15rem 0;
  }
}

@media (max-width: 420px) {
  .btn-primary span {
    display: none;
  }

  .btn-primary {
    width: 42px;
    padding: 0;
    justify-content: center;
  }
}
</style>
