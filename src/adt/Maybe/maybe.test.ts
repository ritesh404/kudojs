import * as test from "tape";
import caseOf from "../../function/caseOf";
import compose from "../../function/compose";
import fmap from "../../function/fmap";
import id from "../../function/id";
import Either from "../Either";
import Maybe, { eitherToMaybe, prop } from ".";

// const laws: any = require("laws");
// console.log(laws);
// laws.functor.identity(Maybe.Just).asTest({ verbose: true, times: 100 })();
// laws.functor.composition(Maybe.Just).asTest({ verbose: true, times: 100 })();
// laws.applicative.identity(Maybe.Just).asTest({ verbose: true, times: 100 })();
// laws.applicative.composition(Maybe.Just).asTest({ verbose: true, times: 100 })();
// laws.applicative.homomorphism(Maybe.Just).asTest({ verbose: true, times: 100 })();
// laws.applicative.interchange(Maybe.Just).asTest({ verbose: true, times: 100 })();
// laws.monad.leftIdentity(Maybe.Just).asTest({ verbose: true, times: 100 })();
// laws.monad.rightIdentity(Maybe.Just).asTest({ verbose: true, times: 100 })();

// laws.functor.identity(Maybe.Nothing).asTest({ verbose: true, times: 100 })();
// laws.functor.composition(Maybe.Nothing).asTest({ verbose: true, times: 100 })();
// laws.applicative.identity(Maybe.Nothing).asTest({ verbose: true, times: 100 })();
// laws.applicative.composition(Maybe.Nothing).asTest({ verbose: true, times: 100 })();
// laws.applicative.homomorphism(Maybe.Nothing).asTest({ verbose: true, times: 100 })();
// laws.applicative.interchange(Maybe.Nothing).asTest({ verbose: true, times: 100 })();
// laws.monad.leftIdentity(Maybe.Nothing).asTest({ verbose: true, times: 100 })();
// laws.monad.rightIdentity(Maybe.Nothing).asTest({ verbose: true, times: 100 })();

const data = { a: { b: { c: 1 } } };
const ar = [
    Maybe.Just(1),
    Maybe.Just(2),
    Maybe.Just(3),
    Maybe.Nothing(),
    Maybe.Just(5)
];
const unwrap = (m: { getValue: Function }) => m.getValue();
const add2 = (a: number) => a + 2;
const sub1 = (a: number) => a - 1;

test("Maybe", t => {
    const a = Maybe.Just(1);
    const b = Maybe.Just(add2);
    // const c = Maybe.Just(sub1);
    const e = Maybe.Nothing();

    t.ok(Maybe.isJust(a), "Just is a Just");
    t.notOk(Maybe.isNothing(a), "Just is not a Nothing");
    t.notOk(Maybe.isJust(e), "Nothing is not a Just");
    t.ok(Maybe.isNothing(e), "Nothing is a Nothing");

    t.equals(a.toString(), "Just(1)", "should give a Just");
    t.equals(e.toString(), "Nothing()", "should give a Nothing");
    // @ts-ignore
    t.throws(() => a.map(1), "Just map expects a function");
    t.equals(
        compose(unwrap, fmap(id))(a),
        compose(unwrap)(a),
        "Just should pass the identity law"
    );
    t.equals(
        compose(unwrap, fmap(id))(e),
        compose(unwrap)(e),
        "Nothing should pass the identity law"
    );

    const l1 = compose(
        unwrap,
        fmap(x => sub1(add2(x)))
    );
    const r1 = compose(unwrap, fmap(sub1), fmap(add2));
    t.equals(l1(a), r1(a), "Just should pass the composition law");
    t.equals(l1(e), r1(e), "Nothing should pass the composition law");

    t.throws(() => a.ap(a), "Just applicative expects a function");
    // t.ok(
    //     a.ap(c.ap(b.map(p => q => x => p(q(x))))).equals(a.ap(c).ap(b)),
    //     "Just should pass applicative composition"
    // );

    t.equals(
        unwrap(a.map(add2)),
        unwrap(b.ap(a)),
        "Just mapped to a function should the same as the function applied to Just"
    );
    t.equals(
        // @ts-ignore
        unwrap(e.map(add2)),
        unwrap(b.ap(e)),
        "Nothing mapped to a function should the same as the function applied to Nothing"
    );

    t.ok(Maybe.zero().isNothing(), "zero creates a Nothing");
    t.equals(unwrap(Maybe.of(6)), unwrap(Maybe.Just(6)), "of creates a Just");
    t.equals(unwrap(a.of(6)), unwrap(Maybe.Just(6)), "Just of creates a Just");

    t.equals(
        unwrap(Maybe.fromNullable(1)),
        unwrap(a),
        "creates a Just when non nullable value is passed"
    );
    t.equals(
        unwrap(Maybe.fromNullable(null)),
        unwrap(Maybe.Nothing()),
        "creates a Nothing when null value is passed"
    );
    t.equals(
        unwrap(Maybe.fromNullable(undefined)),
        unwrap(Maybe.Nothing()),
        "creates a Nothing when undefined value is passed"
    );

    t.equals(
        unwrap(Maybe.withDefault(1, 2)),
        unwrap(Maybe.Just(2)),
        "creates a Just with default value if nullable value is passed"
    );
    t.equals(
        unwrap(Maybe.withDefault(1, null)),
        unwrap(a),
        "creates a Just with default value if nullable value is passed"
    );

    t.ok(Maybe.Just(1).equals(a), "Just equality");
    t.notOk(Maybe.Just(1).equals(e), "Just inequality");
    t.notOk(Maybe.Just(1).equals(Maybe.Just(2)), "Just inequality");
    t.ok(
        Maybe.Just(1).equals(a) === a.equals(Maybe.Just(1)),
        "Just commutativity"
    );
    t.ok(Maybe.Nothing().equals(e), "Nothing equality");
    t.notOk(Maybe.Nothing().equals(a), "Nothing inequality");
    t.ok(
        Maybe.Nothing().equals(e) === e.equals(Maybe.Nothing()),
        "Nothing commutativity"
    );

    t.ok(a.alt(Maybe.Just(2)).equals(a), "Just Alt returns the current Maybe");
    t.ok(
        e.alt(Maybe.Just(1)).equals(a),
        "Nothing Alt returns the passed Maybe"
    );
    // @ts-ignore
    t.throws(() => a.chain(1), "Just chain expects a function");
    t.ok(
        prop("a")(data)
            .chain(prop("b"))
            .chain(prop("c"))
            .equals(prop("a")(data).chain(x => prop("b")(x).chain(prop("c")))),
        "Just chain Associativity"
    );

    t.ok(
        prop("a")(data)
            .chain(prop("d"))
            .chain(prop("c"))
            .equals(prop("a")(data).chain(x => prop("d")(x).chain(prop("c")))),
        "Nothing chain Associativity"
    );

    caseOf(
        {
            Just: v => t.equal(v, 1, "successful Just pattern match")
        },
        a
    );
    caseOf(
        {
            Nothing: v => t.notOk(v, "successful Nothing pattern match")
        },
        e
    );

    t.throws(
        () =>
            caseOf(
                {
                    Nothing: id
                },
                a
            ),
        "Maybe: Expected Just"
    );
    t.throws(
        () =>
            caseOf(
                {
                    Just: id
                },
                e
            ),
        "Maybe: Expected Nothing"
    );

    t.deepEqual(Maybe.catMaybes(ar), [1, 2, 3, 5], "cat maybes");

    const j1 = Maybe.Just(1);
    const r11 = Either.Right(1);
    const n1 = Maybe.Nothing();
    const l11 = Either.Left(null);
    t.ok(eitherToMaybe(r11).equals(j1), "Right(1) transforms to Just(1)");
    t.ok(eitherToMaybe(l11).equals(n1), "Left(null) transforms to Nothing()");

    const data1 = { a: "A" };
    t.throws(() => prop({}, data), "prop expects key to be string or number");
    t.throws(
        () => prop(1, "data"),
        "prop expects second argument to be an object"
    );
    t.ok(
        prop("a", data1).equals(Maybe.Just("A")),
        "prop returns a Just if value exists"
    );
    t.ok(
        prop("b", data1).equals(Maybe.Nothing()),
        "prop returns a Nothing if value does not exists"
    );

    t.end();
});
