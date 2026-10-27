<template>
  <section class="page">
    <p v-if="loading" class="missing">Loading audit event…</p>
    <p v-else-if="loadError" class="missing">{{ loadError }}</p>
    <p v-else-if="!event" class="missing">
      This audit event was not found.
      <RouterLink to="/admin/audit">Back to audit history</RouterLink>
    </p>

    <template v-else>
      <p class="crumb">
        <RouterLink to="/admin/audit">Audit history</RouterLink>
        <span aria-hidden="true"> / </span>
        Event #{{ event.id }}
      </p>

      <article class="card">
        <h1>Audit event detail</h1>
        <dl class="details">
          <div>
            <dt>Date &amp; time</dt>
            <dd>{{ formatAuditWhen(event.occurredAt) }}</dd>
          </div>
          <div>
            <dt>User</dt>
            <dd>{{ auditUser(event) }}</dd>
          </div>
          <div>
            <dt>Action</dt>
            <dd>{{ actionLabel(event.action) }}</dd>
          </div>
          <div>
            <dt>Entity</dt>
            <dd>{{ entityLabel(event.entityType) }}</dd>
          </div>
          <div>
            <dt>Record ID</dt>
            <dd>#{{ event.entityId }}</dd>
          </div>
          <div>
            <dt>Reason</dt>
            <dd>{{ event.reason || "—" }}</dd>
          </div>
        </dl>
      </article>

      <section class="changes">
        <h2>Changes</h2>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th scope="col">Field</th>
                <th scope="col">Before</th>
                <th scope="col">After</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="!changes.length">
                <td colspan="3" class="empty">No field changes were recorded.</td>
              </tr>
              <template v-else>
                <tr v-for="change in changes" :key="change.field">
                  <td>{{ change.field }}</td>
                  <td>{{ change.before }}</td>
                  <td class="after">{{ change.after }}</td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>
      </section>

      <p class="readonly">This is a read-only audit record. Changes cannot be edited or deleted.</p>
    </template>
  </section>
</template>

<script>
import {
  actionLabel,
  auditChanges,
  auditUser,
  entityLabel,
  fetchAuditEvent,
  formatAuditWhen,
} from "../../../data/audit";

export default {
  name: "AuditDetail",
  data() {
    return {
      event: null,
      loading: false,
      loadError: "",
    };
  },
  computed: {
    changes() {
      return this.event ? auditChanges(this.event) : [];
    },
  },
  watch: {
    "$route.params.id": {
      immediate: true,
      handler(id) {
        this.load(id);
      },
    },
  },
  methods: {
    formatAuditWhen,
    auditUser,
    actionLabel,
    entityLabel,
    async load(id) {
      this.loading = true;
      this.loadError = "";
      this.event = null;
      try {
        this.event = await fetchAuditEvent(id);
      } catch (err) {
        if (err.status === 404) this.event = null;
        else this.loadError = err.message || "Could not load this audit event.";
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
.page {
  max-width: 760px;
  padding: 1.5rem 1.75rem 2.5rem;
}

.crumb {
  margin: 0 0 0.9rem;
  color: #64748b;
  font-size: 0.85rem;
}

.crumb a {
  color: #0f766e;
  font-weight: 600;
  text-decoration: none;
}

h1,
h2 {
  margin: 0;
  color: #0f172a;
}

h1 {
  font-size: 1.45rem;
  letter-spacing: -0.03em;
}

.card,
.table-wrap {
  background: #fff;
  border: 1px solid #e6eeec;
  border-radius: 14px;
}

.card {
  padding: 1.15rem 1.2rem 0.4rem;
}

.details {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.15rem 1.5rem;
  margin: 0.9rem 0 0;
}

.details div {
  padding: 0.75rem 0;
  border-top: 1px solid #eef3f2;
}

dt {
  color: #64748b;
  font-size: 0.78rem;
}

dd {
  margin: 0.2rem 0 0;
  color: #0f172a;
  font-weight: 650;
}

.changes {
  margin-top: 1.1rem;
}

.changes h2 {
  font-size: 1.05rem;
}

.table-wrap {
  margin-top: 0.7rem;
  overflow: hidden;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  padding: 0.85rem 1rem;
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

.after {
  background: #ecfdf5;
  color: #0f766e;
  font-weight: 700;
}

.readonly,
.missing,
.empty {
  color: #64748b;
}

.readonly {
  margin: 0.9rem 0 0;
  padding: 0.75rem 0.9rem;
  border-radius: 10px;
  background: #f0fdfa;
  color: #115e59;
  font-size: 0.88rem;
}

.missing {
  margin: 0;
}

.missing a {
  display: inline-block;
  margin-top: 0.4rem;
  color: #0f766e;
  font-weight: 700;
}

@media (max-width: 800px) {
  .page {
    padding: 1rem;
  }

  .details {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 420px) {
  .page {
    padding: 0.85rem 0.75rem 1.5rem;
  }
}
</style>
