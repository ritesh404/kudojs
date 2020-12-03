import * as test from "tape";

import Kudo from "./";

test("Entry", t => {
    t.equals(Kudo.toString(), "[object Object]");
    t.equals(typeof Kudo.id, "function", "id function check");
    t.equals(typeof Kudo.once, "function", "once function check");
    t.equals(typeof Kudo.fmap, "function", "fmap function check");
    t.equals(typeof Kudo.bimap, "function", "bimap function check");
    t.equals(typeof Kudo.chain, "function", "chain function check");
    t.equals(typeof Kudo.caseOf, "function", "caseOf function check");
    t.equals(typeof Kudo.curry, "function", "curry function check");
    t.equals(typeof Kudo.ocurry, "function", "ncurry function check");
    t.equals(typeof Kudo.compose, "function", "compose function check");
    t.equals(typeof Kudo.constant, "function", "constant function check");
    t.equals(typeof Kudo.liftAn, "function", "liftAn function check");
    t.equals(typeof Kudo.liftA2, "function", "liftA2 function check");
    t.equals(typeof Kudo.liftA3, "function", "liftA3 function check");
    t.equals(
        typeof Kudo.maybeToEither,
        "function",
        "maybeToEither function check"
    );
    t.equals(typeof Kudo.prop, "function", "prop function check");
    t.equals(
        typeof Kudo.eitherToMaybe,
        "function",
        "eitherToMaybe function check"
    );
    t.equals(typeof Kudo.Either, "function", "Either ADT check");
    t.equals(typeof Kudo.Maybe, "function", "Maybe ADT check");
    t.equals(typeof Kudo.Task, "function", "Task ADT check");
    t.equals(typeof Kudo.Pair, "function", "Pair ADT check");
    t.equals(typeof Kudo.Reader, "function", "Reader ADT check");
    t.equals(typeof Kudo.State, "function", "State ADT check");
    t.end();
});
