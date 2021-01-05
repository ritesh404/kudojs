<p align="center">
  <img src="https://user-images.githubusercontent.com/7039911/35882138-2972170e-0ba9-11e8-8fcf-f96dfcb4d562.jpg">
</p>

[![npm (scoped)](https://img.shields.io/npm/v/fp-kudojs.svg)](https://www.npmjs.com/package/fp-kudojs)

---

KudoJS is a small utility library with a collection of popular Algebraic Data Types and Helper functions to help you write code in a functional programming style in Javascript.

### Installation
Install and save KudoJS as a dependency in your current project
```
$ npm install --save fp-kudojs
```
### Import using CommonJS
```
const kudoJS = require("fp-kudojs") 
```
### Import using JS Modules
```
import kudoJS from "fp-kudojs"
```
### IIFE
```
<script src="/path/to/kudo.iife.js"></script>
```
### Import single entities using CommonJS
```
const compose = require("fp-kudojs/function/compose");
const Maybe = require("fp-kudojs/adt/Maybe");
```
### Import single entities using JS Modules
```
import compose from "fp-kudojs/function/compose";
import Maybe from "fp-kudojs/adt/Maybe";
```

### Helper Functions

These are the functions under the `kudoJS.*` namespace 
* [`kudoJS.id`](docs/helper-functions.md#kudojsid)
* [`kudoJS.once`](docs/helper-functions.md#kudojsonce)
* [`kudoJS.curry`](docs/helper-functions.md#kudojscurry)
* [`kudoJS.ocurry`](docs/helper-functions.md#kudojsocurry)
* [`kudoJS.compose`](docs/helper-functions.md#kudojscompose)
* [`kudoJS.constant`](docs/helper-functions.md#kudojsconstant)
* [`kudoJS.fmap`](docs/helper-functions.md#kudojsfmap)
* [`kudoJS.bimap`](docs/helper-functions.md#kudojsbimap)
* [`kudoJS.chain`](docs/helper-functions.md#kudojschain)
* [`kudoJS.caseOf`](docs/helper-functions.md#kudojscaseof)
* [`kudoJS.liftAn`](docs/helper-functions.md#kudojsliftan)
* [`kudoJS.liftA2`](docs/helper-functions.md#kudojslifta2)
* [`kudoJS.liftA3`](docs/helper-functions.md#kudojslifta3)
* [`kudoJS.liftA4`](docs/helper-functions.md#kudojslifta4)
* [`kudoJS.liftA5`](docs/helper-functions.md#kudojslifta5)
* [`kudoJS.when`](docs/helper-functions.md#kudojswhen)
* [`kudoJS.prop`](docs/helper-functions.md#kudojsprop)
* [`kudoJS.eitherToMaybe`](docs/helper-functions.md#kudojseithertomaybe)
* [`kudoJS.maybeToEither`](docs/helper-functions.md#kudojsmaybeToEither)

---

### Algebraic Data Types (ADTs)

ADTs under the kudoJS.* namespace. All of the data types are compatible with the [Fantasy Land Specifications](https://github.com/fantasyland/) 

* [`kudoJS.Pair`](docs/pair.md)
* [`kudoJS.Maybe`](docs/maybe.md)
* [`kudoJS.Either`](docs/either.md)
* [`kudoJS.Task`](docs/task.md)
* [`kudoJS.Reader`](docs/reader.md)
* [`kudoJS.State`](docs/state.md)

| ADT           | Constructors  | Static Methods | Instance Methods  |
| ------------- |:-------------:|:-----------------:| ----:|
| `kudoJS.Pair`      | `Pair`, `of` || `equals`, `concat`, `fst`, `snd`, `ap`, `getValue`, `map`, `bimap`, `chain`, `swap`, `toString` |
| `kudoJS.Maybe`      | `of`, `Just`, `Nothing`, `zero`, `fromNullable`, `withDefault`    | `catMaybes`, `isNothing`, `isJust` |  `equals`, `ap`, `alt`, `map`, `chain`, `toString`, `getValue`, `isNothing`, `isJust` |
| `kudoJS.Either` |   `of`, `Left`, `Right`, `fromNullable`, `withDefault`    | `try`, `isLeft`, `isRight`   | `equals`, `ap`, `getValue`, `map`, `bimap`, `chain`, `swap`, `toString`, `isLeft`, `isRight` |
| `kudoJS.Task` |       `Task`, `of`, `rejected`           |     |  `fork`, `concat`, `ap`, `getValue`, `map`, `chain`, `toPromise`, `toString`|
| `kudoJS.Reader` |       `Reader`, `of`, `ask`           |     |  `runWith`, `ap`, `getValue`, `map`, `chain`, `toString`|
| `kudoJS.State` |       `State`, `of`, `get`, `put`           |     |  `runWith`, `execWith`, `evalWith`, `ap`, `getValue`, `map`, `chain`, `toString`|


---
### License

All code and documentation are (c) 2018 Ritesh Pillai and released under the MIT License. A copy of the MIT License [is also included](LICENSE.txt).
