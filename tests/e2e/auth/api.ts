import type { APIRequestContext, Page } from "@playwright/test";

export async function postJson(
  request: APIRequestContext,
  path: string,
  body: Record<string, unknown>
) {
  const res = await request.post(path, { data: body });
  const json = await res.json().catch(() => ({}));
  return { res, json, status: res.status() };
}

export async function getJson(
  request: APIRequestContext,
  path: string
) {
  const res = await request.get(path);
  const json = await res.json().catch(() => ({}));
  return { res, json, status: res.status() };
}

export async function customerAction(
  page: Page,
  body: Record<string, unknown>
) {
  return postJson(page.request, "/api/customer", body);
}
