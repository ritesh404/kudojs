<a name="Identity"></a>

# Identity

An Identity is a wrapper for a value that cannot be changed. It is useful for handling pure values.

**Implements:** [Monad](https://github.com/fantasyland/fantasy-land#monad), [Semigroup](https://github.com/fantasyland/fantasy-land#semigroup), [Setoid](https://github.com/fantasyland/fantasy-land#setoid)

- [Identity](#identity)
    - [Identity(v)](#identityv)
    - [Identity.of(v)](#identityofv)
    - [Identity.equals(j)](#identityequalsj)
    - [Identity.concat(p)](#identityconcatp)
    - [Identity.getValue()](#identitygetvalue)
    - [Identity.map(f)](#identitymapf)
    - [Identity.chain(f)](#identitychainf)
    - [Identity.toString()](#identitytostring)
    - [Examples](#examples)

<a name="new_Identity_new"></a>

### Identity(v)

The Identity constructor.

| Param | Type             | Description                                                      |
| ----- | ---------------- | ---------------------------------------------------------------- |
| v     | <code>any</code> | The value to be wrapped by Identity. This cannot be `undefined`. |

<a name="Identity.of"></a>

### Identity.of(v)

Identity constructor.

| Param | Type             | Description                                                      |
| ----- | ---------------- | ---------------------------------------------------------------- |
| v     | <code>any</code> | The value to be wrapped by Identity. This cannot be `undefined`. |

<a name="Identity.equals"></a>

### Identity.equals(j)

Checks if the value of the current Identity is equal to the value of the passed Identity. This uses strict equality (`===`) to compare the values of the two Identities.

| Param | Type                               | Description                  |
| ----- | ---------------------------------- | ---------------------------- |
| j     | [<code>Identity</code>](#identity) | The Identity to compare with |

<a name="Identity.concat"></a>

### Identity.concat(p)

Concatenates the current Identity with the passed one. Note that the values of both Identities must be of the same type and must be of a type that supports the `Semigroup` concatenation operation for this to work.

| Param | Type                               | Description                      |
| ----- | ---------------------------------- | -------------------------------- |
| p     | [<code>Identity</code>](#identity) | The Identity to concatenate with |

<a name="Identity.getValue"></a>

### Identity.getValue()

Gets the value within the Identity.

<a name="Identity.map"></a>

### Identity.map(f)

Applies the function to the value of the current Identity.

| Param | Type                  | Description |
| ----- | --------------------- | ----------- |
| f     | <code>function</code> | Function    |

<a name="Identity.chain"></a>

### Identity.chain(f)

Chains a computation that returns an Identity.

| Param | Type                  | Description                            |
| ----- | --------------------- | -------------------------------------- |
| f     | <code>function</code> | Function that returns another Identity |

<a name="Identity.toString"></a>

### Identity.toString()

Returns a stringified version of the Identity.

---

### Examples

**TODO: Add some examples**
