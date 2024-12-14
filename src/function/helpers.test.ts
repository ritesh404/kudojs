import { describe, it, expect } from "vitest";
import bimap from "./bimap";
import chain from "./chain";
import constant from "./constant";
import compose from "./compose";
import curry from "./curry";
import Either from "../adt/Either";
import fmap from "./fmap";
import id from "./id";
import isFunction from "./isFunction";
import liftAn from "./liftAn";
import liftA2 from "./liftA2";
import liftA3 from "./liftA3";
import ocurry from "./ocurry";
import once from "./once";

describe("Helpers", () => {
    const val = "hello";
    const unwrap = (m: { getValue: Function }) => m.getValue();
    const add = (a: number, b: number, c: number) => a + b + c;
    const curriedAdd = curry(add);
    const nadd = (arg: { a: number; b: number; c: number }) =>
        arg.a + arg.b + arg.c;
    const ncurriedAdd = ocurry(nadd, ["a", "b", "c"]);
    const add2 = (a: number) => a + 2;
    const eAdd2 = (a: number) => Either.of(a + 2);
    const sub1 = (a: number) => a - 1;
    const singleAdd2 = once(add2);
    const e1 = Either.of(1);

    it("should handle id function", () => {
        expect(id(val)).toBe(val);
    });

    it("should handle once function", () => {
        expect(() => once(1 as any)).toThrow();
        expect(isFunction(singleAdd2)).toBe(true);
        expect(singleAdd2(singleAdd2(2))).toBe(4);
    });

    it("should handle fmap function", () => {
        expect(fmap((a: number) => a + 1, [1, 2, 3])).toEqual([2, 3, 4]);
        expect(() => fmap(() => 2, 1 as any)).toThrow();
        expect(() => fmap(1 as any, [1])).toThrow();
    });

    it("should handle bimap function", () => {
        expect(unwrap(bimap(add2, sub1, e1))).toBe(0);
        expect(() => bimap(null as any, null as any, e1)).toThrow();
        expect(() => bimap(add2, sub1, 1 as any)).toThrow();
    });

    it("should handle chain function", () => {
        expect(unwrap(chain(eAdd2, e1))).toBe(3);
        expect(() => chain(() => 2, 1 as any)).toThrow();
        expect(() => chain(1 as any, e1)).toThrow();
    });

    it("should handle constant function", () => {
        const kfn = constant(val);
        expect(isFunction(kfn)).toBe(true);
        expect(kfn()).toBe(val);
    });

    it("should handle curry function", () => {
        expect(isFunction(curry(() => 2))).toBe(true);
        expect(() => curry()).toThrow();
        expect(() => curry(1 as any)).toThrow();
        expect(curriedAdd(1)(2)(3)).toBe(add(1, 2, 3));
        expect(isFunction(curriedAdd(1, 2))).toBe(true);
    });

    it("should handle named curry function", () => {
        expect(isFunction(ncurriedAdd)).toBe(true);
        expect(() => ocurry()).toThrow();
        expect(() => ocurry(1 as any)).toThrow();
        expect(() => ocurry((a: any, b: any) => a + b, 1 as any)).toThrow();
        expect(ncurriedAdd({ a: 1 })({ b: 2 })({ c: 3 })).toBe(
            nadd({ a: 1, b: 2, c: 3 }),
        );
        expect(isFunction(ncurriedAdd({ a: 1 }))).toBe(true);
    });

    it("should handle compose function", () => {
        expect(isFunction(compose(add2, sub1))).toBe(true);
        expect(() => compose()).toThrow();
        expect(compose(add2)(1)).toBe(add2(1));
        expect(compose(add2, sub1)(1)).toBe(2);
    });

    it("should handle lift functions", () => {
        expect(() => liftAn(1 as any, [e1])).toThrow();
        expect(() => liftAn(add2, [])).toThrow();
        expect(unwrap(liftAn(add2, [e1]))).toBe(3);
        expect(
            unwrap(liftAn((x1) => (x2) => (x3) => x1 + x2 + x3, [e1, e1, e1])),
        ).toBe(3);
        expect(unwrap(liftA2((a) => (b) => a + b, e1, Either.Right(1)))).toBe(
            2,
        );
        expect(
            unwrap(
                liftA3(
                    (a) => (b) => (c) => a + b + c,
                    e1,
                    Either.Right(1),
                    Either.Right(1),
                ),
            ),
        ).toBe(3);
    });
});
