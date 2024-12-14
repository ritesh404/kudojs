import { describe, it, expect } from "vitest";
import compose from "../../function/compose";
import fmap from "../../function/fmap";
import id from "../../function/id";
import Identity from "./";

const unwrap = (m: { getValue: () => any }) => m.getValue();
const add2 = (x: number) => x + 2;
const sub1 = (x: number) => x - 1;
const gimme = (x: number) => Identity(x + 1);

describe("Identity", () => {
    const a = Identity(1);

    it("should throw when value is undefined", () => {
        expect(() => Identity()).toThrow("Identity: Value is undefined");
    });

    it("should convert to string correctly", () => {
        expect(a.toString()).toBe("Identity(1)");
    });

    it("should handle map correctly", () => {
        expect(() => a.map(1 as any)).toThrow("Identity: Expected a function");
        expect(() => a.map(undefined as any)).toThrow("Identity: Expected a function");
        expect(unwrap(a.map(add2))).toEqual(unwrap(Identity(3)));
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
        expect(() => a.ap(1 as any)).toThrow("Identity: Function not found");
        expect(() => a.ap(Identity(1))).toThrow("Identity: Function not found");
        expect(() => a.ap(Identity(add2))).toThrow("Identity: Function not found");
    });

    it("should handle of correctly", () => {
        expect(unwrap(Identity.of(1))).toEqual(unwrap(a));
        expect(unwrap(a.of(1))).toEqual(unwrap(Identity(1)));
    });

    it("should satisfy equality laws", () => {
        expect(Identity(1).equals(a)).toBe(a.equals(Identity(1))); // commutativity
        expect(a.equals(a)).toBe(true); // reflexivity
    });

    it("should handle concat correctly", () => {
        // expect(() => a.concat(1 as any)).toThrow("concat expects a Identity");
        expect(() => a.concat(Identity(1))).toThrow("Identity: Semigroup required to concat");
        expect(Identity([1]).concat(Identity([2])).toString()).toBe(Identity([1, 2]).toString());
    });

    it("should handle chain correctly", () => {
        expect(() => a.chain(1 as any)).toThrow("Identity: Expected a function");
        expect(() => a.chain(() => 1)).toThrow("Identity: Function must return Identity");
    });

    it("should satisfy chain associativity", () => {
        const chain1 = gimme(1).chain(gimme).chain(gimme).toString();
        const chain2 = gimme(1).chain(x => gimme(x).chain(gimme)).toString();
        expect(chain1).toBe(chain2);
    });
});
