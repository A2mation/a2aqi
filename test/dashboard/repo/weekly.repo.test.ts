import { describe, it, expect, vi, beforeEach } from "vitest";
import { prismaMock } from "@/lib/__mocks__/prisma.test";

vi.mock("@/lib/prisma", () => ({
    prisma: prismaMock,
}));

vi.mock("@/domains/dashboard/utils/date-bucket.util", () => ({
    getWeekRange: vi.fn(),
}));

import { getWeekRange } from "@/domains/dashboard/utils/date-bucket.util";
import { WeeklyAggregateRepo } from "@/domains/dashboard/repositories/weekly-aggregate.repo";

describe("WeeklyAggregateRepo", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("should return weekly records using correct week range", async () => {
        const deviceId = "device-123";
        const dateStr = "2026-02-18";

        const mockStart = new Date("2026-02-15T00:00:00.000Z");
        const mockEnd = new Date("2026-02-22T00:00:00.000Z");

        vi.mocked(getWeekRange).mockReturnValue({
            start: mockStart,
            end: mockEnd,
        });

        const mockRecords = [
            { id: 1, deviceId, dayStart: mockStart },
            { id: 2, deviceId, dayStart: new Date("2026-02-16T00:00:00.000Z") },
        ];

        vi.mocked(prismaMock.dailyAggregateReading.findMany).mockResolvedValue(mockRecords as any);

        const result = await WeeklyAggregateRepo.findByWeek(deviceId, dateStr);

        expect(getWeekRange).toHaveBeenCalledWith(dateStr);

        expect(prismaMock.dailyAggregateReading.findMany).toHaveBeenCalledWith({
            where: {
                deviceId,
                dayStart: {
                    gte: mockStart,
                    lt: mockEnd,
                },
            },
            orderBy: { dayStart: "asc" },
        });

        expect(result).toEqual(mockRecords);
    });
});
