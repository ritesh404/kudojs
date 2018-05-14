<a name="State"></a>

## State
State is parameterized by two types, a state <code>s</code> and a resultant <code>a</code>
State should wrap a function of the form <code>s -> Pair a s</code> and can be constructed by providing a function of this form. There are 3 methods that are available on the State for running with a given initial state

**Implements:** <code>[Monad](https://github.com/fantasyland/fantasy-land#monad)</code>

* [State](#State)
    * [State(f)](#new_State_new)
    * [.of](#State.of)
    * [.toString()](#State.toString)
    * [.map(f)](#State.map)
    * [.getValue()](#State.getValue)
    * [.ap(t)](#State.ap)
    * [.chain(f)](#State.chain)
    * [.runWith(e)](#State.runWith)
    * [.execWith(e)](#State.execWith)
    * [.evalWith(e)](#State.evalWith)

<a name="new_State_new"></a>

### State(f)
State constructor


| Param | Type | Description |
| --- | --- | --- |
| f | <code>function</code> | A function of the form s -> Pair a that is wrapped by the State, nothing is executed until it is run with an initial state s |

<a name="State.of"></a>

### State.of(v)
State constructor that populates the right portion with it's argument. of essentially will lift a value of type a into a State


| Param | Type | Description |
| --- | --- | --- |
| v | <code>any</code> | any value that needs to be lifted to the State |


<a name="State.toString"></a>

### State.toString()
Get a stringified version of the State

<a name="State.map"></a>

### State.map(f)
Apply the function f to the right portion of the State

| Param | Type | Description |
| --- | --- | --- |
| f | <code>function</code> | Function |

<a name="State.getValue"></a>

### State.getValue()
Get the function within the State

<a name="State.ap"></a>

### State.ap(t)
ap allows for values wrapped in a State to be applied to functions also wrapped in a State. In order to use ap, the State must contain a function as its value on the right section.

| Param | Type | Description |
| --- | --- | --- |
| t | [<code>State</code>](#State) | State with function as the second element |

<a name="State.chain"></a>

### State.chain(f)
Chain together many computations that return a State

| Param | Type | Description |
| --- | --- | --- |
| f | <code>function</code> | Function that returns another State |

<a name="State.runWith"></a>

### State.runWith(s)
As State is a lazy datatype that requires a initial state to run, it's instance provides a runWith method that takes in a initial state and returns the result of the computation as a <code>Pair result state</code>.

| Param | Type | Description |
| --- | --- | --- |
| s | <code>any</code> | An initial state that needs to be passed to the State |

<a name="State.execWith"></a>

### State.execWith(s)
When called, execWith will run the state transition with the given value as the initial state and will return the state.

| Param | Type | Description |
| --- | --- | --- |
| s | <code>any</code> | An initial state that needs to be passed to the State |

<a name="State.evalWith"></a>

### State.evalWith(s)
When called, evalWith will run the state transition with the given value as the initial state and will return the resultant.

| Param | Type | Description |
| --- | --- | --- |
| s | <code>any</code> | An initial state that needs to be passed to the State |
