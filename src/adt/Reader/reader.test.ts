import * as test from "tape";
import compose from "../../function/compose";
import fmap from "../../function/fmap";
import id from "../../function/id";
import Reader from ".";
// import liftA3 from "../functions/liftA3";

const ex1 = x => `${x}!`;
const ex2 = x => `${x}!!`;

test("Reader", t => {
    const a = Reader(name => `Hello ${name}!`);

    t.throws(() => Reader(), "Reader must wrap a function");
    t.equals(
        a.toString(),
        'Reader(function (name) { return "Hello " + name + "!"; })',
        "should give a Reader"
    );

    t.throws(() => a.map(1), "map expects a function");
    t.throws(() => a.map(), "map takes one argument as a function");
    t.deepEqual(a.map(x => `${x}!!`).runWith("Pete"), "Hello Pete!!!", "map");
    t.deepEqual(
        fmap(id, a).runWith("Pete"),
        a.runWith("Pete"),
        "should pass the identity law"
    );

    const l1 = compose(fmap(x => ex1(ex2(x))))(a).runWith("pete");
    const r1 = compose(fmap(ex1), fmap(ex2))(a).runWith("pete");
    t.deepEqual(l1, r1, "should pass functor composition law");

    t.throws(() => a.ap(1), "applicative expects a Reader");
    t.throws(
        () => a.ap(Reader(ex1)).runWith("pete"),
        "applicative expects wrapped function to return a function"
    );

    // const ex3 = y => x => `${x}$`;
    // const ex4 = y => x => `${x}#`;
    const a1 = Reader(name => `Hello ${name}`);
    // const b = Reader(ex3);
    // const c = Reader(ex4);
    // t.equals(
    //     liftA3(compose, a1, b, c).runWith("pete"),
    //     c.ap(b.ap(a1)).runWith("pete")
    // );

    t.deepEqual(Reader.of(1).runWith(1), 1, "of creates a Reader");
    t.deepEqual(a1.of(1).runWith(1), 1, "of creates a Reader");

    t.deepEqual(
        Reader.ask(() => 1).runWith(1),
        1,
        "ask creates a Reader when a function is supplied"
    );

    t.deepEqual(
        Reader.ask().runWith(1),
        1,
        "ask creates a Reader when a nothing is supplied"
    );

    t.throws(() => Reader.ask(1), "ask expects a function or nothing");

    t.throws(() => a.chain(1), "chain expects a function");
    t.throws(
        () => a.chain(() => 1).runWith("pete"),
        "chain expects function to return a Reader"
    );

    t.ok(
        a
            .chain(x => Reader(ex1))
            .chain(x => Reader(ex2))
            .runWith("pete") ===
            a.chain(() => Reader(ex1).chain(() => Reader(ex2))).runWith("pete"),
        "chain Associativity"
    );

    t.end();
});
