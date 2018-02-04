import * as test from "tape";
import Pair from "./pair";
import { id, fmap, compose } from "../functions/helpers";

const unwrap = (m: { getValue: Function }) => m.getValue();
const add2 = (x: Array<any>) => x.map(v => v + 2);
const sub1 = (x: Array<any>) => x.map(v => v - 1);
const gimmePair = (x: Array<any>) => Pair(x, x.map(v => v + 1));

test("Pair", t => {
  const a = Pair([1], [2]);
  const b = Pair([1], sub1);
  const c = Pair([1], add2);

  t.throws(() => Pair(), "first value must be defined");
  t.throws(() => Pair(1), "second value must be defined");
  t.equals(a.toString(), "Pair((1), (2))", "should give a Pair");

  t.throws(() => a.map(1), "map expects a function");
  t.throws(() => a.map(), "map takes one argument as a function");
  t.deepEqual(unwrap(a.map(add2)), unwrap(Pair([1], [4])), "map");
  t.deepEqual(
    compose(unwrap, fmap(id))(a),
    compose(unwrap)(a),
    "should pass the identity law"
  );

  const l1 = compose(unwrap, fmap(x => sub1(add2(x))));
  const r1 = compose(unwrap, fmap(sub1), fmap(add2));
  t.deepEqual(l1(a), r1(a), "should pass functor composition law");

  t.throws(() => a.ap(1), "applicative expects a Pair");
  t.throws(
    () => a.ap(Pair(1, 1)),
    "applicative expects second to be a function type"
  );
  t.throws(
    () => Pair(1, 1).ap(Pair(1, add2)),
    "applicative expects both values to be semigroups"
  );
  t.ok(
    a.ap(c.ap(b.map(p => q => x => p(q(x))))).toString() ===
      a
        .ap(c)
        .ap(b)
        .toString(),
    "should pass applicative composition"
  );

  t.deepEqual(unwrap(Pair.of(1)), unwrap(Pair(1, 1)), "of creates a Pair");

  t.ok(Pair([1], [2]).equals(a) === a.equals(Pair([1], [2])), "commutativity");
  t.ok(a.equals(a), "reflexivity");
  t.notOk(Pair([1], [2]).equals(b), "inequality");

  t.ok(
    Pair(1, 2)
      .swap()
      .equals(Pair(2, 1)),
    "swap"
  );

  t.throws(() => a.bimap(1, add2), "bimap expects first paramter as function");
  t.throws(() => a.bimap(add2, 2), "bimap expects second paramter as function");
  t.ok(a.bimap(add2, add2).toString() === Pair([3], [4]).toString(), "bimap");

  t.throws(() => a.concat(1), "concat expects a Pair");
  t.throws(
    () => a.concat(Pair({ a: "1" }, { a: "1" })),
    "concat expects a Pair with semigroups"
  );
  t.ok(
    a.concat(Pair([2], [2])).toString() === Pair([1, 2], [2, 2]).toString(),
    "concat"
  );

  t.throws(() => a.chain(1), "chain expects a function");
  t.ok(
    gimmePair([1])
      .chain(gimmePair)
      .chain(gimmePair)
      .toString() ===
      gimmePair([1])
        .chain(x => gimmePair(x).chain(gimmePair))
        .toString(),
    "chain Associativity"
  );

  t.end();
});
