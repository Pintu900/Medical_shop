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
      <label class="search">
        <span class="sr-only">Search audit history</span>
        <input v-model.trim="query" type="search" placeholder="Search by user, action, record ID or reason" />
      </label>
      <label>
        <span class="sr-only">Entity</span>
        <select v-model="entity">
          <option value="">All entities</option>
          <option v-for="item in entities" :key="item" :value="item">{{ item }}</option>
        </select>
      </label>
      <label>
        <span class="sr-only">Action</span>
        <select v-model="action">
          <option value="">All actions</option>
          <option v-for="item in actions" :key="item" :value="item">{{ item }}</option>
        </select>
      </label>
      <label>
        <span class="sr-only">Time</span>
        <select v-model="period">
          <option value="all">All time</option>
          <option value="7">Last 7 days</option>
          <option value="30">Last 30 days</option>
        </select>
      </label>
    </div>

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
          <tr v-if="!filtered.length">
            <td colspan="7" class="empty">No audit events match these filters.</td>
          </tr>
          <template v-else>
            <tr v-for="event in filtered" :key="event.id">
              <td>{{ formatAuditWhen(event.at) }}</td>
              <td>{{ event.user }}</td>
              <td>{{ event.action }}</td>
              <td>{{ event.entity }}</td>
              <td>#{{ event.recordId }}</td>
              <td>{{ event.reason }}</td>
              <td>
                <RouterLink class="btn-view" :to="`/admin/audit/${event.id}`">View</RouterLink>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>

    <ul class="cards">
      <li v-if="!filtered.length" class="card empty">No audit events match these filters.</li>
      <template v-else>
        <li v-for="event in filtered" :key="event.id" class="card">
          <div class="card__top">
            <strong>{{ event.user }}</strong>
            <RouterLink class="btn-view" :to="`/admin/audit/${event.id}`">View</RouterLink>
          </div>
          <p>{{ formatAuditWhen(event.at) }}</p>
          <p>{{ event.action }} · {{ event.entity }} #{{ event.recordId }}</p>
          <p>{{ event.reason }}</p>
        </li>
      </template>
    </ul>
  </section>
</template>

<script>
import { AUDIT_ACTIONS, AUDIT_ENTITIES, formatAuditWhen, listAuditEvents } from "../../../data/audit";

export default {
  name: "AuditList",
  data() {
    return {
      events: listAuditEvents(),
      entities: AUDIT_ENTITIES,
      actions: AUDIT_ACTIONS,
      query: "",
      entity: "",
      action: "",
      period: "all",
    };
  },
  computed: {
    filtered() {
      const query = this.query.toLowerCase();
      const start = this.periodStart();
      return this.events
        .filter((event) => {
          if (this.entity && event.entity !== this.entity) return false;
          if (this.action && event.action !== this.action) return false;
          if (start && new Date(event.at) < start) return false;
          if (!query) return true;
          const haystack = [event.user, event.action, event.entity, event.recordId, event.reason, event.id]
            .join(" ")
            .toLowerCase();
          return haystack.includes(query);
        })
        .sort((a, b) => new Date(b.at) - new Date(a.at));
    },
  },
  methods: {
    formatAuditWhen,
    periodStart() {
      if (this.period === "all") return null;
      const days = this.period === "7" ? 7 : 30;
      const start = new Date();
      start.setDate(start.getDate() - days);
      start.setHours(0, 0, 0, 0);
      return start;
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

  .tools {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }

  .search {
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
