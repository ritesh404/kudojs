import { describe, it, expect } from "vitest";
import Either from "./index";

describe("Either", () => {
    it("should create a Right with Either.of", () => {
        const e = Either.of(1);
        expect(e.isRight()).toBe(true);
        expect(e.getValue()).toBe(1);
    });

    it("should create a Right with Either.Right", () => {
        const e = Either.Right(1);
        expect(e.isRight()).toBe(true);
        expect(e.getValue()).toBe(1);
    });

    it("should create a Left with Either.Left", () => {
        const e = Either.Left(1);
        expect(e.isLeft()).toBe(true);
        expect(e.getValue()).toBe(1);
    });

    it("should map over Right value", () => {
        const e = Either.Right(1).map(x => x + 1);
        expect(e.getValue()).toBe(2);
    });

    it("should not map over Left value", () => {
        const e = Either.Left(1).map(x => x + 1);
        expect(e.getValue()).toBe(1);
    });

    it("should chain computations", () => {
        const e = Either.Right(1).chain(x => Either.Right(x + 1));
        expect(e.getValue()).toBe(2);
    });

    it("should not chain on Left", () => {
        const e = Either.Left(1).chain(x => Either.Right(x + 1));
        expect(e.getValue()).toBe(1);
    });

    it("should bimap over both sides", () => {
        const right = Either.Right(1).bimap(x => x * 2, x => x + 1);
        expect(right.getValue()).toBe(2);

        const left = Either.Left(1).bimap(x => x * 2, x => x + 1);
        expect(left.getValue()).toBe(2);
    });

    it("should swap Left and Right", () => {
        const right = Either.Right(1).swap();
        expect(right.isLeft()).toBe(true);

        const left = Either.Left(1).swap();
        expect(left.isRight()).toBe(true);
    });

    it("should handle fromNullable", () => {
        const right = Either.fromNullable(1);
        expect(right.isRight()).toBe(true);

        const left = Either.fromNullable(null);
        expect(left.isLeft()).toBe(true);
    });
});
