/**
 * Minimal gce-dev admin client using fetch (no realtime / ws dependency).
 */
import { requireDevSupabaseEnv } from "./env.mjs";

export function createFixtureAdminClient() {
  const { url, serviceKey } = requireDevSupabaseEnv();
  const rest = `${url.replace(/\/$/, "")}/rest/v1`;
  const authBase = `${url.replace(/\/$/, "")}/auth/v1`;

  const headers = {
    apikey: serviceKey,
    Authorization: `Bearer ${serviceKey}`,
    "Content-Type": "application/json",
  };

  async function parse(res) {
    const text = await res.text();
    let data = null;
    if (text) {
      try {
        data = JSON.parse(text);
      } catch {
        data = text;
      }
    }
    if (!res.ok) {
      const msg =
        (data &&
          (data.message || data.msg || data.error_description || data.error)) ||
        text ||
        res.statusText;
      return {
        data: null,
        error: { message: String(msg), status: res.status },
      };
    }
    return { data, error: null };
  }

  return {
    url,
    async select(table, { filters = [], select = "*", limit } = {}) {
      const parts = [`select=${select}`, ...filters];
      if (limit != null) parts.push(`limit=${limit}`);
      const res = await fetch(`${rest}/${table}?${parts.join("&")}`, {
        headers: { ...headers },
      });
      return parse(res);
    },

    async upsert(table, rows, onConflict) {
      const q = onConflict ? `?on_conflict=${onConflict}` : "";
      const res = await fetch(`${rest}/${table}${q}`, {
        method: "POST",
        headers: {
          ...headers,
          Prefer: "resolution=merge-duplicates,return=minimal",
        },
        body: JSON.stringify(Array.isArray(rows) ? rows : [rows]),
      });
      return parse(res);
    },

    async insert(table, rows) {
      const res = await fetch(`${rest}/${table}`, {
        method: "POST",
        headers: { ...headers, Prefer: "return=minimal" },
        body: JSON.stringify(Array.isArray(rows) ? rows : [rows]),
      });
      return parse(res);
    },

    async delete(table, filters) {
      if (!filters?.length) {
        return { data: null, error: { message: "refusing unfiltered delete" } };
      }
      const res = await fetch(`${rest}/${table}?${filters.join("&")}`, {
        method: "DELETE",
        headers: { ...headers, Prefer: "return=minimal,count=exact" },
      });
      const countHeader = res.headers.get("content-range");
      const count =
        countHeader && countHeader.includes("/")
          ? Number(countHeader.split("/")[1])
          : null;
      const parsed = await parse(res);
      return { ...parsed, count };
    },

    auth: {
      admin: {
        async createUser(payload) {
          const res = await fetch(`${authBase}/admin/users`, {
            method: "POST",
            headers,
            body: JSON.stringify(payload),
          });
          const { data, error } = await parse(res);
          if (error) return { data: { user: null }, error };
          return { data: { user: data }, error: null };
        },
        async updateUserById(id, payload) {
          const res = await fetch(`${authBase}/admin/users/${id}`, {
            method: "PUT",
            headers,
            body: JSON.stringify(payload),
          });
          const { data, error } = await parse(res);
          if (error) return { data: { user: null }, error };
          return { data: { user: data }, error: null };
        },
        async getUserById(id) {
          const res = await fetch(`${authBase}/admin/users/${id}`, {
            method: "GET",
            headers,
          });
          const { data, error } = await parse(res);
          if (error) return { data: { user: null }, error };
          return { data: { user: data }, error: null };
        },
        async deleteUser(id) {
          const res = await fetch(`${authBase}/admin/users/${id}`, {
            method: "DELETE",
            headers,
          });
          const { error } = await parse(res);
          return { error };
        },
        async listUsers({ page = 1, perPage = 200 } = {}) {
          const res = await fetch(
            `${authBase}/admin/users?page=${page}&per_page=${perPage}`,
            { method: "GET", headers }
          );
          const { data, error } = await parse(res);
          if (error) return { data: { users: [] }, error };
          return { data: { users: data.users || [] }, error: null };
        },
      },
    },
  };
}
