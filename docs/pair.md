<a name="Pair"></a>

# Pair

A `Pair` is a structure for storing two values in a single value. The elements of a `Pair` do not need to be of the same type.

**Implements:** <code>[BiFunctor](https://github.com/fantasyland/fantasy-land#bifunctor)</code>, <code>[Monad](https://github.com/fantasyland/fantasy-land#monad)</code>, <code>[Semigroup](https://github.com/fantasyland/fantasy-land#semigroup)</code>, <code>[Setoid](https://github.com/fantasyland/fantasy-land#setoid)</code>

- [Pair](#pair)
    - [Pair(v1, v2)](#pairv1-v2)
    - [Pair.of(v)](#pairofv)
    - [Pair.equals(j)](#pairequalsj)
    - [Pair.concat(p)](#pairconcatp)
    - [Pair.fst()](#pairfst)
    - [Pair.snd()](#pairsnd)
    - [Pair.concat(j)](#pairconcatj)
    - [Pair.getValue()](#pairgetvalue)
    - [Pair.map(f)](#pairmapf)
    - [Pair.bimap(f1, f2)](#pairbimapf1-f2)
    - [Pair.chain(f)](#pairchainf)
    - [Pair.swap()](#pairswap)
    - [Pair.toString()](#pairtostring)
    - [Examples](#examples)

<a name="new_Pair_new"></a>

### Pair(v1, v2)

Pair constructor.

| Param | Type             | Description                |
| ----- | ---------------- | -------------------------- |
| v1    | <code>any</code> | First element of the Pair  |
| v2    | <code>any</code> | Second element of the Pair |

<a name="Pair.of"></a>

### Pair.of(v)

Pair constructor.

| Param | Type             | Description                                                                  |
| ----- | ---------------- | ---------------------------------------------------------------------------- |
| v     | <code>any</code> | Element that will be stored as both the first and second element of the Pair |

<a name="Pair.equals"></a>

### Pair.equals(j)

Checks if the values of the current `Pair` are equal to the values of the passed `Pair`. Pairs are equal only if the first and second values of both pairs are equal.

| Param | Type                       | Description                |
| ----- | -------------------------- | -------------------------- |
| j     | [<code>Pair</code>](#Pair) | The `Pair` to compare with |

<a name="Pair.concat"></a>

### Pair.concat(p)

Concatenates the current `Pair` with the passed one. Note that both the first and second elements of the `Pair` must be of type `Semigroup` for concatenation to work.

| Param | Type                       | Description      |
| ----- | -------------------------- | ---------------- |
| p     | [<code>Pair</code>](#Pair) | `Pair` to concat |

<a name="Pair.fst"></a>

### Pair.fst()

Gets the first element of the `Pair`.

<a name="Pair.snd"></a>

### Pair.snd()

Gets the second element of the `Pair`.

<a name="Pair.concat"></a>

### Pair.concat(j)

Applies the function inside the second element of the passed `Pair` to the current `Pair` and concatenates the first element of the second `Pair` to the first element of the current `Pair`.

| Param | Type                       | Description                                  |
| ----- | -------------------------- | -------------------------------------------- |
| j     | [<code>Pair</code>](#Pair) | `Pair` with a function as the second element |

<a name="Pair.getValue"></a>

### Pair.getValue()

Gets the values within the `Pair` as an array of length 2.

<a name="Pair.map"></a>

### Pair.map(f)

Applies the passed function to the second element of the current `Pair`.

| Param | Type                  | Description |
| ----- | --------------------- | ----------- |
| f     | <code>function</code> | Function    |

<a name="Pair.bimap"></a>

### Pair.bimap(f1, f2)

Applies `f1` to the first element and `f2` to the second element of the current `Pair`.

| Param | Type                  | Description                                  |
| ----- | --------------------- | -------------------------------------------- |
| f1    | <code>function</code> | Function to be applied to the first element  |
| f2    | <code>function</code> | Function to be applied to the second element |

<a name="Pair.chain"></a>

### Pair.chain(f)

Chains together many computations that return a `Pair`.

| Param | Type                  | Description                          |
| ----- | --------------------- | ------------------------------------ |
| f     | <code>function</code> | Function that returns another `Pair` |

<a name="Pair.swap"></a>

### Pair.swap()

Swaps the elements of the current `Pair`.

<a name="Pair.toString"></a>

### Pair.toString()

Gets a stringified version of the `Pair`.

---

### Examples

Let's construct some `Pairs`.

```javascript
import { Pair } from "fp-kudojs";

const point1 = Pair(1, 2);
console.log(point1.toString()); // Pair((1), (2))

const point2 = Pair.of(2);
console.log(point2.toString()); // Pair((2), (2))


### Examples

Lets construct some Pairs

```

import {Pair} from "fp-kudojs";

const point1 = Pair(1, 2);
console.log(point1.toString()); // Pair((1), (2))

const point2 = Pair.of(2);
console.log(point2.toString()); // Pair((2), (2))

```

Two Pairs are equal if the first and the second element of each Pair are equal

```

console.log(point1.equals(Pair(1,2))) //true

console.log(point2.equals(point1) //false

console.log(Pair([1], [2]).equals(Pair([1],[2]))) //false

```

Concatenate Pairs. Note that to concatenate Pairs, the elements of each Pair should be Semigroups of the same type.

```

const p1 = Pair([1], [2]);
const p2 = Pair([3], [4]);

const p3 = p1.concat(p2);

console.log(p3.getValue()); // [[1, 3], [2, 4]]

```

** TODO: Add more examples **
```
