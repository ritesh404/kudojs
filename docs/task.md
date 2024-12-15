<a name="Task"></a>

## Task

A `Task` makes it easy to model asynchronous operations that may fail, such as HTTP requests or reading/writing to files/databases.

**Implements:** <code>[Monad](https://github.com/fantasyland/fantasy-land#monad)</code>, <code>[Semigroup](https://github.com/fantasyland/fantasy-land#semigroup)</code>

- [Task](#task)
    - [Task(f)](#taskf)
    - [Task.of(v)](#taskofv)
    - [Task.rejected(v)](#taskrejectedv)
    - [Task.fork(reject, resolve)](#taskforkreject-resolve)
    - [Task.toString()](#tasktostring)
    - [Task.map(f)](#taskmapf)
    - [Task.getValue()](#taskgetvalue)
    - [Task.ap(t)](#taskapt)
    - [Task.concat(t)](#taskconcatt)
    - [Task.chain(f)](#taskchainf)
    - [Task.toPromise()](#tasktopromise)

<a name="new_Task_new"></a>

### Task(f)

`Task` constructor.

| Param | Type                  | Description                                                                                                                                                                                                                                                               |
| ----- | --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| f     | <code>function</code> | A function that takes two arguments: `reject` and `resolve`, which are functions. The function `f` normally initiates an asynchronous task or one that has side effects, and once it completes, it either calls the `resolve` function to resolve the task or rejects it. |

<a name="Task.of"></a>

### Task.of(v)

`Task` constructor that creates a `Task` which immediately resolves.

| Param | Type             | Description                                        |
| ----- | ---------------- | -------------------------------------------------- |
| v     | <code>any</code> | The value that is passed to the `resolve` function |

<a name="Task.rejected"></a>

### Task.rejected(v)

`Task` constructor that creates a `Task` which immediately gets rejected.

| Param | Type             | Description                                         |
| ----- | ---------------- | --------------------------------------------------- |
| v     | <code>any</code> | The value that is passed to the `rejected` function |

<a name="Task.fork"></a>

### Task.fork(reject, resolve)

Executes the `Task`.

| Param   | Type                  | Description                                       |
| ------- | --------------------- | ------------------------------------------------- |
| reject  | <code>function</code> | Function to be called when the `Task` is rejected |
| resolve | <code>function</code> | Function to be called when the `Task` is resolved |

<a name="Task.toString"></a>

### Task.toString()

Gets a stringified version of the `Task`.

<a name="Task.map"></a>

### Task.map(f)

Applies the function `f` to the value of a successfully resolved `Task`.

| Param | Type                  | Description |
| ----- | --------------------- | ----------- |
| f     | <code>function</code> | Function    |

<a name="Task.getValue"></a>

### Task.getValue()

Gets the function within the `Task`.

<a name="Task.ap"></a>

### Task.ap(t)

Applies the successful value of the `Task` `t` to the successful value (a function) of the current `Task`.

| Param | Type                       | Description                                  |
| ----- | -------------------------- | -------------------------------------------- |
| t     | [<code>Task</code>](#Task) | `Task` with a function as the second element |

<a name="Task.concat"></a>

### Task.concat(t)

Concatenates the current `Task` with the passed one and returns a new `Task`. When resolved, it will return the successful result of both tasks.

| Param | Type                       | Description           |
| ----- | -------------------------- | --------------------- |
| t     | [<code>Task</code>](#Task) | `Task` to concatenate |

<a name="Task.chain"></a>

### Task.chain(f)

Chains together many computations that return a `Task`.

| Param | Type                  | Description                          |
| ----- | --------------------- | ------------------------------------ |
| f     | <code>function</code> | Function that returns another `Task` |

<a name="Task.toPromise"></a>

### Task.toPromise()

Converts the current `Task` to a `Promise`.
