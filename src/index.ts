import {
    id,
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

import Pair from "./data-types/pair";
import Either from "./data-types/either";
import Maybe from "./data-types/maybe";
import Task from "./data-types/task";


//Algebraic Data Types

export default {
    id,
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
    liftA5,
    Pair,
    Either,
    Maybe,
    Task
};
