/* istanbul ignore file */

import Either, { maybeToEither } from "./adt/Either";
import Maybe, { eitherToMaybe, pick, prop } from "./adt/Maybe";
import Pair from "./adt/Pair";
import Reader from "./adt/Reader";
import State from "./adt/State";
import Task from "./adt/Task";
import assoc from "./function/assoc";
import bimap from "./function/bimap";
import caseOf from "./function/caseOf";
import chain from "./function/chain";
import compose from "./function/compose";
import constant from "./function/constant";
import curry from "./function/curry";
import fmap from "./function/fmap";
import id from "./function/id";
import liftA2 from "./function/liftA2";
import liftA3 from "./function/liftA3";
import liftAn from "./function/liftAn";
import ocurry from "./function/ocurry";
import once from "./function/once";

export default {
    Either,
    Maybe,
    Pair,
    Reader,
    State,
    Task,
    assoc,
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
    pick,
    prop,
};
