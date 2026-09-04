import { describe, expect, it, vi } from "vitest";
import { assertClientRepresentativeForClient } from "@/lib/architecture/enterprise/lifecycle";

vi.mock("@/lib/architecture/enterprise/reporting", () => ({
  listClientsForRepresentative: vi.fn(),
}));

import { listClientsForRepresentative } from "@/lib/architecture/enterprise/reporting";

describe("enterprise lifecycle access", () => {
  it("allows linked client representative", async () => {
    vi.mocked(listClientsForRepresentative).mockResolvedValue([
      { id: "client-a", display_name: "Acme", status: "active", engagement_status: "active" },
    ]);
    await expect(
      assertClientRepresentativeForClient({} as never, "user-1", "client-a")
    ).resolves.toBeUndefined();
  });

  it("blocks unrelated client representative", async () => {
    vi.mocked(listClientsForRepresentative).mockResolvedValue([
      { id: "client-a", display_name: "Acme", status: "active", engagement_status: "active" },
    ]);
    await expect(
      assertClientRepresentativeForClient({} as never, "user-1", "client-b")
    ).rejects.toMatchObject({ code: "FORBIDDEN" });
  });
});
