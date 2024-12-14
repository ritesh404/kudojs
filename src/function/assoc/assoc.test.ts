import { describe, it, expect } from "vitest";
import assoc from "./";

describe("assoc", () => {
    it("should throw error if object is undefined", () => {
        expect(() => assoc("d", 1, undefined)).toThrow();
    });

    it("should set the value to a key in object", () => {
        expect(assoc("d", 1, {}).d).toBe(1);
    });

    it("should not mutate original object", () => {
        const o = {};
        expect(assoc("d", 1, o)).not.toBe(o);
    });
});
