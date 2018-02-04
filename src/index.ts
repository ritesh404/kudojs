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
} from "./functions/helpers";

//Algebraic Data Types
import Pair from "./data-types/pair";
import Either from "./data-types/either";
import Maybe from "./data-types/maybe";
import Task from "./data-types/task";

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
