import * as test from "tape";
import compose from "../functions/compose";
import fmap from "../functions/fmap";
import id from "../functions/id";
import isFunction from "../functions/isFunction";

import Pair from "./pair";
import State from "./state";

const ex1 = x => `${x}!`;
const ex2 = x => `${x}!!`;

test("State", t => {
    const a = State(name => Pair(name, name));

    t.throws(() => State(), "State must wrap a function");
    t.throws(
        () => State(() => 1).runWith(1),
        "State must wrap a function that returns a pair"
    );
    t.ok(typeof a.toString() === "string", "should give a String");

    t.throws(() => a.map(1), "map expects a function");
    t.throws(() => a.map(), "map takes one argument as a function");
    t.deepEqual(
        a
            .map(x => `${x}!!`)
            .runWith("Pete")
            .fst(),
        "Pete!!",
        "map"
    );
    t.deepEqual(
        fmap(id, a).runWith("Pete"),
        a.runWith("Pete"),
        "should pass the identity law"
    );

    const l1 = compose(fmap(x => ex1(ex2(x))))(a).runWith("pete");
    const r1 = compose(fmap(ex1), fmap(ex2))(a).runWith("pete");
    t.deepEqual(l1, r1, "should pass functor composition law");

    t.throws(() => a.ap(1), "applicative expects a State");
    t.throws(
        () => a.ap(State(ex1)).runWith("pete"),
        "applicative expects wrapped function to return a function"
    );

    t.throws(
        () =>
            State(() => 1)
                .ap(ex1)
                .runWith(1),
        "applicative expects wrapped function of type s -> Pair a s"
    );

    // const a = State(name => Pair(name, name));
    // const ex3 = State(s => Pair(y => `${s}-${y}`, s));
    // const ex4 = State(s => Pair(y => `${s}+${y}`, s));
    // const d = liftA3(compose, a, ex4, ex3).evalWith("pete");
    // const f = ex3.ap(ex4.ap(a)).evalWith("pete");
    // t.equals(d, f);

    t.ok(isFunction(State.of), "of is constructor");
    t.ok(isFunction(State.get), "get is constructor");
    t.ok(isFunction(State.put), "put is constructor");

    t.deepEqual(State.of(1).execWith(1), 1, "of creates a State");
    t.deepEqual(a.of(1).execWith(1), 1, "of creates a State");

    t.deepEqual(
        State.get(x => x).execWith(1),
        1,
        "get creates a State when passed a function"
    );
    t.deepEqual(
        State.get().execWith(1),
        1,
        "get creates a State when passed nothing"
    );
    t.throws(() => State.get(1), "get expects a function or nothing");

    t.deepEqual(
        State.put(1).evalWith(2),
        1,
        "put ignores the given initial state and returns the state that was provided with put"
    );
    t.throws(() => State.put(), "put expects an initial state");

    t.throws(() => a.chain(1), "chain expects a function");
    t.throws(
        () => a.chain(() => 1).runWith("pete"),
        "chain expects function to return a State"
    );

    const ex5 = x => Pair(`${x}!`, `${x}!`);
    const ex6 = x => Pair(`${x}!!`, `${x}!!`);

    t.ok(
        a
            .chain(x => State(ex5))
            .chain(x => State(ex6))
            .evalWith("pete") ===
            a.chain(() => State(ex5).chain(() => State(ex6))).evalWith("pete"),
        "chain Associativity"
    );

    t.end();
});
