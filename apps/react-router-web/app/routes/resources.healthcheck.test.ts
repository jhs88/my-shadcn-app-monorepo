import { describe, expect, it, vi } from "vitest";

import { loader } from "./resources.healthcheck";

describe("resources healthcheck loader", () => {
  it("reports healthy without calling an externally forwarded host", async () => {
    const fetchSpy = vi
      .spyOn(globalThis, "fetch")
      .mockRejectedValue(new Error("external host is unreachable"));
    const response = await loader();

    expect(response.status).toBe(200);
    await expect(response.text()).resolves.toBe("OK");
    expect(fetchSpy).not.toHaveBeenCalled();
  });
});
