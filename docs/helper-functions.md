# KudoJS Helper Functions
These are the functions under the `kudoJS.*` namespace 

* [`kudoJS.id`](#kudojsid)
* [`kudoJS.once`](#kudojsonce)
* [`kudoJS.curry`](#kudojscurry)
* [`kudoJS.ncurry`](#kudojsncurry)
* [`kudoJS.compose`](#kudojscompose)
* [`kudoJS.constant`](#kudojsconstant)
* [`kudoJS.fmap`](#kudojsfmap)
* [`kudoJS.bimap`](#kudojsbimap)
* [`kudoJS.chain`](#kudojschain)
* [`kudoJS.caseOf`](#kudojscaseof)
* [`kudoJS.liftAn`](#kudojsliftan)
* [`kudoJS.liftA1`](#kudojslifta1)
* [`kudoJS.liftA2`](#kudojslifta2)
* [`kudoJS.liftA3`](#kudojslifta3)
* [`kudoJS.liftA4`](#kudojslifta4)
* [`kudoJS.liftA5`](#kudojslifta5)
* [`kudoJS.when`](#kudojswhen)
* [`kudoJS.prop`](#kudojsprop)
* [`kudoJS.eitherToMaybe`](#kudojseithertomaybe)
* [`kudoJS.maybeToEither`](#kudojsmaybeToEither)

----
### `kudoJS.id`
Identity function. Returns the value given to it

`id(x: any): any`

| Param | Type | Description |
| --- | --- | --- |
| x | <code>\*</code> | Any |

----
### `kudoJS.once`
Returns a function that when called fires the passed function only once

`once(f: Function): Function`

| Param | Type | Description |
| --- | --- | --- |
| f | <code>function</code> | Function to be called once |


----

### `kudoJS.curry`

Returns a curried equivalent of the provided function

`curry(fn: Function): Function`

| Param | Type | Description |
| --- | --- | --- |
| fn | <code>function</code> | Function to be curried |

----

### `kudoJS.ncurry`
Returns a curried equivalent of the provided function which will accept named arguments in any order

`ncurry(fn: Function, args: Array<string>): Function`

| Param | Type | Description |
| --- | --- | --- |
| fn | <code>function</code> | Function to be curried and that which accepts a single named argument object |
| args | <code>Array.&lt;string&gt;</code> | Array of key names of the function named argument object |


----

### `kudoJS.compose`

Performs right-to-left function composition

`compose(...fns: Function): Function`


| Param | Type | Description |
| --- | --- | --- |
| ...fns | <code>function</code> | functions to compose |


----
### `kudoJS.constant`
Takes any value and gives back a function that will return that same value no matter what you pass it

`constant(x: any): any`

| Param | Type | Description |
| --- | --- | --- |
| x | <code>\*</code> | Any |

----

### `kudoJS.fmap`

Takes a function and a functor, applies the function to each of the functor's values, and returns a functor

`fmap(fn: (a: A) => B, f: Functor<A>): Functor<B>`

| Param | Type | Description |
| --- | --- | --- |
| fn | <code>function</code> | function to be mapped |
| f | <code>Functor</code> | Functor |

----

### `kudoJS.bimap`

Maps both sides of the disjunction

`bimap(f1: (a: A) => C, f2: (b: B) => D, b: BiFunctor<A, B>): BiFunctor<C, D>`


| Param | Type | Description |
| --- | --- | --- |
| f1 | <code>function</code> | function to be mapped on the left of the disjunction |
| f2 | <code>function</code> | function to be mapped on the right of the disjunction |
| b | <code>BiFunctor</code> | BiFunctor |

----

### `kudoJS.chain`

Chain together in many computations of the same type

`chain(f: (a: A) => Monad<B>, m: Monad<A>): Monad<B>`

| Param | Type | Description |
| --- | --- | --- |
| fn | <code>function</code> | function that returns a Monad |
| m | <code>Monad</code> | Monad |

----

### `kudoJS.caseOf`

Conditional behaviour based on the structure of algebraic data types

`caseOf(o: Object, p: ADT): any`

| Param | Type | Description |
| --- | --- | --- |
| o | <code>Object</code> | An Object with key as ADT constructor name and value as function expression|
| p | <code>PatternMatch</code> | An ADT that supports pattern matching |

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
----

### `kudoJS.liftAn`

lets us combine n separate wrapped values into one with a given function.

`liftAn(f: (a: A ...an: A) => B, ar: Array<Apply<A>>): Apply<B>`

| Param | Type | Description |
| --- | --- | --- |
| a | <code>function</code> | Function with n arguments to be lifted |
| ar | <code>Apply</code> | Array of wrapped values(Apply<A>). The values of which will be passed as arguments to the function `a`  |

----

### `kudoJS.liftA1`

AKA fmap.

`liftA1(f: (a: A) => B, a1: Apply<A>): Apply<B>`

| Param | Type | Description |
| --- | --- | --- |
| f | <code>function</code> | Function to be lifted |
| a1 | <code>Apply</code> | Wrapped value(Apply) |

----

### `kudoJS.liftA2`

lets us combine 2 separate wrapped values into one with a given function.

`liftA2(f: (a1: A, a2: A) => B, ar1: Apply<A>, ar2: Apply<A>): Apply<B>`

| Param | Type | Description |
| --- | --- | --- |
| f | <code>function</code> | Function to be lifted |
| a1 | <code>Apply</code> | Wrapped value(Apply) |
| a2 | <code>Apply</code> | Wrapped value(Apply) |

----

### `kudoJS.liftA3`

lets us combine 3 separate wrapped values into one with a given function.

`liftA3(f: (a1: A, a2: A, a3: A) => B, ar1: Apply<A>, ar2: Apply<A>, ar3: Apply<A>): Apply<B>`

| Param | Type | Description |
| --- | --- | --- |
| f | <code>function</code> | Function to be lifted |
| a1 | <code>Apply</code> | Wrapped value(Apply) |
| a2 | <code>Apply</code> | Wrapped value(Apply) |
| a3 | <code>Apply</code> | Wrapped value(Apply) |

----

### `kudoJS.liftA4`

lets us combine 4 separate wrapped values into one with a given function.

`liftA4(f: (a1: A, a2: A, a3: A, a4: A) => B, ar1: Apply<A>, ar2: Apply<A>, ar3: Apply<A>, ar4: Apply<A>): Apply<B>`

| Param | Type | Description |
| --- | --- | --- |
| f | <code>function</code> | Function to be lifted |
| a1 | <code>Apply</code> | Wrapped value(Apply) |
| a2 | <code>Apply</code> | Wrapped value(Apply) |
| a3 | <code>Apply</code> | Wrapped value(Apply) |
| a4 | <code>Apply</code> | Wrapped value(Apply) |

----

### `kudoJS.liftA5`

lets us combine 5 separate wrapped values into one with a given function.

`liftA5(f: (a1: A, a2: A, a3: A, a4: A, a5: A) => B, ar1: Apply<A>, ar2: Apply<A>, ar3: Apply<A>, ar4: Apply<A>, ar5: Apply<A>): Apply<B>`

| Param | Type | Description |
| --- | --- | --- |
| f | <code>function</code> | Function to be lifted |
| a1 | <code>Apply</code> | Wrapped value(Apply) |
| a2 | <code>Apply</code> | Wrapped value(Apply) |
| a3 | <code>Apply</code> | Wrapped value(Apply) |
| a4 | <code>Apply</code> | Wrapped value(Apply) |
| a5 | <code>Apply</code> | Wrapped value(Apply) |

----

### `kudoJS.when`
Returns a function for which it takes one argument and passes it to the given predicate function. If the predicate is satisfied, f is run with the same argument. If the predicate is not satisfied, the argument is returned as is.

`when(p: Function, f: Function): Function`

| Param | Type | Description |
| --- | --- | --- |
| p | <code>function</code> | Predicate function. Should return true or false based on the argument passed |
| f | <code>function</code> | Function to be executed with the given argument when predicate is satisfied |

----

### `kudoJS.prop`
Returns a Maybe Just if value exists for the given key else returns a Nothing

`prop( key: string | number, o: { [k: string]: A; [k: number]: A }): Maybe<A>`

| Param | Type | Description |
| --- | --- | --- |
| key | <code>string | number</code> | Key |
| o | <code>Object</code> | Key Value Object |

----

### `kudoJS.eitherToMaybe`
Converts an Either type to a Maybe Type

`eitherToMaybe(e: Either<A, B>): Maybe<A, B>`

| Param | Type | Description |
| --- | --- | --- |
| m | <code>Maybe</code> | Maybe type |

----

### `kudoJS.maybeToEither`
Converts a Maybe type to an Either Type

`maybeToEither(m: Maybe<A, B>): Either<A, B>`

| Param | Type | Description |
| --- | --- | --- |
| m | <code>Maybe</code> | Maybe type |

----

TODO: Add more documentation and examples 
