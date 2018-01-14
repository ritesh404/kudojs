import {
    id,
    once,
    fmap,
    bimap,
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

import Either from "./data-types/either";
import Maybe from "./data-types/maybe";
import Task from "./data-types/task";


//Algebraic Data Types

const Kudo = {
    id,
    once,
    fmap,
    bimap,
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
    Either,
    Maybe,
    Task
};

export default Kudo;
