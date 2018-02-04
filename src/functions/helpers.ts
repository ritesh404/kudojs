import { Functor, Monad, Apply, BiFunctor, PatternMatch } from "../interfaces";

const slice = Array.prototype.slice;

/** @function throwError
 * @param {string} x - Error message
 * @description Throw an error
 */
const throwError = (x: String) => {
  throw x;
};

/** @function id
 * @param {*} x - Any
 * @description Identity Function
 */
const id = (x: any): any => x;

/** @function isFunction
 * @param {*} f - Any
 * @description Check if supplied argument is
 */
const isFunction = (f: any) => typeof f === "function";

/** @function once
 * @param {Function} f - Function to be called once
 * @description Create a function which calls the given function only once
 */
const once = (f: Function) => {
  if (!isFunction(f)) throwError("Function not provided");
  let _called = false;
  let _result: any = undefined;

  return (...args: Array<any>) => {
    if (!_called) {
      _called = true;
      _result = f.apply(null, args);
    }
    return _result;
  };
};

/** @function curry
 * @param {Function} f - Function to be curried
 * @description Returns a curried equivalent of the provided function.
 */
const curry = (fn: Function): Function => {
  if (!isFunction(fn)) throwError("Function not provided");

  const arity = fn.length;
  return function curried() {
    let args = slice.call(arguments, 0);
    if (args.length >= arity) return fn.apply(null, args);

    return function() {
      return curried.apply(null, args.concat(slice.call(arguments)));
    };
  };
};

/** @function ncurry
 * @param {Function} fn - Function to be curried which accepts a single named argument object
 * @param {Array<string>} args - key names of the Function argument object
 * @description Returns a curried equivalent of the provided function which will accept named arguments in any order
 */
const ncurry = (fn: Function, args: Array<string>): Function => {
  if (!isFunction(fn)) throwError("Function not provided");
  if (fn.length > 1) throwError("Function Arity cannot be greater than 1");
  //if (typeof fn.arguments[0] !== "object") return throwError("Function argument must be an object type");
  //const args = Object.keys(fn.arguments[0]);

  return function curried(ar: Object): Function {
    const curArgs = Object.keys(ar);
    const diff = args.filter(x => curArgs.indexOf(x) < 0);
    if (diff.length > 0)
      return (ar2: Object): Function =>
        curried.call(null, (<any>Object).assign({}, ar, ar2));
    return fn.call(null, ar);
  };
};

/** @function compose
 * @param {...Function} fns - functions to compose
 * @description Performs right-to-left function composition.
 * @summary compose :: Function
 */
const compose = (...fns: Array<Function>): Function => {
  if (fns.length <= 0) throwError("Nothing to compose!");
  return fns.reduce((f, g) => (...args: Array<any>) => f(g(...args)));
};

/** @function fmap
 * @param {Function} fn - functions to be mapped
 * @param {Functor} f - Functor
 * @description Takes a function and a functor, applies the function to each of the functor's values, and returns a functor
 * @summary fmap :: Functor f => (a → b) → f a → f b
 */
const _fmap = (fn: Function, f: Functor): Functor => {
  if (!isFunction(fn)) throwError("function not provided");
  if (!f.map) throwError("Functor not found");
  return f.map.call(f, fn);
};
const fmap = curry(_fmap);

/** @function bimap
 * @param {Function} f1 - function to be mapped on left
 * @param {Function} f2 - function to be mapped on right
 * @param {BiFunctor} b - BiFunctor
 * @description Apply the first argument function to the left and the second argument function to a right of Bifunctor.
 * @summary bimap :: BiFunctor b => b a c ~> (a -> e) -> (c -> d) ->  b a c -> b e d
 */
const _bimap = (f1: Function, f2: Function, b: BiFunctor): BiFunctor => {
  if (!isFunction(f1) || !isFunction(f2)) throwError("Functions not provided");
  if (!b.bimap) throwError("BiFunctor not found");
  return b.bimap(f1, f2);
};
const bimap = curry(_bimap);

/** @function chain
 * @param {Function} fn - function that returns a monad
 * @param {Monad} m - Functor
 * @description Chain together in many computations
 * @summary chain :: Monad m => (a -> m b) -> m a -> m b
 */
const _chain = (f: Function, m: Monad): Monad => {
  if (!m.chain) throwError("chain not implemented");
  if (!isFunction(f)) throwError("function not provided");
  return m.chain.call(m, f);
};
const chain = curry(_chain);

/** @function caseOf
 * @param {Object} o - Pattern match id as Key and function as value
 * @param {PatternMatch} p - Pattern Match Object
 * @description match an expression to a pattern. When a match is found, it evaluates the expression and returns whatever value is produced.
 * @summary caseOf :: Object -> patternMatch -> a
 */
const _caseOf = (o: Object, p: PatternMatch): any =>
  !p.caseOf ? throwError("caseOf not implemented") : p.caseOf(o);
const caseOf = curry(_caseOf);

const _liftAn = (f: Function, fn: Array<Apply>) => {
  if (!isFunction(f)) throwError("Function not found");
  if (fn.length <= 0) throwError("No Apply found!");
  const init: Apply = fn[0].map(f);
  let res = init;
  if (fn.length > 1) {
    const rest = fn.slice(1);
    res = rest.reduce((a: Apply, ca: Apply) => ca.ap(a), init);
  }
  return res;
};
const _liftA1 = (f: Function, f1: Apply) => _liftAn(f, [f1]);
const _liftA2 = (f: Function, f1: Apply, f2: Apply) => _liftAn(f, [f1, f2]);
const _liftA3 = (f: Function, f1: Apply, f2: Apply, f3: Apply) =>
  _liftAn(f, [f1, f2, f3]);
const _liftA4 = (f: Function, f1: Apply, f2: Apply, f3: Apply, f4: Apply) =>
  _liftAn(f, [f1, f2, f3, f4]);
const _liftA5 = (
  f: Function,
  f1: Apply,
  f2: Apply,
  f3: Apply,
  f4: Apply,
  f5: Apply
) => _liftAn(f, [f1, f2, f3, f4, f5]);

/** @function liftAn
 * @param {Function} f - Function to be lifted
 * @param {...Apply} fn - Applys to the function
 * @description lets us combine n separate wrapped values into one with a given function.
 */
const liftAn = curry(_liftAn);

/** @function liftA1
 * @param {Function} f - Function to be lifted
 * @param {Apply} fn - 'Apply' to the function
 * @description Aka fmap
 */
const liftA1 = curry(_liftA1);

/** @function liftA2
 * @param {Function} f - Function to be lifted
 * @param {Apply} f1 - 'Apply' to the function
 * @param {Apply} f2 - 'Apply' to the function
 * @description lets us combine 2 separate wrapped values into one with a given function.
 */
const liftA2 = curry(_liftA2);

/** @function liftA3
 * @param {Function} f - Function to be lifted
 * @param {Apply} f1 - 'Apply' to the function
 * @param {Apply} f2 - 'Apply' to the function
 * @param {Apply} f3 - 'Apply' to the function
 * @description lets us combine 3 separate wrapped values into one with a given function.
 */
const liftA3 = curry(_liftA3);

/** @function liftA4
 * @param {Function} f - Function to be lifted
 * @param {Apply} f1 - 'Apply' to the function
 * @param {Apply} f2 - 'Apply' to the function
 * @param {Apply} f3 - 'Apply' to the function
 * @param {Apply} f4 - 'Apply' to the function
 * @description lets us combine 4 separate wrapped values into one with a given function.
 */
const liftA4 = curry(_liftA4);

/** @function liftA2
 * @param {Function} f - Function to be lifted
 * @param {Apply} f1 - 'Apply' to the function
 * @param {Apply} f2 - 'Apply' to the function
 * @param {Apply} f3 - 'Apply' to the function
 * @param {Apply} f4 - 'Apply' to the function
 * @param {Apply} f5 - 'Apply' to the function
 * @description lets us combine 2 separate wrapped values into one with a given function.
 */
const liftA5 = curry(_liftA5);

export {
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
};
