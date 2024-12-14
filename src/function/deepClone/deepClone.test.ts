import { describe, it, expect } from "vitest";
import deepClone from "./";

describe("deepClone", () => {
    it("should return value if type is not object", () => {
        expect(deepClone(1)).toBe(1);
    });

    it("should not mutate original object", () => {
        const o1 = { d: 1 };
        expect(deepClone(o1)).not.toBe(o1);
    });

    it("should deep clone nested objects", () => {
        const s = { p: 1 };
        const o2 = { d: s };
        expect(deepClone(o2).d).not.toBe(o2.d);
    });
});
