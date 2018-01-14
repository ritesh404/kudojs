import "mocha"
import {expect} from "chai"
import Either from "./either"
import {
    id,
    fmap,
    caseOf,
    curry,
    ncurry,
    compose
} from "../functions/helpers";

// const laws: any = require("laws");
// console.log(laws);
// laws.functor.identity(Either.Right).asTest({ verbose: true, times: 100 })();
// laws.functor.composition(Either.Right).asTest({ verbose: true, times: 100 })();
// laws.applicative.identity(Either.Right).asTest({ verbose: true, times: 100 })();
// laws.applicative.composition(Either.Right).asTest({ verbose: true, times: 100 })();
// laws.applicative.homomorphism(Either.Right).asTest({ verbose: true, times: 100 })();
// laws.applicative.interchange(Either.Right).asTest({ verbose: true, times: 100 })();
// laws.monad.leftIdentity(Either.Right).asTest({ verbose: true, times: 100 })();
// laws.monad.rightIdentity(Either.Right).asTest({ verbose: true, times: 100 })();

// laws.functor.identity(Either.Left).asTest({ verbose: true, times: 100 })();
// laws.functor.composition(Either.Left).asTest({ verbose: true, times: 100 })();
// laws.applicative.identity(Either.Left).asTest({ verbose: true, times: 100 })();
// laws.applicative.composition(Either.Left).asTest({ verbose: true, times: 100 })();
// laws.applicative.homomorphism(Either.Left).asTest({ verbose: true, times: 100 })();
// laws.applicative.interchange(Either.Left).asTest({ verbose: true, times: 100 })();
// laws.monad.leftIdentity(Either.Left).asTest({ verbose: true, times: 100 })();
// laws.monad.rightIdentity(Either.Left).asTest({ verbose: true, times: 100 })();

const unwrap = (m: {getValue: Function}) => m.getValue()

describe("Either Monad",() => {
    const add2 = (a: number) => a + 2;
    const sub1 = (a: number) => a - 1;
    const a = Either.Right(1);
    const b = Either.Right(add2);
    const c = Either.Right(sub1);
    //const d = c.ap(b.ap(a.map( x => g => f => f(g(x)))));

    it("Right should pass the identity law", () => {
        expect(compose(unwrap, fmap(id))(Either.Right(1))).to.be.equal(compose(unwrap)(Either.Right(1)));
    })

    it("Right should pass the composition law", () => {
        const l = compose(unwrap, fmap((x) => sub1(add2(x)) ) );
        const r = compose(unwrap, fmap(sub1), fmap(add2));
        expect(l(Either.Right(1))).to.be.equal(r(Either.Right(1)));
    })

    it("Left should pass the identity law", () => {
        expect(compose(unwrap, fmap(id))(Either.Left(1))).to.be.equal(compose(unwrap)(Either.Left(1)));
    })

    it("Left should pass the composition law", () => {
        const l = compose(unwrap, fmap((x) => sub1(add2(x)) ) );
        const r = compose(unwrap, fmap(sub1), fmap(add2));
        expect(l(Either.Left(1))).to.be.equal(r(Either.Left(1)));
    })

    it("Should pass the homomorphism law", () => {
        expect(unwrap(b.ap(a))).to.be.equal(unwrap(Either.Right(add2(1))));
    })

    it("A functor mapped to a function should the same as the function applied to the functor", () => {
        expect(unwrap(a.map(add2))).to.be.equal(unwrap(b.ap(a)));
    })
})