import "mocha"
import {expect} from "chai"
import Maybe from "./maybe"
import {
    id,
    fmap,
    caseOf,
    curry,
    ncurry,
    compose
} from "../functions/helpers"

const unwrap = (m: {getValue: Function}) => m.getValue()

describe("Maybe Monad",() => {
    const add2 = (a: number) => a + 2;
    const sub1 = (a: number) => a - 1;
    const a = Maybe.Just(1);
    const b = Maybe.Just(add2);
    const c = Maybe.Just(sub1);
    //const d = c.ap(b.ap(a.map( x => g => f => f(g(x)))));

    it("Just should pass the identity law", () => {
        expect(compose(unwrap, fmap(id))(Maybe.Just(1))).to.be.equal(compose(unwrap)(Maybe.Just(1)));
    })

    it("Just should pass the composition law", () => {
        const l = compose(unwrap, fmap((x) => sub1(add2(x)) ) );
        const r = compose(unwrap, fmap(sub1), fmap(add2));
        expect(l(Maybe.Just(1))).to.be.equal(r(Maybe.Just(1)));
    })

    it("Nothing should pass the identity law", () => {
        expect(compose(unwrap, fmap(id))(Maybe.Nothing())).to.be.equal(compose(unwrap)(Maybe.Nothing(1)));
    })

    it("Nothing should pass the composition law", () => {
        const l = compose(unwrap, fmap((x) => sub1(add2(x)) ) );
        const r = compose(unwrap, fmap(sub1), fmap(add2));
        expect(l(Maybe.Nothing(1))).to.be.equal(r(Maybe.Nothing(1)));
    })

    it("Should should pass the homomorphism law", () => {
        expect(unwrap(b.ap(a))).to.be.equal(unwrap(Maybe.Just(add2(1))));
    })
})