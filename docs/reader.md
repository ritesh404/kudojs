<a name="Reader"></a>

## Reader

The Reader monad represents a computation, which can read values from a shared environment, pass values from function to function, and execute sub-computations in a modified environment. It is also useful when it comes to dependency injections

**Implements:** <code>[Monad](https://github.com/fantasyland/fantasy-land#monad)</code>

- [Reader](#reader)
    - [Reader(f)](#readerf)
    - [Reader.of(v)](#readerofv)
    - [Reader.toString()](#readertostring)
    - [Reader.map(f)](#readermapf)
    - [Reader.getValue()](#readergetvalue)
    - [Reader.ap(t)](#readerapt)
    - [Reader.chain(f)](#readerchainf)
    - [Reader.runWith(e)](#readerrunwithe)

<a name="new_Reader_new"></a>

### Reader(f)

Reader constructor

| Param | Type                  | Description                                                                                                            |
| ----- | --------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| f     | <code>function</code> | A function of the form (e -> a) that is wrapped by the Reader, nothing is executed until it is run with an environment |

<a name="Reader.of"></a>

### Reader.of(v)

Reader constructor that populates the right portion with it's argument. of essentially will lift a value of type a into a Reader

| Param | Type             | Description                                     |
| ----- | ---------------- | ----------------------------------------------- |
| v     | <code>any</code> | any value that needs to be lifted to the Reader |

<a name="Reader.toString"></a>

### Reader.toString()

Get a stringified version of the Reader

<a name="Reader.map"></a>

### Reader.map(f)

Apply the function f to the right portion of the Reader

| Param | Type                  | Description |
| ----- | --------------------- | ----------- |
| f     | <code>function</code> | Function    |

<a name="Reader.getValue"></a>

### Reader.getValue()

Get the function within the Reader

<a name="Reader.ap"></a>

### Reader.ap(t)

ap allows for values wrapped in a Reader to be applied to functions also wrapped in a Reader. In order to use ap, the Reader must contain a function as its value.

| Param | Type                           | Description                                |
| ----- | ------------------------------ | ------------------------------------------ |
| t     | [<code>Reader</code>](#Reader) | Reader with function as the second element |

<a name="Reader.chain"></a>

### Reader.chain(f)

Chain together many computations that return a Reader

| Param | Type                  | Description                          |
| ----- | --------------------- | ------------------------------------ |
| f     | <code>function</code> | Function that returns another Reader |

<a name="Reader.runWith"></a>

### Reader.runWith(e)

As Reader is a lazy datatype that requires a shared environment to run, it's instance provides a runWith method that takes in an environment and returns the result of the computation.

| Param | Type             | Description                                          |
| ----- | ---------------- | ---------------------------------------------------- |
| e     | <code>any</code> | An environment that needs to be passed to the Reader |
