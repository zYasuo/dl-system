import { describe, expect, it } from "vitest";
import {
  sanitizeChartCssColor,
  sanitizeChartDomId,
  sanitizeChartSeriesKey,
} from "./safe-chart-css";

describe("sanitizeChartSeriesKey", () => {
  it("accepts safe keys", () => {
    expect(sanitizeChartSeriesKey("count")).toBe("count");
    expect(sanitizeChartSeriesKey("series_a")).toBe("series_a");
  });
  it("rejects injection-like keys", () => {
    expect(sanitizeChartSeriesKey("a;b")).toBeNull();
    expect(sanitizeChartSeriesKey("1bad")).toBeNull();
    expect(sanitizeChartSeriesKey("")).toBeNull();
  });
});

describe("sanitizeChartCssColor", () => {
  it("accepts var and hex", () => {
    expect(sanitizeChartCssColor("var(--chart-1)")).toBe("var(--chart-1)");
    expect(sanitizeChartCssColor("#fff")).toBe("#fff");
    expect(sanitizeChartCssColor("#aabbcc")).toBe("#aabbcc");
  });
  it("rejects semicolons and url()", () => {
    expect(sanitizeChartCssColor("red;")).toBeNull();
    expect(sanitizeChartCssColor("url(http://x)")).toBeNull();
  });
});

describe("sanitizeChartDomId", () => {
  it("strips unsafe chars and preserves safe fallback", () => {
    expect(sanitizeChartDomId('chart-foo];@')).toBe("chart-foo");
    expect(sanitizeChartDomId(";;;")).toBe("chart");
  });
});
