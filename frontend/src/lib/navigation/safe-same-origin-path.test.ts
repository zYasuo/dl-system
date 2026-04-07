import { describe, expect, it } from "vitest";
import { safeSameOriginPath } from "./safe-same-origin-path";

const ORIGIN = "http://localhost:3001";
const FB = "/dashboard";

describe("safeSameOriginPath", () => {
  it("returns fallback for null, undefined, or whitespace", () => {
    expect(safeSameOriginPath(null, { origin: ORIGIN })).toBe(FB);
    expect(safeSameOriginPath(undefined, { origin: ORIGIN })).toBe(FB);
    expect(safeSameOriginPath("   ", { origin: ORIGIN })).toBe(FB);
  });

  it("returns fallback when origin is missing (SSR-style)", () => {
    expect(safeSameOriginPath("/tickets")).toBe(FB);
  });

  it("accepts same-origin relative paths", () => {
    expect(safeSameOriginPath("/dashboard", { origin: ORIGIN })).toBe("/dashboard");
    expect(safeSameOriginPath("/dashboard/tickets", { origin: ORIGIN })).toBe(
      "/dashboard/tickets",
    );
    expect(
      safeSameOriginPath("/path?q=1#h", { origin: ORIGIN }),
    ).toBe("/path?q=1#h");
  });

  it("rejects protocol-relative open redirect (//evil)", () => {
    expect(
      safeSameOriginPath("//evil.example/phish", { origin: ORIGIN }),
    ).toBe(FB);
  });

  it("rejects absolute URLs to other hosts", () => {
    expect(
      safeSameOriginPath("https://evil.example/", { origin: ORIGIN }),
    ).toBe(FB);
    expect(
      safeSameOriginPath("http://evil.example/x", { origin: ORIGIN }),
    ).toBe(FB);
  });

  it("accepts full URL only when host matches base origin", () => {
    expect(
      safeSameOriginPath("http://localhost:3001/dashboard", {
        origin: ORIGIN,
      }),
    ).toBe("/dashboard");
  });

  it("respects custom fallback", () => {
    expect(
      safeSameOriginPath("//x", { origin: ORIGIN, fallback: "/login" }),
    ).toBe("/login");
  });
});
