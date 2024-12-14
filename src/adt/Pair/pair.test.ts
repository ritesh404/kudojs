import { describe, it, expect } from "vitest";
import compose from "../../function/compose";
import fmap from "../../function/fmap";
import id from "../../function/id";
import Pair from "./";

const unwrap = (m: { getValue: () => any }) => m.getValue();
const add2 = (x: Array<any>) => x.map(v => v + 2);
const sub1 = (x: Array<any>) => x.map(v => v - 1);
const gimmePair = (x: Array<any>) =>
    Pair(
        x,
        x.map(v => v + 1)
    );

describe("Pair", () => {
    const a = Pair([1], [2]);
    const b = Pair([1], sub1);

    it("should validate constructor arguments", () => {
        expect(() => Pair()).toThrow("Pair: Both first and second values must be defined");
        expect(() => Pair(1)).toThrow("Pair: Both first and second values must be defined");
    });

    it("should convert to string correctly", () => {
        expect(a.toString()).toBe("Pair((1), (2))");
    });

    it("should handle map correctly", () => {
        expect(() => a.map(1 as any)).toThrow("Pair: Expected a function");
        expect(() => a.map(undefined as any)).toThrow("Pair: Expected a function");
        expect(unwrap(a.map(add2))).toEqual(unwrap(Pair([1], [4])));
    });

    it("should satisfy identity law", () => {
        expect(compose(unwrap, fmap(id))(a)).toEqual(compose(unwrap)(a));
    });

    it("should satisfy functor composition law", () => {
        const l1 = compose(unwrap, fmap(x => sub1(add2(x))));
        const r1 = compose(unwrap, fmap(sub1), fmap(add2));
        expect(l1(a)).toEqual(r1(a));
    });

    it("should handle ap correctly", () => {
        expect(() => a.ap(1 as any)).toThrow("Pair: Pair required");
        expect(() => a.ap(Pair(1, 1))).toThrow("Pair: Second wrapped value should be a function");
        expect(() => Pair(1, 1).ap(Pair(1, add2))).toThrow("Pair: Second wrapped value should be a function");
    });

    it("should handle of correctly", () => {
        expect(unwrap(Pair.of(1))).toEqual(unwrap(Pair(1, 1)));
        expect(unwrap(a.of(1))).toEqual(unwrap(Pair(1, 1)));
    });

    it("should handle equality correctly", () => {
        expect(Pair([1], [2]).equals(a)).toBe(a.equals(Pair([1], [2]))); // commutativity
        expect(a.equals(a)).toBe(true); // reflexivity
        expect(Pair([1], [2]).equals(b)).toBe(false); // inequality
    });

    it("should handle swap correctly", () => {
        expect(Pair(1, 2).swap().equals(Pair(2, 1))).toBe(true);
    });

    it("should handle bimap correctly", () => {
        expect(() => a.bimap(1 as any, add2)).toThrow("Pair: Expected functions for both parts");
        expect(() => a.bimap(add2, 2 as any)).toThrow("Pair: Expected functions for both parts");
        expect(a.bimap(add2, add2).toString()).toBe(Pair([3], [4]).toString());
    });

    it("should handle concat correctly", () => {
        expect(() => a.concat(1 as any)).toThrow("Pair: Pair required");
        expect(() => a.concat(Pair({ a: "1" }, { a: "1" }))).toThrow("Pair: Both Pairs must contain Semigroups");
        expect(a.concat(Pair([2], [2])).toString()).toBe(Pair([1, 2], [2, 2]).toString());
    });

    it("should handle chain correctly", () => {
        expect(() => a.chain(1 as any)).toThrow("Pair: Expected a function");
        expect(() => Pair(1, 1).chain(gimmePair)).toThrow("Pair: First value should be a Semigroup");
        expect(() => a.chain(() => 1)).toThrow("Pair: Function must return a Pair");
        expect(() => a.chain(() => Pair.of(1))).toThrow("Pair: First value of the returned Pair should be a Semigrou");
    });

    it("should satisfy chain associativity", () => {
        const chain1 = gimmePair([1]).chain(gimmePair).chain(gimmePair).toString();
        const chain2 = gimmePair([1]).chain(x => gimmePair(x).chain(gimmePair)).toString();
        expect(chain1).toBe(chain2);
    });
});
