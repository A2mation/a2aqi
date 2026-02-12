import { validateSensorPayload } from "@/domains/sensors/sensor.validation";
import { describe, it, expect } from "vitest";


describe("Sensor Validation", () => {
    it("should validate payload with required fields", () => {
        const payload = validateSensorPayload({
            serialNo: "65f123abc456def7890abc12",
            pm25: "20",
            pm10: 40,
        });

        expect(payload.serialNo).toBe("65f123abc456def7890abc12");
        expect(payload.pm25).toBe(20);
        expect(payload.pm10).toBe(40);
        expect(payload.measuredAt).toBeDefined();
    });

    it("Should throw error if serialNo missing", () => {
        expect(() =>
            validateSensorPayload({
                pm10: 10,
                pm25: 20
            })
        ).toThrow("serialNo is required")
    });

    it("Should throw error if measuredAt is invalid", () => {
        expect(() =>
            validateSensorPayload({
                serialNo: "65f123abc456def7890abc12",
                measuredAt: "invalid-date",
                pm25: 10,
                pm10: 20,
            })
        ).toThrow("measuredAt must be a valid date");
    });


    it("should throw error if pm25 is not a number", () => {
        expect(() =>
            validateSensorPayload({
                serialNo: "65f123abc456def7890abc12",
                pm25: "abc",
            })
        ).toThrow("pm25 must be a valid number")
    });

    it("should allow optional fields", () => {
        const payload = validateSensorPayload({
            serialNo: "65f123abc456def7890abc12",
            pm25: 10,
            pm10: 20,
            co2: 600,
            temperature: 30,
            humidity: 50,
        });

        expect(payload.co2).toBe(600);
        expect(payload.temperature).toBe(30);
        expect(payload.humidity).toBe(50);
    })
});