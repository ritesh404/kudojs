/* istanbul ignore file */
import {
    bimap,
    caseOf,
    chain,
    compose,
    curry,
    fmap,
    id,
    liftA1,
    liftA2,
    liftA3,
    liftA4,
    liftA5,
    liftAn,
    ncurry,
    once
} from "./functions/helpers";

// Algebraic Data Types
import Either, { maybeToEither } from "./data-types/either";
import Maybe, { eitherToMaybe, prop } from "./data-types/maybe";
import Pair from "./data-types/pair";
import Task from "./data-types/task";

export default {
    Either,
    Maybe,
    Pair,
    Task,
    bimap,
    caseOf,
    chain,
    compose,
    curry,
    eitherToMaybe,
    fmap,
    id,
    liftA1,
    liftA2,
    liftA3,
    liftA4,
    liftA5,
    liftAn,
    maybeToEither,
    ncurry,
    once,
    prop
};
