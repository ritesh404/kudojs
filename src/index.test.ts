import { describe, it, expect } from "vitest";

import Kudo from "./";

describe("Entry", () => {
    it("should have correct toString representation", () => {
        expect(Kudo.toString()).toBe("[object Object]");
    });

    it("should expose helper functions", () => {
        expect(typeof Kudo.id).toBe("function");
        expect(typeof Kudo.once).toBe("function");
        expect(typeof Kudo.fmap).toBe("function");
        expect(typeof Kudo.bimap).toBe("function");
        expect(typeof Kudo.chain).toBe("function");
        expect(typeof Kudo.caseOf).toBe("function");
        expect(typeof Kudo.curry).toBe("function");
        expect(typeof Kudo.ocurry).toBe("function");
        expect(typeof Kudo.compose).toBe("function");
        expect(typeof Kudo.constant).toBe("function");
        expect(typeof Kudo.liftAn).toBe("function");
        expect(typeof Kudo.liftA2).toBe("function");
        expect(typeof Kudo.liftA3).toBe("function");
    });

    it("should expose conversion functions", () => {
        expect(typeof Kudo.maybeToEither).toBe("function");
        expect(typeof Kudo.eitherToMaybe).toBe("function");
        expect(typeof Kudo.prop).toBe("function");
    });

    it("should expose ADTs", () => {
        expect(typeof Kudo.Either).toBe("function");
        expect(typeof Kudo.Maybe).toBe("function");
        expect(typeof Kudo.Task).toBe("function");
        expect(typeof Kudo.Pair).toBe("function");
        expect(typeof Kudo.Reader).toBe("function");
        expect(typeof Kudo.State).toBe("function");
    });
});
