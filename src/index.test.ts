import * as test from "tape"
import Kudo from "./index"
import {
    id,
    isFunction,
    throwError,
    once,
    fmap,
    bimap,
    chain,
    caseOf,
    curry,
    ncurry,
    compose,
    liftAn,
    liftA1,
    liftA2,
    liftA3,
    liftA4,
    liftA5
} from "./functions/helpers"
import Either from "./data-types/either"
import Maybe from "./data-types/maybe"
import Pair from "./data-types/pair"
import Task from "./data-types/task"

test("Entry",(t) => {
    t.equals(Kudo.toString(), "[object Object]");
    t.equals(Kudo.id, id, "id function check")
    t.equals(Kudo.once, once, "once function check")
    t.equals(Kudo.fmap, fmap, "fmap function check")
    t.equals(Kudo.bimap, bimap, "bimap function check")
    t.equals(Kudo.chain, chain, "chain function check")
    t.equals(Kudo.caseOf, caseOf, "caseOf function check")
    t.equals(Kudo.curry, curry, "curry function check")
    t.equals(Kudo.ncurry, ncurry, "ncurry function check")
    t.equals(Kudo.compose, compose, "compose function check")
    t.equals(Kudo.liftAn, liftAn, "liftAn function check")
    t.equals(Kudo.liftA1, liftA1,"liftA1 function check")
    t.equals(Kudo.liftA2, liftA2,"liftA2 function check")
    t.equals(Kudo.liftA3, liftA3,"liftA3 function check")
    t.equals(Kudo.liftA4, liftA4,"liftA4 function check")
    t.equals(Kudo.liftA5, liftA5,"liftA5 function check")
    t.equals(Kudo.Either, Either,"Either ADT check")
    t.equals(Kudo.Maybe, Maybe, "Maybe ADT check")
    t.equals(Kudo.Task, Task, "Task ADT check")
    t.equals(Kudo.Pair, Pair, "Pair ADT check")
});