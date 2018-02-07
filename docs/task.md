<a name="Task"></a>

## Task

* [Task](#Task)
    * [Task(f)](#new_Task_new)
    * [.of](#Task.of)
    * [.rejected](#Task.rejected)
    * [.fork](#Task.fork)
    * [.toString()](#Task.toString)
    * [.map(f)](#Task.map)
    * [.getValue()](#Task.getValue)
    * [.ap(t)](#Task.ap)
    * [.concat(t)](#Task.concat)
    * [.chain(f)](#Task.chain)
    * [.toPromise()](#Task.toPromise)

<a name="new_Task_new"></a>

### Task(f)
Task constructor


| Param | Type | Description |
| --- | --- | --- |
| f | <code>function</code> | A function that is passed with the arguments reject and resolve functions. When reject or resolve functions are called the Task gets rejected or resolved, respectively. Function f normally initiates an asynchronous work or one that has effects, and then, once that completes, either calls the resolve function to resolve the Task or else rejects it. |

<a name="Task.of"></a>

### Task.of(v)
Task constructor that creates a Task which immediately resolves


| Param | Type | Description |
| --- | --- | --- |
| v | <code>any</code> | value that is passed to the resolve function |

<a name="Task.rejected"></a>

### Task.rejected(v)
Task constructor that creates a Task which immediately gets rejected


| Param | Type | Description |
| --- | --- | --- |
| v | <code>any</code> | value that is passed to the rejected function |

<a name="Task.fork"></a>

### Task.fork(reject, resolve)
Executes the Task


| Param | Type | Description |
| --- | --- | --- |
| reject | <code>function</code> | Function to be called when the Task is rejected |
| resolve | <code>function</code> | Function to be called when the Task is resolved |

<a name="Task.toString"></a>

### Task.toString()
Get a stringified version of the Task

<a name="Task.map"></a>

### Task.map(f)
Apply the function f to value of a successfully resolved Task

| Param | Type | Description |
| --- | --- | --- |
| f | <code>function</code> | Function |

<a name="Task.getValue"></a>

### Task.getValue()
Get the function within the Task

<a name="Task.ap"></a>

### Task.ap(t)
* Applys the successful value of the Task t to the successful value of the current Task

| Param | Type | Description |
| --- | --- | --- |
| t | [<code>Task</code>](#Task) | Task with function as the second element |

<a name="Task.concat"></a>

### Task.concat(t)
Concat the current Task with the passed one and get a new Task. Which when resloved would get the successfull result of both the task in an array.


| Param | Type | Description |
| --- | --- | --- |
| t | [<code>Task</code>](#Task) | Task to concat |

<a name="Task.chain"></a>

### Task.chain(f)
Chain together many computations that return a Task

| Param | Type | Description |
| --- | --- | --- |
| f | <code>function</code> | Function that returns another Task |

<a name="Task.toPromise"></a>

### Task.toPromise()
Converts the current task to a Promise
