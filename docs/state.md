<a name="State"></a>

## State

`State` is parameterized by two types: a state `<code>s</code>` and a result `<code>a</code>`.  
`State` should wrap a function of the form `<code>s -> Pair a s</code>` and can be constructed by providing a function of this form. There are three methods available on the `State` for running with a given initial state.

**Implements:** <code>[Monad](https://github.com/fantasyland/fantasy-land#monad)</code>

- [State](#state)
    - [State(f)](#statef)
    - [State.of(v)](#stateofv)
    - [State.toString()](#statetostring)
    - [State.map(f)](#statemapf)
    - [State.getValue()](#stategetvalue)
    - [State.ap(t)](#stateapt)
    - [State.chain(f)](#statechainf)
    - [State.runWith(s)](#staterunwiths)
    - [State.execWith(s)](#stateexecwiths)
    - [State.evalWith(s)](#stateevalwiths)

<a name="new_State_new"></a>

### State(f)

The `State` constructor.

| Param | Type                  | Description                                                                                                                         |
| ----- | --------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| f     | <code>function</code> | A function of the form `s -> Pair a` that is wrapped by the `State`. Nothing is executed until it is run with an initial state `s`. |

<a name="State.of"></a>

### State.of(v)

The `State` constructor that populates the right portion with its argument. `of` essentially lifts a value of type `a` into a `State`.

| Param | Type             | Description                                        |
| ----- | ---------------- | -------------------------------------------------- |
| v     | <code>any</code> | Any value that needs to be lifted into the `State` |

<a name="State.toString"></a>

### State.toString()

Gets a stringified version of the `State`.

<a name="State.map"></a>

### State.map(f)

Applies the function `f` to the right portion of the `State`.

| Param | Type                  | Description |
| ----- | --------------------- | ----------- |
| f     | <code>function</code> | Function    |

<a name="State.getValue"></a>

### State.getValue()

Gets the function within the `State`.

<a name="State.ap"></a>

### State.ap(t)

`ap` allows for values wrapped in a `State` to be applied to functions also wrapped in a `State`. In order to use `ap`, the `State` must contain a function as its value on the right side.

| Param | Type                         | Description                                    |
| ----- | ---------------------------- | ---------------------------------------------- |
| t     | [<code>State</code>](#State) | A `State` with a function as its right element |

<a name="State.chain"></a>

### State.chain(f)

Chains together many computations that return a `State`.

| Param | Type                  | Description                           |
| ----- | --------------------- | ------------------------------------- |
| f     | <code>function</code> | Function that returns another `State` |

<a name="State.runWith"></a>

### State.runWith(s)

Since `State` is a lazy datatype that requires an initial state to run, it provides a `runWith` method that takes in an initial state and returns the result of the computation as a `<code>Pair result state</code>`.

| Param | Type             | Description                                             |
| ----- | ---------------- | ------------------------------------------------------- |
| s     | <code>any</code> | An initial state that needs to be passed to the `State` |

<a name="State.execWith"></a>

### State.execWith(s)

When called, `execWith` will run the state transition with the given value as the initial state and return the state.

| Param | Type             | Description                                             |
| ----- | ---------------- | ------------------------------------------------------- |
| s     | <code>any</code> | An initial state that needs to be passed to the `State` |

<a name="State.evalWith"></a>

### State.evalWith(s)

When called, `evalWith` will run the state transition with the given value as the initial state and return the result.

| Param | Type             | Description                                             |
| ----- | ---------------- | ------------------------------------------------------- |
| s     | <code>any</code> | An initial state that needs to be passed to the `State` |
