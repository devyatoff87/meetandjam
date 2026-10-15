import { toDatetimeLocal } from "./utils";

describe("toDatetimeLocal", () => {
  it("converts UTC ISO to datetime-local in UTC timezone", () => {
    expect(toDatetimeLocal("2024-03-10T02:30:00.000Z")).toBe("2024-03-10T02:30");
  });

  it("pads month, day, hour and minute with leading zero", () => {
    const iso = new Date(2024, 0, 5, 4, 7).toISOString();
    expect(toDatetimeLocal(iso)).toBe("2024-01-05T04:07");
  });

  it("handles midnight", () => {
    const iso = new Date(2024, 5, 15, 0, 0).toISOString();
    expect(toDatetimeLocal(iso)).toBe("2024-06-15T00:00");
  });

  it("handles end of day", () => {
    const iso = new Date(2024, 5, 15, 23, 59).toISOString();
    expect(toDatetimeLocal(iso)).toBe("2024-06-15T23:59");
  });
});
