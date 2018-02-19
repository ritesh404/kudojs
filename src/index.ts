/* istanbul ignore file */
import {
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
    once
} from "./functions/helpers";

// Algebraic Data Types
import Either from "./data-types/either";
import Maybe from "./data-types/maybe";
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
    once
};
