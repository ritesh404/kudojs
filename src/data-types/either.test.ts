import * as test from "tape";
import Either from "./either";
import { id, fmap, caseOf, compose } from "../functions/helpers";

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

const data = { a: { b: { c: 1 } } };
const unwrap = (m: { getValue: Function }) => m.getValue();
const prop = (k: any) => (xs: Object) =>
  k in xs ? Either.Right(xs[k]) : Either.Left(1);
const add2 = (a: number) => a + 2;
const sub1 = (a: number) => a - 1;

test("Either", t => {
  const a = Either.Right(1);
  const b = Either.Right(add2);
  const c = Either.Right(sub1);
  const e = Either.Left(1);
  const f = Either.Left(add2);
  const g = Either.Left(sub1);
  //const d = c.ap(b.ap(a.map( x => g => f => f(g(x)))));

  t.ok(Either.isRight(a), "Right is a Right");
  t.notOk(Either.isLeft(a), "Right is not a Left");
  t.notOk(Either.isRight(e), "Left is not a Right");
  t.ok(Either.isLeft(e), "Left is a Left");

  t.equals(a.toString(), "Right(1)", "should give a Right");
  t.equals(e.toString(), "Left(1)", "should give a Left");

  t.throws(() => a.map(1), "Right map expects a function");
  t.equals(
    compose(unwrap, fmap(id))(a),
    compose(unwrap)(a),
    "Right should pass the identity law"
  );
  t.equals(
    compose(unwrap, fmap(id))(e),
    compose(unwrap)(e),
    "Left should pass the identity law"
  );

  const l1 = compose(unwrap, fmap(x => sub1(add2(x))));
  const r1 = compose(unwrap, fmap(sub1), fmap(add2));
  t.equals(l1(a), r1(a), "Right should pass the composition law");
  t.equals(l1(e), r1(e), "Left should pass the composition law");

  t.throws(() => a.ap(a), "Right applicative expects a function");
  t.ok(
    a.ap(c.ap(b.map(p => q => x => p(q(x))))).equals(a.ap(c).ap(b)),
    "Right should pass applicative composition"
  );

  t.equals(
    unwrap(a.map(add2)),
    unwrap(a.ap(b)),
    "Right mapped to a function should the same as the function applied to Right"
  );
  t.equals(
    unwrap(e.map(add2)),
    unwrap(e.ap(b)),
    "Left mapped to a function should the same as the function applied to Left"
  );

  t.equals(unwrap(Either.of(6)), unwrap(Either.Right(6)), "of creates a Right");

  t.equals(
    unwrap(Either.fromNullable(1)),
    unwrap(a),
    "creates a Right when non nullable value is passed"
  );
  t.equals(
    unwrap(Either.fromNullable(null)),
    unwrap(Either.Left(null)),
    "creates a Left when nullable value is passed"
  );

  t.equals(
    unwrap(Either.withDefault(1, 2)),
    unwrap(Either.Right(2)),
    "creates a Right with default value if nullable value is passed"
  );
  t.equals(
    unwrap(Either.withDefault(1, null)),
    unwrap(a),
    "creates a Right with default value if nullable value is passed"
  );

  t.equals(
    unwrap(Either.swap(a)),
    unwrap(Either.Left(1)),
    "swaps right to left"
  );
  t.equals(
    unwrap(Either.swap(e)),
    unwrap(Either.Right(1)),
    "swaps left to right"
  );

  t.equals(
    unwrap(
      Either.try(x => {
        return x + 6;
      })(1)
    ),
    unwrap(Either.Right(7)),
    "Right on succesfull try"
  );
  t.equals(
    unwrap(
      Either.try(() => {
        throw "error";
      })()
    ),
    unwrap(Either.Left("error")),
    "Left on failed try"
  );

  t.equals(
    unwrap(Either.bimap(a, v => v + 1, v => v + 2)),
    unwrap(Either.Right(3)),
    "bimap Right"
  );
  t.equals(
    unwrap(Either.bimap(e, v => v + 1, v => v + 2)),
    unwrap(Either.Left(2)),
    "bimap Left"
  );

  t.ok(Either.Right(1).equals(a), "Right equality");
  t.notOk(Either.Right(1).equals(e), "Right inequality");
  t.notOk(Either.Right(1).equals(Either.Right(2)), "Right inequality");
  t.ok(
    Either.Right(1).equals(a) === a.equals(Either.Right(1)),
    "Right commutativity"
  );
  t.ok(Either.Left(1).equals(e), "Left equality");
  t.notOk(Either.Left(1).equals(a), "Left inequality");
  t.notOk(Either.Left(1).equals(Either.Left(2)), "Left inequality");
  t.ok(
    Either.Left(1).equals(e) === e.equals(Either.Left(1)),
    "Left commutativity"
  );

  t.throws(() => a.chain(1), "Right chain expects a function");
  t.ok(
    prop("a")(data)
      .chain(prop("b"))
      .chain(prop("c"))
      .equals(prop("a")(data).chain(x => prop("b")(x).chain(prop("c")))),
    "Right chain Associativity"
  );
  t.ok(
    prop("a")(data)
      .chain(prop("d"))
      .chain(prop("c"))
      .equals(prop("a")(data).chain(x => prop("d")(x).chain(prop("c")))),
    "Left chain Associativity"
  );

  caseOf(
    {
      Right: v => t.equal(v, 1, "successful Right pattern match")
    },
    a
  );
  caseOf(
    {
      Left: v => t.equal(v, 1, "successful Left pattern match")
    },
    e
  );

  t.throws(
    () =>
      caseOf(
        {
          Left: id
        },
        a
      ),
    "Either: Expected Right"
  );
  t.throws(
    () =>
      caseOf(
        {
          Right: id
        },
        e
      ),
    "Either: Expected Left"
  );

  t.end();
});
