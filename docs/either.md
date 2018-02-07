<a name="Either"></a>

## Either

* [Either](#Either)
    * [.of](#Either.of)
    * [.Right](#Either.Right)
    * [.Left](#Either.Left)
    * [.fromNullable](#Either.fromNullable)
    * [.withDefault](#Either.withDefault)
    * [.swap()](#Either.swap)
    * [.try(f)](#Either.try)
    * [.bimap(e, fl, fr)](#Either.bimap)
    * [.isLeft()](#Either.isLeft)
    * [.isRight()](#Either.isRight)
    * [.equals(n)](#Either.equals)
    * [.map(f)](#Either.map)
    * [.bimap(fl, fr)](#Either.bimap)
    * [.chain(f)](#Either.chain)
    * [.swap()](#Either.swap)
    * [.isLeft(e)](#Either.isLefte)
    * [.isRight(e)](#Either.isRighte)
    * [.ap(j)](#Either.ap)
    * [.getValue()](#Either.getValue)


<a name="Either.of"></a>

### Either.of(v)
Creates a Right Either


| Param | Type | Description |
| --- | --- | --- |
| v | <code>any</code> | Value |

<a name="Either.Right"></a>

### Either.Right(v)
Creates a Right Either


| Param | Type | Description |
| --- | --- | --- |
| v | <code>any</code> | Value |

<a name="Either.Left"></a>

### Either.Left(v)
Creates a Left Either


| Param | Type | Description |
| --- | --- | --- |
| v | <code>any</code> | Value |

<a name="Either.fromNullable"></a>

### Either.fromNullable(v)
Creates a Right if the value is not null or undefiend else creates a Left


| Param | Type | Description |
| --- | --- | --- |
| v | <code>any</code> | Value |

<a name="Either.withDefault"></a>

### Either.withDefault(def, v)
Creates a Right if the value v is not null or undefiend else creates a Right with the default value def


| Param | Type | Description |
| --- | --- | --- |
| def | <code>any</code> | Value |
| v | <code>any</code> | Value |

<a name="Either.swap"></a>

### Either.swap()
Swap the Left and Right elements of the current Either

<a name="Either.try"></a>

### Either.try(f)
* Executes the passed function that may throw and converts it to an Either type.

| Param | Type | Description |
| --- | --- | --- |
| f | <code>function</code> | A function that may throw an error |

<a name="Either.bimap"></a>

### Either.bimap(e, fl, fr)
A static method that applies fl to the Left element or fr to the Right element of the current Either

| Param | Type | Description |
| --- | --- | --- |
| e | <code>any</code> | Etiher type |
| fl | <code>function</code> | Function to be applied on the Left element |
| fr | <code>function</code> | Function to be applied on the Right element |

<a name="Either.isLefte"></a>

### Either.isLeft(e)
An static method that returns true if the passed Either is a Left

 Param | Type | Description |
| --- | --- | --- |
| e | <code>any</code> | Etiher type |

<a name="Either.isRighte"></a>

### Either.isRight(e)
An static method that returns true if the passed Either is a Right

 Param | Type | Description |
| --- | --- | --- |
| e | <code>any</code> | Etiher type |

<a name="Either.equals"></a>

### Either.equals(n)
Returns true if the current and the passed element are of Either type with the same value

| Param | Type | Description |
| --- | --- | --- |
| n | <code>any</code> | Any Value of Type Setoid |

<a name="Either.map"></a>

### Either.map(f)
Applies the passed function to the value of the current Either if it is a Just

| Param | Type | Description |
| --- | --- | --- |
| f | <code>function</code> | Function |

<a name="Either.bimap"></a>

### Either.bimap(fl, fr)
Apply fl to the Left element or fr to the Right element of the current Either

| Param | Type | Description |
| --- | --- | --- |
| fl | <code>function</code> | Function to be applied on the Left element |
| fr | <code>function</code> | Function to be applied on the Right element |

<a name="Either.chain"></a>

### Either.chain(f)
An instance method that can chain together many computations that return a Either type

| Param | Type | Description |
| --- | --- | --- |
| f | <code>function</code> | Function that returns another Either |

<a name="Either.swap"></a>

### Either.swap()
Swap the Left and Right elements of the current Either
<a name="Either.isLeft"></a>

### Either.isLeft()
An instance method that returns true if the current Either is a Left
<a name="Either.isRight"></a>

### Either.isRight()
An instance method that returns true if the current Either is a Right
<a name="Either.ap"></a>

### Either.ap(j)
Applies the function inside the passed Either to the current Either if it is a Right

| Param | Type | Description |
| --- | --- | --- |
| j | <code>any</code> | Either with a function |

<a name="Either.getValue"></a>

### Either.getValue()
Get the value within the Either