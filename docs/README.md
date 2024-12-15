# KudoJS Documentation

KudoJS is a small utility library with a collection of popular Algebraic Data Types and Helper functions to help you write code in a functional programming style in Javascript.

## Overview

- [Helper Functions](helper-functions.md) - Documentation for all utility functions in the `kudoJS.*` namespace
- [ADT Documentation](#kudojs-algebraic-data-types) - Detailed documentation for each ADT implementation

### Algebraic Data Types (ADTs)

ADTs under the kudoJS.\* namespace. All of the data types are compatible with the [Fantasy Land Specifications](https://github.com/fantasyland/)

- [`kudoJS.Identity`](identity.md) - Type for handling pure values
- [`kudoJS.Pair`](pair.md) - Tuple type for handling two values
- [`kudoJS.Maybe`](maybe.md) - Type for handling nullable values safely
- [`kudoJS.Either`](either.md) - Type for handling branching and error cases
- [`kudoJS.Task`](task.md) - Type for handling asynchronous computations
- [`kudoJS.Reader`](reader.md) - Type for handling dependency injection
- [`kudoJS.State`](state.md) - Type for handling stateful computations

## ADT Reference

| ADT        |                          Constructors                          |           Static Methods           |                                                                                Instance Methods |
| ---------- | :------------------------------------------------------------: | :--------------------------------: | ----------------------------------------------------------------------------------------------: |
| `Identity` |                        `Identity`, `of`                        |                                    |                                  `equals`, `concat`,`ap`, `getValue`, `map`,`chain`, `toString` |
| `Pair`     |                          `Pair`, `of`                          |                                    | `equals`, `concat`, `fst`, `snd`, `ap`, `getValue`, `map`, `bimap`, `chain`, `swap`, `toString` |
| `Maybe`    | `of`, `Just`, `Nothing`, `zero`, `fromNullable`, `withDefault` | `catMaybes`, `isNothing`, `isJust` |            `equals`, `ap`, `alt`, `map`, `chain`, `toString`, `getValue`, `isNothing`, `isJust` |
| `Either`   |      `of`, `Left`, `Right`, `fromNullable`, `withDefault`      |     `try`, `isLeft`, `isRight`     |    `equals`, `ap`, `getValue`, `map`, `bimap`, `chain`, `swap`, `toString`, `isLeft`, `isRight` |
| `Task`     |                    `Task`, `of`, `rejected`                    |                                    |                     `fork`, `concat`, `ap`, `getValue`, `map`, `chain`, `toPromise`, `toString` |
| `Reader`   |                     `Reader`, `of`, `ask`                      |                                    |                                         `runWith`, `ap`, `getValue`, `map`, `chain`, `toString` |
| `State`    |                  `State`, `of`, `get`, `put`                   |                                    |                 `runWith`, `execWith`, `evalWith`, `ap`, `getValue`, `map`, `chain`, `toString` |

---
