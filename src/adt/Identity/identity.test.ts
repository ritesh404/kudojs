import * as test from "tape";
import compose from "../../function/compose";
import fmap from "../../function/fmap";
import id from "../../function/id";
import Identity from "./";

const unwrap = (m: { getValue: Function }) => m.getValue();
const add2 = (x: number) => x + 2;
const sub1 = (x: number) => x - 1;
const gimme = (x: number) => Identity(x + 1);

test("Identity", t => {
    const a = Identity(1);
    // const b = Identity(2);

    t.throws(() => Identity(), "first value must be defined");
    t.equals(a.toString(), "Identity(1)", "should give a Identity");

    t.throws(() => a.map(1), "map expects a function");
    t.throws(() => a.map(), "map takes one argument as a function");
    t.deepEqual(unwrap(a.map(add2)), unwrap(Identity(3)), "map");
    t.deepEqual(
        compose(unwrap, fmap(id))(a),
        compose(unwrap)(a),
        "should pass the identity law"
    );

    const l1 = compose(
        unwrap,
        fmap(x => sub1(add2(x)))
    );
    const r1 = compose(unwrap, fmap(sub1), fmap(add2));
    t.deepEqual(l1(a), r1(a), "should pass functor composition law");

    t.throws(() => a.ap(1), "applicative expects a Identity");
    t.throws(
        () => a.ap(Identity(1)),
        "applicative expects second to be a function type"
    );
    t.throws(
        () => a.ap(Identity(add2)),
        "applicative expects both values to be semigroups"
    );
    // t.ok(
    //     a.ap(c.ap(b.map(p => q => x => p(q(x))))).toString() ===
    //         a
    //             .ap(c)
    //             .ap(b)
    //             .toString(),
    //     "should pass applicative composition"
    // );

    t.deepEqual(unwrap(Identity.of(1)), unwrap(a), "of creates a Identity");
    t.deepEqual(unwrap(a.of(1)), unwrap(Identity(1)), "of creates a Identity");

    t.ok(Identity(1).equals(a) === a.equals(Identity(1)), "commutativity");
    t.ok(a.equals(a), "reflexivity");

    t.throws(() => a.concat(1), "concat expects a Identity");
    t.throws(
        () => a.concat(Identity(1)),
        "concat expects a Identity with semigroups"
    );
    t.ok(
        Identity([1])
            .concat(Identity([2]))
            .toString() === Identity([1, 2]).toString(),
        "concat"
    );

    t.throws(() => a.chain(1), "chain expects a function");
    t.throws(
        () => a.chain(() => 1),
        "chain expects function to return a Identity"
    );

    t.ok(
        gimme(1)
            .chain(gimme)
            .chain(gimme)
            .toString() ===
            gimme(1)
                .chain(x => gimme(x).chain(gimme))
                .toString(),
        "chain Associativity"
    );

    t.end();
});
