import { describe, it, expect } from "vitest";
import caseOf from "./";
import Either from "../../adt/Either";

describe("caseOf", () => {
    it("should handle pattern matching for Either", () => {
        const e1 = Either.of(1);
        expect(caseOf({ Right: (v) => v + 1, Left: (x) => x }, e1)).toBe(2);
    });

    it("should throw on invalid pattern match", () => {
        expect(() =>
            caseOf({ Right: (v) => v + 1, Left: (x) => x }, "hello"),
        ).toThrow("caseOf: Default case missing");
    });

    it("should handle string pattern matching", () => {
        expect(caseOf({ string: (x) => x, _: (x) => x }, "string")).toBe(
            "string",
        );
    });

    it("should handle number pattern matching", () => {
        expect(caseOf({ string: (x) => x, _: (x) => x }, 1)).toBe(1);
    });

    it("should require default case for strings", () => {
        expect(() => caseOf({ str: (x) => x }, "hello")).toThrow(
            "caseOf: Default case missing",
        );
    });

    it("should require default case for numbers", () => {
        expect(() => caseOf({ 5: (x) => x }, 1)).toThrow(
            "caseOf: Default case missing",
        );
    });
});
