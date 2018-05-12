# KudoJS Docs


* See [Helper Functions](helper-functions.md) for documentation on all the methods in the kudoJS.* namespace.


### KudoJS Algebraic Data Types

ADTs under the kudoJS.* namespace. All of the data types are compatible with the [Fantasy Land Specifications](https://github.com/fantasyland/). For the full documentation of each data type refer to the following: 

* [`kudoJS.Pair`](pair.md)
* [`kudoJS.Maybe`](maybe.md)
* [`kudoJS.Either`](either.md)
* [`kudoJS.Task`](task.md)
* [`kudoJS.Reader`](reader.md)

### Summary

| ADT           | Constructors  | Static Methods | Instance Methods  |
| ------------- |:-------------:|:-----------------:| ----:|
| `kudoJS.Pair`      | `Pair`, `of` || `equals`, `concat`, `fst`, `snd`, `ap`, `getValue`, `map`, `bimap`, `chain`, `swap`, `toString` |
| `kudoJS.Maybe`      | `of`, `Just`, `Nothing`, `zero`, `fromNullable`, `withDefault`    | `catMaybes`, `isNothing`, `isJust` |  `equals`, `ap`, `alt`, `map`, `chain`, `toString`, `getValue`, `isNothing`, `isJust` |
| `kudoJS.Either` |   `of`, `Left`, `Right`, `fromNullable`, `withDefault`    | `try`, `isLeft`, `isRight`   | `equals`, `ap`, `getValue`, `map`, `bimap`, `chain`, `swap`, `toString`, `isLeft`, `isRight` |
| `kudoJS.Task` |       `Task`, `of`, `rejected`           |     |  `fork`, `concat`, `ap`, `getValue`, `map`, `chain`, `toPromise`, `toString`|
| `kudoJS.Reader` |       `Reader`, `of`, `ask`           |     |  `runWith`, `ap`, `getValue`, `map`, `chain`, `toString`|

---