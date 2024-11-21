<a name="Maybe"></a>

## Maybe 
Maybe is a structure for values that may not be present, or things that may fail.
A Maybe can help in dealing with optional values, arguments, and records with optional fields etc.

**Implements:** <code>[Alt](https://github.com/fantasyland/fantasy-land#alt)</code>, <code>[Monad](https://github.com/fantasyland/fantasy-land#monad)</code>, <code>[Semigroup](https://github.com/fantasyland/fantasy-land#semigroup)</code>, <code>[Setoid](https://github.com/fantasyland/fantasy-land#setoid)</code>

- [Maybe](#maybe)
  - [Maybe.of(v)](#maybeofv)
  - [Maybe.zero()](#maybezero)
  - [Maybe.Just(v)](#maybejustv)
  - [Maybe.Nothing()](#maybenothing)
  - [Maybe.fromNullable(v)](#maybefromnullablev)
  - [Maybe.withDefault(def, v)](#maybewithdefaultdef-v)
  - [Maybe.](#maybe-1)
  - [Maybe.catMaybes(ar)](#maybecatmaybesar)
  - [Maybe.isNothing(v)](#maybeisnothingv)
  - [Maybe.isJust(v)](#maybeisjustv)
  - [Maybe.equals(n)](#maybeequalsn)
  - [Maybe.map(f)](#maybemapf)
  - [Maybe.chain(f)](#maybechainf)
  - [Maybe.isNothing()](#maybeisnothing)
  - [Maybe.isJust()](#maybeisjust)
  - [Maybe.alt(v)](#maybealtv)
  - [Maybe.ap(j)](#maybeapj)
  - [Maybe.getValue()](#maybegetvalue)


<a name="Maybe.of"></a>

### Maybe.of(v)
Creates a Just v


| Param | Type | Description |
| --- | --- | --- |
| v | <code>any</code> | Value |

<a name="Maybe.zero"></a>

### Maybe.zero()
Creates a Nothing

<a name="Maybe.Just"></a>

### Maybe.Just(v)
Creates a Just v


| Param | Type | Description |
| --- | --- | --- |
| v | <code>any</code> | Value |

<a name="Maybe.Nothing"></a>

### Maybe.Nothing()
Creates a Nothing

<a name="Maybe.fromNullable"></a>

### Maybe.fromNullable(v)
Creates a Just if the value is not null or undefined else creates a Nothing


| Param | Type | Description |
| --- | --- | --- |
| v | <code>any</code> | Value |

<a name="Maybe.withDefault"></a>

### Maybe.withDefault(def, v)
Creates a Just if the value v is not null or undefined else creates a Just with the default value def


| Param | Type | Description |
| --- | --- | --- |
| def | <code>any</code> | Value |
| v | <code>any</code> | Value |

### Maybe.

<a name="Maybe.catMaybes"></a>

### Maybe.catMaybes(ar)
A static method that takes an Array of Maybes and returns back an Array of values of all the Just in the passed Array

| Param | Type | Description |
| --- | --- | --- |
| ar | <code>Array.&lt;any&gt;</code> | Array of Maybes |

<a name="Maybe.isNothing"></a>

### Maybe.isNothing(v)
A static method that returns true if the passed Maybe is a Nothing

| Param | Type | Description |
| --- | --- | --- |
| v | <code>any</code> | Maybe |

<a name="Maybe.isJust"></a>

### Maybe.isJust(v)
A static method that returns true if the passed Maybe is a Just

| Param | Type | Description |
| --- | --- | --- |
| v | <code>any</code> | Maybe |

<a name="Maybe.equals"></a>

### Maybe.equals(n)
Returns true if the current and the passed element are of Maybe type with the same value

| Param | Type | Description |
| --- | --- | --- |
| n | <code>any</code> | Any Value of Type Setoid |

<a name="Maybe.map"></a>

### Maybe.map(f)
Applies the passed function to the value of the current Maybe if it is a Just

| Param | Type | Description |
| --- | --- | --- |
| f | <code>function</code> | Function |

<a name="Maybe.chain"></a>

### Maybe.chain(f)
Chains together many computations that return a Maybe type 

| Param | Type | Description |
| --- | --- | --- |
| f | <code>function</code> | Function that returns another Maybe |

<a name="Maybe.isNothing"></a>

### Maybe.isNothing()
Returns true if the current Maybe is a Nothing 
<a name="Maybe.isJust"></a>

### Maybe.isJust()
Returns true if the current Maybe is a Just

<a name="Maybe.alt"></a>

### Maybe.alt(v)
An instance method that returns the current maybe if it is a Just else returns the passed Maybe

| Param | Type | Description |
| --- | --- | --- |
| v | <code>any</code> | Maybe |

<a name="Maybe.ap"></a>

### Maybe.ap(j)
Applies the function inside the passed Maybe to the current Maybe if it is a Just

| Param | Type | Description |
| --- | --- | --- |
| j | <code>any</code> | Maybe with a function |

<a name="Maybe.getValue"></a>

### Maybe.getValue()
Get the value within the Maybe