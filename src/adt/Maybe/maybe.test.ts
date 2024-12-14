import { describe, it, expect } from "vitest";
import caseOf from "../../function/caseOf";
import compose from "../../function/compose";
import fmap from "../../function/fmap";
import id from "../../function/id";
import Either from "../Either";
import Maybe, { eitherToMaybe, prop, pick } from ".";

const data = { a: { b: { c: 1 } } };
const ar = [
    Maybe.Just(1),
    Maybe.Just(2),
    Maybe.Just(3),
    Maybe.Nothing(),
    Maybe.Just(5)
];
const unwrap = (m: { getValue: () => any }) => m.getValue();
const add2 = (a: number) => a + 2;
const sub1 = (a: number) => a - 1;

describe("Maybe", () => {
    const a = Maybe.Just(1);
    const b = Maybe.Just(add2);
    const e = Maybe.Nothing();

    it("should handle Just and Nothing type checks", () => {
        expect(Maybe.isJust(a)).toBe(true);
        expect(Maybe.isNothing(a)).toBe(false);
        expect(Maybe.isJust(e)).toBe(false);
        expect(Maybe.isNothing(e)).toBe(true);
    });

    it("should convert to string correctly", () => {
        expect(a.toString()).toBe("Just(1)");
        expect(e.toString()).toBe("Nothing()");
    });

    it("should handle map correctly", () => {
        expect(() => a.map(1 as any)).toThrow("Maybe: Expected a function");
    });

    it("should satisfy identity law", () => {
        expect(compose(unwrap, fmap(id))(a)).toBe(compose(unwrap)(a));
        expect(compose(unwrap, fmap(id))(e)).toBe(compose(unwrap)(e));
    });

    it("should satisfy composition law", () => {
        const l1 = compose(unwrap, fmap(x => sub1(add2(x))));
        const r1 = compose(unwrap, fmap(sub1), fmap(add2));
        expect(l1(a)).toBe(r1(a));
        expect(l1(e)).toBe(r1(e));
    });

    it("should handle ap correctly", () => {
        expect(() => a.ap(a)).toThrow("Maybe: Wrapped value is not a function");
        expect(unwrap(a.map(add2))).toBe(unwrap(b.ap(a)));
        expect(unwrap(e.map(add2))).toBe(unwrap(b.ap(e)));
    });

    it("should handle zero and of correctly", () => {
        expect(Maybe.zero().isNothing()).toBe(true);
        expect(unwrap(Maybe.of(6))).toBe(unwrap(Maybe.Just(6)));
        expect(unwrap(a.of(6))).toBe(unwrap(Maybe.Just(6)));
    });

    it("should handle fromNullable correctly", () => {
        expect(unwrap(Maybe.fromNullable(1))).toBe(unwrap(a));
        expect(unwrap(Maybe.fromNullable(null))).toBe(unwrap(Maybe.Nothing()));
        expect(unwrap(Maybe.fromNullable(undefined))).toBe(unwrap(Maybe.Nothing()));
    });

    it("should handle withDefault correctly", () => {
        expect(unwrap(Maybe.withDefault(1, 2))).toBe(unwrap(Maybe.Just(2)));
        expect(unwrap(Maybe.withDefault(1, null))).toBe(unwrap(a));
    });

    it("should handle equality correctly", () => {
        expect(Maybe.Just(1).equals(a)).toBe(true);
        expect(Maybe.Just(1).equals(e)).toBe(false);
        expect(Maybe.Just(1).equals(Maybe.Just(2))).toBe(false);
        expect(Maybe.Just(1).equals(a)).toBe(a.equals(Maybe.Just(1)));
        expect(Maybe.Nothing().equals(e)).toBe(true);
        expect(Maybe.Nothing().equals(a)).toBe(false);
        expect(Maybe.Nothing().equals(e)).toBe(e.equals(Maybe.Nothing()));
    });

    it("should handle alt correctly", () => {
        expect(a.alt(Maybe.Just(2)).equals(a)).toBe(true);
        expect(e.alt(Maybe.Just(1)).equals(a)).toBe(true);
    });

    it("should handle chain correctly", () => {
        expect(() => a.chain(1 as any)).toThrow("Maybe: Expected a function");
        
        // Chain associativity for Just
        const chainJust1 = prop("a")(data).chain(prop("b")).chain(prop("c"));
        const chainJust2 = prop("a")(data).chain(x => prop("b")(x).chain(prop("c")));
        expect(chainJust1.equals(chainJust2)).toBe(true);

        // Chain associativity for Nothing
        const chainNothing1 = prop("a")(data).chain(prop("d")).chain(prop("c"));
        const chainNothing2 = prop("a")(data).chain(x => prop("d")(x).chain(prop("c")));
        expect(chainNothing1.equals(chainNothing2)).toBe(true);
    });

    it("should handle pattern matching correctly", () => {
        caseOf({
            Just: v => expect(v).toBe(1),
            Nothing: x => x
        }, a);

        caseOf({
            Nothing: v => expect(v).toBeFalsy(),
            Just: x => x
        }, e);

        expect(() => caseOf({ Nothing: id }, a)).toThrow("Maybe: Expected Just");
        expect(() => caseOf({ Just: id }, e)).toThrow("Maybe: Expected Nothing");
    });

    it("should handle catMaybes correctly", () => {
        expect(Maybe.catMaybes(ar)).toEqual([1, 2, 3, 5]);
    });

    it("should handle eitherToMaybe correctly", () => {
        const j1 = Maybe.Just(1);
        const r11 = Either.Right(1);
        const n1 = Maybe.Nothing();
        const l11 = Either.Left(null);
        expect(eitherToMaybe(r11).equals(j1)).toBe(true);
        expect(eitherToMaybe(l11).equals(n1)).toBe(true);
    });

    it("should handle prop correctly", () => {
        const data1 = { a: "A" };
        expect(() => prop({} as any, data)).toThrow("Key should be either string or number");
        expect(() => prop(1, "data" as any)).toThrow("Cannot use 'in' operator to search for '1' in data");
        expect(prop("a", data1).equals(Maybe.Just("A"))).toBe(true);
        expect(prop("b", data1).equals(Maybe.Nothing())).toBe(true);
    });

    it("should handle pick correctly", () => {
        expect(Maybe.isNothing(pick(["d"], undefined))).toBe(true);
        expect(Maybe.isNothing(pick(["d"], {}))).toBe(true);
        expect(pick(["d"], { d: 1 }).getValue().d).toBe(1);
    });
});
