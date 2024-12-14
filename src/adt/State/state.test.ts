import { describe, it, expect } from "vitest";
import compose from "../../function/compose";
import fmap from "../../function/fmap";
import id from "../../function/id";
import isFunction from "../../function/isFunction";
import Pair from "../Pair";
import State from ".";

const ex1 = (x: string) => `${x}!`;
const ex2 = (x: string) => `${x}!!`;

describe("State", () => {
    const a = State((name: string) => Pair(name, name));

    it("should validate constructor arguments", () => {
        expect(() => State()).toThrow("State: Must wrap a function");
        expect(() => State(() => 1).runWith(1)).toThrow(
            "State: Must wrap a function of the form s -> Pair a s",
        );
    });

    it("should convert to string correctly", () => {
        expect(typeof a.toString()).toBe("string");
    });

    it("should handle map correctly", () => {
        expect(() => a.map(1 as any)).toThrow("State: Expected a function");
        expect(() => a.map(undefined as any)).toThrow(
            "State: Expected a function",
        );
        expect(
            a
                .map((x) => `${x}!!`)
                .runWith("Pete")
                .fst(),
        ).toBe("Pete!!");
    });

    it("should satisfy identity law", () => {
        expect(fmap(id, a).runWith("Pete")).toEqual(a.runWith("Pete"));
    });

    it("should satisfy functor composition law", () => {
        const l1 = compose(fmap((x) => ex1(ex2(x))))(a).runWith("pete");
        const r1 = compose(fmap(ex1), fmap(ex2))(a).runWith("pete");
        expect(l1).toEqual(r1);
    });

    it("should handle ap correctly", () => {
        expect(() => a.ap(1 as any)).toThrow("State: State require");
        expect(() => a.ap(State(ex1)).runWith("pete")).toThrow(
            "State: Source value must be a function",
        );
        expect(() =>
            State(() => 1)
                .ap(ex1)
                .runWith(1),
        ).toThrow("State: State required");
    });

    it("should handle constructors correctly", () => {
        expect(isFunction(State.of)).toBe(true);
        expect(isFunction(State.get)).toBe(true);
        expect(isFunction(State.put)).toBe(true);
    });

    it("should handle of correctly", () => {
        expect(State.of(1).execWith(1)).toBe(1);
        expect(a.of(1).execWith(1)).toBe(1);
    });

    it("should handle get correctly", () => {
        expect(State.get((x) => x).execWith(1)).toBe(1);
        expect(State.get().execWith(1)).toBe(1);
        expect(() => State.get(1 as any)).toThrow(
            "State: No argument or function required",
        );
    });

    it("should handle put correctly", () => {
        expect(State.put(1).evalWith(2)).toBe(1);
        expect(() => State.put()).toThrow(
            "State: No argument or function required",
        );
    });

    it("should handle chain correctly", () => {
        expect(() => a.chain(1 as any)).toThrow("State: Expected a function");
        expect(() => a.chain(() => 1).runWith("pete")).toThrow(
            "State: Function must return a State",
        );
    });

    it("should satisfy chain associativity", () => {
        const ex5 = (x: string) => Pair(`${x}!`, `${x}!`);
        const ex6 = (x: string) => Pair(`${x}!!`, `${x}!!`);

        const chain1 = a
            .chain((x) => State(ex5))
            .chain((x) => State(ex6))
            .evalWith("pete");

        const chain2 = a
            .chain(() => State(ex5).chain(() => State(ex6)))
            .evalWith("pete");

        expect(chain1).toBe(chain2);
    });
});
