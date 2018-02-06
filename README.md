# KudoJS
---
KudoJS is a small utility library with a collection of popular Algebraic Data Types and Helper functions to help you write code in a functional programming style in Javascript.
### Installation

Install and save KudoJS as a dependency in your current project
```
$ npm install --save fp-kudojs
```
### Using with CommonJS
```
const kudoJS = require("fp-kudojs") 
```
### Using ES Modules
```
import kudoJS from "fp-kudojs"
```
### Using without modules
```
<script src="/path/to/kudo.umd.js"></script>
```
### Helper Functions

These are the functions under the `kudoJS.*` namespace 
* [`kudoJS.id`](#kjsid)
----
### `kudoJS.id`
Returns the value given to it. 

`id(x: any): any`

----
### `kudoJS.once`
Returns a function that when called fires the passed function only once

`once(f: Function): Function`

----

### `kudoJS.curry`

Returns a curried equivalent of the provided function

`curry(fn: Function): Function`

----

### `kudoJS.ncurry`
Returns a curried equivalent of the provided function which will accept named arguments in any order

`ncurry(fn: Function, args: Array<string>): Function`

* **Parameters:**
	- ***fn: Function:*** Function to be curried and that which accepts a single named argument object
    - ***args: Array<string>:*** Array of key names of the function named argument object

----

### `kudoJS.compose`

Performs right-to-left function composition.

`compose(...fns: Function): Function`

----

### `kudoJS.fmap`

Takes a function and a functor, applies the function to each of the functor's values, and returns a functor

`fmap(fn: (a: A) => B, f: Functor<A>): Functor<B>`

----

### `kudoJS.bimap`

Maps both sides of the disjunction

`bimap(f1: (a: A) => C, f2: (b: B) => D, b: BiFunctor<A, B>): BiFunctor<C, D>`

----

### `kudoJS.chain`

Chain together in many computations of the same type

`chain(f: (a: A) => Monad<B>, m: Monad<A>): Monad<B>`

----

### `kudoJS.caseOf`

Conditional behaviour based on the structure of algebraic data types

`caseOf(o: Object, p: ADT): any`

* **Parameters**
    - ***o: Object:*** An Object with key as ADT constructor name and value as function expression
    - ***p: ADT*** An ADT that supports pattern matching

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

----

### `kudoJS.liftA1`

AKA fmap.

`liftA1(f: (a: A) => B, a1: Apply<A>): Apply<B>`

----

### `kudoJS.liftA2`

lets us combine 2 separate wrapped values into one with a given function.

`liftA2(f: (a1: A, a2: A) => B, ar1: Apply<A>, ar2: Apply<A>): Apply<B>`

----

### `kudoJS.liftA3`

lets us combine 3 separate wrapped values into one with a given function.

`liftA3(f: (a1: A, a2: A, a3: A) => B, ar1: Apply<A>, ar2: Apply<A>, ar3: Apply<A>): Apply<B>`

----

### `kudoJS.liftA4`

lets us combine 4 separate wrapped values into one with a given function.

`liftA4(f: (a1: A, a2: A, a3: A, a4: A) => B, ar1: Apply<A>, ar2: Apply<A>, ar3: Apply<A>, ar4: Apply<A>): Apply<B>`

----

### `kudoJS.liftA5`

lets us combine 5 separate wrapped values into one with a given function.

`liftA5(f: (a1: A, a2: A, a3: A, a4: A, a5: A) => B, ar1: Apply<A>, ar2: Apply<A>, ar3: Apply<A>, ar4: Apply<A>, ar5: Apply<A>): Apply<B>`

----

### `kudoJS.eitherToMaybe`
Converts a Either type to an Maybe Type

`eitherToMaybe(e: Either<A, B>): Maybe<A, B>`

----

### `kudoJS.maybeToEither`
Converts a Maybe type to an Either Type

`maybeToEither(m: Maybe<A, B>): Either<A, B>`

----

### Algebraic Data Types (ADTs)

***TODO: Documentation!***

---
### License

All code and documentation are (c) 2018 Ritesh Pillai and released under the MIT License. A copy of the MIT License [is also included](LICENSE.txt).
