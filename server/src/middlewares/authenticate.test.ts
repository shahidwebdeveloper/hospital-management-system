import { describe, expect, it } from "vitest";

import { authenticate } from "./authenticate.js";

describe("authenticate middleware", () => {
  it("loads successfully", () => {
    expect(typeof authenticate).toBe("function");
  });
});
