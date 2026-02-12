import { describe, it, expect } from "vitest";

import { roundToDay } from "@/utils/roundToDay";
import { roundToHour } from "@/utils/roundToHour";

describe("Utils Date Rounding", () => {
    it("should round to hour", () => {
        const date = new Date("2026-01-01T12:45:22.000Z");
        const rounded = roundToHour(date);
       
        expect(rounded.getMinutes()).toBe(0);
        expect(rounded.getSeconds()).toBe(0);
    });

    it("should round to day", () => {
        const date = new Date("2026-01-01T10:45:22.000Z");
        const rounded = roundToDay(date);

        expect(rounded.getHours()).toBe(0);
        expect(rounded.getMinutes()).toBe(0);
        expect(rounded.getSeconds()).toBe(0);
    });
});