/* istanbul ignore file */

import Either, { maybeToEither } from "./data-types/either";
import Maybe, { eitherToMaybe, prop } from "./data-types/maybe";
import Pair from "./data-types/pair";
import Reader from "./data-types/reader";
import State from "./data-types/state";
import Task from "./data-types/task";
import bimap from "./functions/bimap";
import caseOf from "./functions/caseOf";
import chain from "./functions/chain";
import compose from "./functions/compose";
import constant from "./functions/constant";
import curry from "./functions/curry";
import fmap from "./functions/fmap";
import id from "./functions/id";
import liftA2 from "./functions/liftA2";
import liftA3 from "./functions/liftA3";
import liftAn from "./functions/liftAn";
import ocurry from "./functions/ocurry";
import once from "./functions/once";

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
    liftAn,
    maybeToEither,
    ocurry,
    once,
    prop
};
