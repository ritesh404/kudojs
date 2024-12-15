# KudoJS Helper Functions

These are the functions under the `kudoJS.*` namespace:

- [KudoJS Helper Functions](#kudojs-helper-functions)
    - [`kudoJS.id`](#kudojsid)
    - [`kudoJS.once`](#kudojsonce)
    - [`kudoJS.curry`](#kudojscurry)
    - [`kudoJS.ocurry`](#kudojsocurry)
    - [`kudoJS.compose`](#kudojscompose)
    - [`kudoJS.constant`](#kudojsconstant)
    - [`kudoJS.fmap`](#kudojsfmap)
    - [`kudoJS.assoc`](#kudojsassoc)
    - [`kudoJS.bimap`](#kudojsbimap)
    - [`kudoJS.chain`](#kudojschain)
    - [`kudoJS.caseOf`](#kudojscaseof)
    - [`kudoJS.liftAn`](#kudojsliftan)
    - [`kudoJS.liftA2`](#kudojslifta2)
    - [`kudoJS.liftA3`](#kudojslifta3)
    - [`kudoJS.liftA4`](#kudojslifta4)
    - [`kudoJS.liftA5`](#kudojslifta5)
    - [`kudoJS.when`](#kudojswhen)
    - [`kudoJS.prop`](#kudojsprop)
    - [`kudoJS.pick`](#kudojspick)
    - [`kudoJS.eitherToMaybe`](#kudojseithertomaybe)
    - [`kudoJS.maybeToEither`](#kudojsmaybetoeither)

---

### `kudoJS.id`

The identity function. It returns the value given to it.

`id(x: any): any`

| Param | Type            | Description |
| ----- | --------------- | ----------- |
| x     | <code>\*</code> | Any         |

---

### `kudoJS.once`

Returns a function that, when called, fires the passed function only once.

`once(f: Function): Function`

| Param | Type                  | Description                |
| ----- | --------------------- | -------------------------- |
| f     | <code>function</code> | Function to be called once |

---

### `kudoJS.curry`

Returns a curried equivalent of the provided function.

`curry(fn: Function): Function`

| Param | Type                  | Description            |
| ----- | --------------------- | ---------------------- |
| fn    | <code>function</code> | Function to be curried |

---

### `kudoJS.ocurry`

Returns a curried equivalent of the provided function, which will accept named arguments in any order.

`ocurry(fn: Function, args: Array<string>): Function`

| Param | Type                              | Description                                                        |
| ----- | --------------------------------- | ------------------------------------------------------------------ |
| fn    | <code>function</code>             | Function to be curried that accepts a single named argument object |
| args  | <code>Array.&lt;string&gt;</code> | Array of key names of the function's named argument object         |

---

### `kudoJS.compose`

Performs right-to-left function composition.

`compose(...fns: Function): Function`

| Param  | Type                  | Description          |
| ------ | --------------------- | -------------------- |
| ...fns | <code>function</code> | Functions to compose |

---

### `kudoJS.constant`

Takes any value and returns a function that will return the same value, no matter what you pass to it.

`constant(x: any): any`

| Param | Type            | Description |
| ----- | --------------- | ----------- |
| x     | <code>\*</code> | Any         |

---

### `kudoJS.fmap`

Takes a function and a functor, applies the function to each of the functor's values, and returns a functor.

`fmap(fn: (a: A) => B, f: Functor<A>): Functor<B>`

| Param | Type                  | Description           |
| ----- | --------------------- | --------------------- |
| fn    | <code>function</code> | Function to be mapped |
| f     | <code>Functor</code>  | Functor               |

---

### `kudoJS.assoc`

Associates a value with the specified key in the object and returns a clone of the original object.

`assoc(key: string, value: A, o: {[k:string]: A}): {[k:string]: A}`

| Param | Type                | Description                                                    |
| ----- | ------------------- | -------------------------------------------------------------- |
| key   | <code>string</code> | Key                                                            |
| value | <code>any</code>    | Value to be assigned to the key in the object                  |
| o     | <code>Object</code> | Object to which the value needs to be assigned against the key |

---

### `kudoJS.bimap`

Maps both sides of the disjunction.

`bimap(f1: (a: A) => C, f2: (b: B) => D, b: BiFunctor<A, B>): BiFunctor<C, D>`

| Param | Type                   | Description                                                 |
| ----- | ---------------------- | ----------------------------------------------------------- |
| f1    | <code>function</code>  | Function to be applied on the left side of the disjunction  |
| f2    | <code>function</code>  | Function to be applied on the right side of the disjunction |
| b     | <code>BiFunctor</code> | BiFunctor                                                   |

---

### `kudoJS.chain`

Chains together many computations of the same type.

`chain(f: (a: A) => Monad<B>, m: Monad<A>): Monad<B>`

| Param | Type                  | Description                   |
| ----- | --------------------- | ----------------------------- |
| f     | <code>function</code> | Function that returns a Monad |
| m     | <code>Monad</code>    | Monad                         |

---

### `kudoJS.caseOf`

Conditional behavior based on the structure of algebraic data types.

`caseOf(o: Object, p: ADT): any`

| Param | Type                      | Description                                                                         |
| ----- | ------------------------- | ----------------------------------------------------------------------------------- |
| o     | <code>Object</code>       | An object with key as the ADT constructor name and value as the function expression |
| p     | <code>PatternMatch</code> | An ADT that supports pattern matching                                               |

**Example:**

```
import {caseOf, Maybe} from "fp-kudojs";

const j1 = Maybe.Just(1);

const k1 = caseOf({
	Nothing: () => null,
	Just: (v) => v+1
}, j1);
//k1 = 2;
```

---

### `kudoJS.liftAn`

Combines `n` separate wrapped values into one with a given function.

`liftAn(f: (a: A ...an: A) => B, ar: Array<Apply<A>>): Apply<B>`

| Param | Type                  | Description                                                                                      |
| ----- | --------------------- | ------------------------------------------------------------------------------------------------ |
| f     | <code>function</code> | Function with `n` arguments to be lifted                                                         |
| ar    | <code>Apply</code>    | Array of wrapped values (`Apply<A>`). The values will be passed as arguments to the function `f` |

---

### `kudoJS.liftA2`

Combines 2 separate wrapped values into one with a given function.

`liftA2(f: (a1: A, a2: A) => B, ar1: Apply<A>, ar2: Apply<A>): Apply<B>`

| Param | Type                  | Description           |
| ----- | --------------------- | --------------------- |
| f     | <code>function</code> | Function to be lifted |
| ar1   | <code>Apply</code>    | Wrapped value (Apply) |
| ar2   | <code>Apply</code>    | Wrapped value (Apply) |

---

### `kudoJS.liftA3`

Combines 3 separate wrapped values into one with a given function.

`liftA3(f: (a1: A, a2: A, a3: A) => B, ar1: Apply<A>, ar2: Apply<A>, ar3: Apply<A>): Apply<B>`

| Param | Type                  | Description           |
| ----- | --------------------- | --------------------- |
| f     | <code>function</code> | Function to be lifted |
| ar1   | <code>Apply</code>    | Wrapped value (Apply) |
| ar2   | <code>Apply</code>    | Wrapped value (Apply) |
| ar3   | <code>Apply</code>    | Wrapped value (Apply) |

---

### `kudoJS.liftA4`

Combines 4 separate wrapped values into one with a given function.

`liftA4(f: (a1: A, a2: A, a3: A, a4: A) => B, ar1: Apply<A>, ar2: Apply<A>, ar3: Apply<A>, ar4: Apply<A>): Apply<B>`

| Param | Type                  | Description           |
| ----- | --------------------- | --------------------- |
| f     | <code>function</code> | Function to be lifted |
| ar1   | <code>Apply</code>    | Wrapped value (Apply) |
| ar2   | <code>Apply</code>    | Wrapped value (Apply) |
| ar3   | <code>Apply</code>    | Wrapped value (Apply) |
| ar4   | <code>Apply</code>    | Wrapped value (Apply) |

---

### `kudoJS.liftA5`

Combines 5 separate wrapped values into one with a given function.

`liftA5(f: (a1: A, a2: A, a3: A, a4: A, a5: A) => B, ar1: Apply<A>, ar2: Apply<A>, ar3: Apply<A>, ar4: Apply<A>, ar5: Apply<A>): Apply<B>`

| Param | Type                  | Description           |
| ----- | --------------------- | --------------------- |
| f     | <code>function</code> | Function to be lifted |
| ar1   | <code>Apply</code>    | Wrapped value (Apply) |
| ar2   | <code>Apply</code>    | Wrapped value (Apply) |
| ar3   | <code>Apply</code>    | Wrapped value (Apply) |
| ar4   | <code>Apply</code>    | Wrapped value (Apply) |
| ar5   | <code>Apply</code>    | Wrapped value (Apply) |

---

### `kudoJS.when`

Returns a function that takes one argument and passes it to the given predicate function. If the predicate is satisfied, `f` is run with the same argument. If the predicate is not satisfied, the argument is returned as is.

`when(p: Function, f: Function): Function`

| Param | Type                  | Description                                                                     |
| ----- | --------------------- | ------------------------------------------------------------------------------- |
| p     | <code>function</code> | Predicate function that returns `true` or `false` based on the argument passed  |
| f     | <code>function</code> | Function to be executed with the given argument when the predicate is satisfied |

---

### `kudoJS.prop`

Returns a **Maybe Just** if a value exists for the given key; otherwise, returns a **Nothing**.

`prop(key: string | number, o: { [k: string]: A; [k: number]: A }): Maybe<A>`

| Param | Type                | Description      |
| ----- | ------------------- | ---------------- | --- |
| key   | <code>string        | number</code>    | Key |
| o     | <code>Object</code> | Key-Value Object |

---

### `kudoJS.pick`

Returns a **Maybe Just** containing the object with only the specified keys if values exist for the given keys; otherwise, returns a **Nothing**.

`pick(keys: Array<string>, o: { [k: string]: A }): Maybe<{[k: string]: A}>`

| Param | Type                       | Description      |
| ----- | -------------------------- | ---------------- |
| keys  | <code>Array<string></code> | Keys             |
| o     | <code>Object</code>        | Key-Value Object |

---

### `kudoJS.eitherToMaybe`

Converts an **Either** type to a **Maybe** type.

`eitherToMaybe(e: Either<A, B>): Maybe<A>`

| Param | Type                | Description |
| ----- | ------------------- | ----------- |
| e     | <code>Either</code> | Either type |

---

### `kudoJS.maybeToEither`

Converts a **Maybe** type to an **Either** type.

`maybeToEither(m: Maybe<A>): Either<A>`

| Param | Type               | Description |
| ----- | ------------------ | ----------- |
| m     | <code>Maybe</code> | Maybe type  |

---

TODO: Add more documentation and examples
