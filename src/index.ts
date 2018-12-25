/* istanbul ignore file */
import {
    bimap,
    caseOf,
    chain,
    compose,
    constant,
    curry,
    fmap,
    id,
    liftA2,
    liftA3,
    liftA4,
    liftA5,
    liftAn,
    ncurry,
    once,
    when
} from "./functions/helpers";

// Algebraic Data Types
import Either, { maybeToEither } from "./data-types/either";
import Maybe, { eitherToMaybe, prop } from "./data-types/maybe";
import Pair from "./data-types/pair";
import Reader from "./data-types/reader";
import State from "./data-types/state";
import Task from "./data-types/task";

export default {
    Either,
    Maybe,
    Pair,
    Reader,
    State,
    Task,
    bimap,
    caseOf,
    chain,
    compose,
    constant,
    curry,
    eitherToMaybe,
    fmap,
    id,
    liftA2,
    liftA3,
    liftA4,
    liftA5,
    liftAn,
    maybeToEither,
    ncurry,
    once,
    prop,
    when
};
