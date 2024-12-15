<a name="Either"></a>

## Either

`Either` is a monad and can be used as a generic structure for a type with two possibilities: a **Left a** or a **Right b**. It represents the logical disjunction between `a` and `b`.

A common use of this structure is to handle error cases and situations where a computation might fail, while also providing additional information about the failure. It is used to represent a value that is either correct or an error. By convention, the **Left** constructor is used to hold an error value, and the **Right** constructor is used to hold a correct value. This structure forces explicit handling of failures and avoids the problems associated with throwing exceptions.

**Implements:** <code>[BiFunctor](https://github.com/fantasyland/fantasy-land#bifunctor)</code>, <code>[Monad](https://github.com/fantasyland/fantasy-land#monad)</code>, <code>[Setoid](https://github.com/fantasyland/fantasy-land#setoid)</code>

- [Either](#either)
    - [Either.of(v)](#eitherofv)
    - [Either.Right(v)](#eitherrightv)
    - [Either.Left(v)](#eitherleftv)
    - [Either.fromNullable(v)](#eitherfromnullablev)
    - [Either.withDefault(def, v)](#eitherwithdefaultdef-v)
    - [Either.swap()](#eitherswap)
    - [Either.try(f)](#eithertryf)
    - [Either.bimap(e, fl, fr)](#eitherbimape-fl-fr)
    - [Either.isLeft(e)](#eitherislefte)
    - [Either.isRight(e)](#eitherisrighte)
    - [Either.equals(n)](#eitherequalsn)
    - [Either.map(f)](#eithermapf)
    - [Either.bimap(fl, fr)](#eitherbimapfl-fr)
    - [Either.chain(f)](#eitherchainf)
    - [Either.swap()](#eitherswap-1)
    - [Either.isLeft()](#eitherisleft)
    - [Either.isRight()](#eitherisright)
    - [Either.ap(j)](#eitherapj)
    - [Either.getValue()](#eithergetvalue)

<a name="Either.of"></a>

### Either.of(v)

Creates a **Right** `Either`.

| Param | Type             | Description |
| ----- | ---------------- | ----------- |
| v     | <code>any</code> | Value       |

<a name="Either.Right"></a>

### Either.Right(v)

Creates a **Right** `Either`.

| Param | Type             | Description |
| ----- | ---------------- | ----------- |
| v     | <code>any</code> | Value       |

<a name="Either.Left"></a>

### Either.Left(v)

Creates a **Left** `Either`.

| Param | Type             | Description |
| ----- | ---------------- | ----------- |
| v     | <code>any</code> | Value       |

<a name="Either.fromNullable"></a>

### Either.fromNullable(v)

Creates a **Right** if the value is not `null` or `undefined`; otherwise, creates a **Left**.

| Param | Type             | Description |
| ----- | ---------------- | ----------- |
| v     | <code>any</code> | Value       |

<a name="Either.withDefault"></a>

### Either.withDefault(def, v)

Creates a **Right** if the value `v` is not `null` or `undefined`; otherwise, creates a **Right** with the default value `def`.

| Param | Type             | Description   |
| ----- | ---------------- | ------------- |
| def   | <code>any</code> | Default value |
| v     | <code>any</code> | Value         |

<a name="Either.swap"></a>

### Either.swap()

Swaps the **Left** and **Right** elements of the current `Either`.

<a name="Either.try"></a>

### Either.try(f)

Executes the passed function that may throw and converts it to an `Either` type.

| Param | Type                  | Description                        |
| ----- | --------------------- | ---------------------------------- |
| f     | <code>function</code> | A function that may throw an error |

<a name="Either.bimap"></a>

### Either.bimap(e, fl, fr)

A static method that applies `fl` to the **Left** element or `fr` to the **Right** element of the current `Either`.

| Param | Type                  | Description                                     |
| ----- | --------------------- | ----------------------------------------------- |
| e     | <code>any</code>      | `Either` type                                   |
| fl    | <code>function</code> | Function to be applied on the **Left** element  |
| fr    | <code>function</code> | Function to be applied on the **Right** element |

<a name="Either.isLeft"></a>

### Either.isLeft(e)

A static method that returns `true` if the passed `Either` is a **Left**.

| Param | Type             | Description   |
| ----- | ---------------- | ------------- |
| e     | <code>any</code> | `Either` type |

<a name="Either.isRight"></a>

### Either.isRight(e)

A static method that returns `true` if the passed `Either` is a **Right**.

| Param | Type             | Description   |
| ----- | ---------------- | ------------- |
| e     | <code>any</code> | `Either` type |

<a name="Either.equals"></a>

### Either.equals(n)

Returns `true` if the current and the passed element are of `Either` type with the same value.

| Param | Type             | Description                |
| ----- | ---------------- | -------------------------- |
| n     | <code>any</code> | Any value of type `Setoid` |

<a name="Either.map"></a>

### Either.map(f)

Applies the passed function to the value of the current `Either` if it is a **Right**.

| Param | Type                  | Description |
| ----- | --------------------- | ----------- |
| f     | <code>function</code> | Function    |

<a name="Either.bimap"></a>

### Either.bimap(fl, fr)

Applies `fl` to the **Left** element or `fr` to the **Right** element of the current `Either`.

| Param | Type                  | Description                                     |
| ----- | --------------------- | ----------------------------------------------- |
| fl    | <code>function</code> | Function to be applied on the **Left** element  |
| fr    | <code>function</code> | Function to be applied on the **Right** element |

<a name="Either.chain"></a>

### Either.chain(f)

An instance method that can chain together many computations that return an `Either` type.

| Param | Type                  | Description                            |
| ----- | --------------------- | -------------------------------------- |
| f     | <code>function</code> | Function that returns another `Either` |

<a name="Either.swap"></a>

### Either.swap()

Swaps the **Left** and **Right** elements of the current `Either`.

<a name="Either.isLeft"></a>

### Either.isLeft()

An instance method that returns `true` if the current `Either` is a **Left**.

<a name="Either.isRight"></a>

### Either.isRight()

An instance method that returns `true` if the current `Either` is a **Right**.

<a name="Either.ap"></a>

### Either.ap(j)

Applies the function inside the passed `Either` to the current `Either` if it is a **Right**.

| Param | Type             | Description              |
| ----- | ---------------- | ------------------------ |
| j     | <code>any</code> | `Either` with a function |

<a name="Either.getValue"></a>

### Either.getValue()

Gets the value inside the `Either`.
