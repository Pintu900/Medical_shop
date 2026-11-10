<template>
  <section class="page">
    <header class="head">
      <div>
        <h1>
          Audit history
          <span class="badge">Owner only</span>
        </h1>
        <p>Track important changes made in the system. View who did what and when.</p>
      </div>
    </header>

    <div class="tools">
      <label>
        <span class="sr-only">Entity</span>
        <select v-model="entity" @change="reload">
          <option value="">All entities</option>
          <option v-for="item in entities" :key="item.value" :value="item.value">{{ item.label }}</option>
        </select>
      </label>
      <label>
        <span class="sr-only">Action</span>
        <select v-model="action" @change="reload">
          <option value="">All actions</option>
          <option v-for="item in actions" :key="item.value" :value="item.value">{{ item.label }}</option>
        </select>
      </label>
      <label>
        <span class="sr-only">Time</span>
        <select v-model="period" @change="reload">
          <option value="all">All time</option>
          <option value="7">Last 7 days</option>
          <option value="30">Last 30 days</option>
        </select>
      </label>
      <label class="search">
        <span class="sr-only">Record ID</span>
        <input v-model.trim="recordId" inputmode="numeric" placeholder="Record ID" @change="reload" />
      </label>
    </div>

    <p v-if="error" class="load-error" role="alert">{{ error }}</p>

    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th scope="col">Date &amp; time</th>
            <th scope="col">User</th>
            <th scope="col">Action</th>
            <th scope="col">Entity</th>
            <th scope="col">Record ID</th>
            <th scope="col">Reason</th>
            <th scope="col">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="loading">
            <td colspan="7" class="empty">Loading audit history…</td>
          </tr>
          <tr v-else-if="!events.length && !error">
            <td colspan="7" class="empty">No audit events match these filters.</td>
          </tr>
          <template v-else>
            <tr v-for="event in events" :key="event.id">
              <td>{{ formatAuditWhen(event.occurredAt) }}</td>
              <td>{{ auditUser(event) }}</td>
              <td>{{ actionLabel(event.action) }}</td>
              <td>{{ entityLabel(event.entityType) }}</td>
              <td>#{{ event.entityId }}</td>
              <td>{{ event.reason || "—" }}</td>
              <td>
                <RouterLink class="btn-view" :to="`/admin/audit/${event.id}`">View</RouterLink>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>

    <ul class="cards">
      <li v-if="loading" class="card empty">Loading audit history…</li>
      <li v-else-if="!events.length && !error" class="card empty">No audit events match these filters.</li>
      <template v-else>
        <li v-for="event in events" :key="event.id" class="card">
          <div class="card__top">
            <strong>{{ auditUser(event) }}</strong>
            <RouterLink class="btn-view" :to="`/admin/audit/${event.id}`">View</RouterLink>
          </div>
          <p>{{ formatAuditWhen(event.occurredAt) }}</p>
          <p>{{ actionLabel(event.action) }} · {{ entityLabel(event.entityType) }} #{{ event.entityId }}</p>
          <p>{{ event.reason || "—" }}</p>
        </li>
      </template>
    </ul>

    <footer v-if="!loading && totalElements" class="pager">
      <p>{{ rangeLabel }}</p>
      <div>
        <button type="button" :disabled="page === 0" @click="go(page - 1)">‹</button>
        <span>Page {{ page + 1 }} of {{ totalPages || 1 }}</span>
        <button type="button" :disabled="page + 1 >= totalPages" @click="go(page + 1)">›</button>
      </div>
    </footer>
  </section>
</template>

<script>
import {
  AUDIT_ACTIONS,
  AUDIT_ENTITIES,
  actionLabel,
  auditDateRange,
  auditUser,
  entityLabel,
  fetchAuditEvents,
  formatAuditWhen,
} from "../../../data/audit";

const PAGE_SIZE = 20;

export default {
  name: "AuditList",
  data() {
    return {
      events: [],
      entities: AUDIT_ENTITIES,
      actions: AUDIT_ACTIONS,
      entity: "",
      action: "",
      period: "all",
      recordId: "",
      page: 0,
      size: PAGE_SIZE,
      totalElements: 0,
      totalPages: 0,
      loading: false,
      error: "",
    };
  },
  computed: {
    rangeLabel() {
      if (!this.totalElements) return "0 events";
      const start = this.page * this.size + 1;
      const end = start + this.events.length - 1;
      return `${start}–${end} of ${this.totalElements}`;
    },
  },
  created() {
    this.load();
  },
  methods: {
    formatAuditWhen,
    auditUser,
    actionLabel,
    entityLabel,
    reload() {
      this.page = 0;
      this.load();
    },
    go(page) {
      this.page = page;
      this.load();
    },
    async load() {
      if (this.recordId && !this.entity) {
        this.error = "Choose an entity before filtering by record ID.";
        return;
      }
      if (this.recordId && !/^[1-9]\d*$/.test(this.recordId)) {
        this.error = "Record ID must be a positive number.";
        return;
      }
      this.loading = true;
      this.error = "";
      const dates = auditDateRange(this.period);
      try {
        const data = await fetchAuditEvents({
          entityType: this.entity,
          entityId: this.recordId,
          action: this.action,
          fromDate: dates.fromDate,
          toDate: dates.toDate,
          page: this.page,
          size: PAGE_SIZE,
        });
        this.events = data.items;
        this.page = data.page;
        this.size = data.size;
        this.totalElements = data.totalElements;
        this.totalPages = data.totalPages;
      } catch (err) {
        this.events = [];
        this.totalElements = 0;
        this.totalPages = 0;
        this.error = err.message || "Could not load audit history.";
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
.page {
  max-width: 1100px;
  padding: 1.5rem 1.75rem 2.5rem;
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
.empty {
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

.tools {
  display: flex;
  flex-wrap: wrap;
  gap: 0.65rem;
  margin-top: 1rem;
}

.search {
  flex: 1 1 16rem;
}

.load-error {
  margin: 0.8rem 0 0;
  color: #b91c1c;
  font-weight: 600;
}

.search input,
.tools select {
  width: 100%;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: #fff;
  padding: 0.65rem 0.75rem;
  color: #0f172a;
  font: inherit;
}

.tools select {
  font-weight: 600;
}

.table-wrap,
.card {
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

.btn-view {
  display: inline-flex;
  border: 1px solid #99f6e4;
  border-radius: 8px;
  padding: 0.35rem 0.75rem;
  background: #fff;
  color: #0f766e;
  font-size: 0.85rem;
  font-weight: 700;
  text-decoration: none;
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

.card__top strong {
  color: #0f172a;
}

.pager {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-top: 0.8rem;
}

.pager p,
.pager span {
  margin: 0;
  color: #64748b;
  font-size: 0.92rem;
}

.pager div {
  display: flex;
  align-items: center;
  gap: 0.45rem;
}

.pager button {
  min-width: 2rem;
  height: 2rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: #fff;
  color: #0f172a;
  font: inherit;
  font-weight: 600;
  cursor: pointer;
}

.pager button:disabled {
  opacity: 0.45;
  cursor: default;
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
    padding: 1rem;
  }

  h1 {
    font-size: 1.45rem;
    flex-wrap: wrap;
  }

  .tools,
  .pager {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }

  .search,
  .pager {
    grid-column: 1 / -1;
  }

  .table-wrap {
    display: none;
  }

  .cards {
    display: flex;
    flex-direction: column;
  }
}

@media (max-width: 420px) {
  .page {
    padding: 0.85rem 0.75rem 1.5rem;
  }
}
</style>
