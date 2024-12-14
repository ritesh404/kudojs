import { describe, it, expect } from "vitest";
import compose from "../../function/compose";
import fmap from "../../function/fmap";
import id from "../../function/id";
import Reader from ".";

const ex1 = (x: string) => `${x}!`;
const ex2 = (x: string) => `${x}!!`;

describe("Reader", () => {
    const a = Reader((name: string) => `Hello ${name}!`);

    it("should validate constructor arguments", () => {
        expect(() => Reader()).toThrow("Reader: Must wrap a function");
    });

    it("should convert to string correctly", () => {
        expect(a.toString()).toBe("Reader((name) => `Hello ${name}!`)");
    });

    it("should handle map correctly", () => {
        expect(() => a.map(1 as any)).toThrow("Reader: Expected a function");
        expect(() => a.map(undefined as any)).toThrow(
            "Reader: Expected a function",
        );
        expect(a.map((x) => `${x}!!`).runWith("Pete")).toBe("Hello Pete!!!");
    });

    it("should satisfy identity law", () => {
        expect(fmap(id, a).runWith("Pete")).toBe(a.runWith("Pete"));
    });

    it("should satisfy functor composition law", () => {
        const l1 = compose(fmap((x) => ex1(ex2(x))))(a).runWith("pete");
        const r1 = compose(fmap(ex1), fmap(ex2))(a).runWith("pete");
        expect(l1).toBe(r1);
    });

    it("should handle ap correctly", () => {
        expect(() => a.ap(1 as any)).toThrow("Reader: Reader required");
        expect(() => a.ap(Reader(ex1)).runWith("pete")).toThrow(
            "Reader: Wrapped function must return a function",
        );
    });

    it("should handle of correctly", () => {
        const a1 = Reader((name: string) => `Hello ${name}`);
        expect(Reader.of(1).runWith(1)).toBe(1);
        expect(a1.of(1).runWith(1)).toBe(1);
    });

    it("should handle ask correctly", () => {
        expect(Reader.ask(() => 1).runWith(1)).toBe(1);
        expect(Reader.ask().runWith(1)).toBe(1);
        expect(() => Reader.ask(1 as any)).toThrow(
            "Reader: No argument or function required",
        );
    });

    it("should handle chain correctly", () => {
        expect(() => a.chain(1 as any)).toThrow("Reader: Expected a function");
        expect(() => a.chain(() => 1).runWith("pete")).toThrow(
            "Reader: Function must return a Reader",
        );
    });

    it("should satisfy chain associativity", () => {
        const chain1 = a
            .chain((x) => Reader(ex1))
            .chain((x) => Reader(ex2))
            .runWith("pete");
        const chain2 = a
            .chain(() => Reader(ex1).chain(() => Reader(ex2)))
            .runWith("pete");
        expect(chain1).toBe(chain2);
    });
});
