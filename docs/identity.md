
<a name="Identity"></a>

# Identity
A Identity is another way of storing two values in a single value. Elements of a Identity do not need to be of the same type

**Implements:** [Monad](https://github.com/fantasyland/fantasy-land#monad)</code>, <code>[Semigroup](https://github.com/fantasyland/fantasy-land#semigroup)</code>, <code>[Setoid](https://github.com/fantasyland/fantasy-land#setoid)</code>

- [Identity](#identity)
    - [Identity(v)](#identityv)
    - [Identity.of(v)](#identityofv)
    - [Identity.equals(j)](#identityequalsj)
    - [Identity.concat( p)](#identityconcat-p)
    - [Identity.getValue()](#identitygetvalue)
    - [Identity.map(f)](#identitymapf)
    - [Identity.chain(f)](#identitychainf)
    - [Identity.toString()](#identitytostring)
    - [Examples](#examples)

<a name="new_Identity_new"></a>

### Identity(v)
Identity constructor


| Param | Type | Description |
| --- | --- | --- |
| v | <code>any</code> | Value to be wrapped by identity. This cannot be undefined |

<a name="Identity.of"></a>

### Identity.of(v)
Identity constructor


| Param | Type | Description |
| --- | --- | --- |
| v | <code>any</code> | Value to be wrapped by identity. This cannot be undefined  |

<a name="Identity.equals"></a>

### Identity.equals(j)
Check if the values of the current Identity is equal to the values of the passed Identity. This checks for `===`'ty of the values of the 2 Identities


| Param | Type | Description |
| --- | --- | --- |
| j | [<code>Identity</code>](#Identity) | The Identity to compare with |

<a name="Identity.concat"></a>

### Identity.concat( p)
Concat the current Identity with the passed one. Note that values of both the Identities should be of the same type and should be of type semigroup for cancat to work


| Param | Type | Description |
| --- | --- | --- |
| p | [<code>Identity</code>](#Identity) | Identity to concat |

<a name="Identity.getValue"></a>

### Identity.getValue()
Get the value within the Identity

<a name="Identity.map"></a>

### Identity.map(f)
Apply the function to the value of the current Identity


| Param | Type | Description |
| --- | --- | --- |
| f | <code>function</code> | Function |

<a name="Identity.chain"></a>

### Identity.chain(f)
Chain a computation that returns an Identity


| Param | Type | Description |
| --- | --- | --- |
| f | <code>function</code> | Function that returns another Identity |

<a name="Identity.toString"></a>

### Identity.toString()
Get a stringified version of the Identity


---
### Examples

** TODO: Add some examples **