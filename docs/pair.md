
<a name="Pair"></a>

# Pair
A Pair is another way of storing two values in a single value. Elements of a Pair do not need to be of the same type

**Implements:** [BiFunctor](https://github.com/fantasyland/fantasy-land#bifunctor), [Monad](https://github.com/fantasyland/fantasy-land#monad), [Semigroup](https://github.com/fantasyland/fantasy-land#semigroup), [Setoid](https://github.com/fantasyland/fantasy-land#setoid)

* [Pair](#Pair)
    * [Pair(v1, v2)](#new_Pair_new)
    * [.of](#Pair.of)
    * [.equals(j)](#Pair.equals)
    * [.concat(p)](#Pair.concat)
    * [.fst()](#Pair.fst)
    * [.snd()](#Pair.snd)
    * [.concat(j)](#Pair.concat)
    * [.getValue()](#Pair.getValue)
    * [.map(f)](#Pair.map)
    * [.bimap(f1, f2)](#Pair.bimap)
    * [.chain(f)](#Pair.chain)
    * [.swap()](#Pair.swap)
    * [.toString()](#Pair.toString)

<a name="new_Pair_new"></a>

### Pair(v1, v2)
Pair constructor


| Param | Type | Description |
| --- | --- | --- |
| v1 | <code>any</code> | First element of the Pair |
| v2 | <code>any</code> | second element of the Pair |

<a name="Pair.of"></a>

### Pair.of(v)
Pair constructor


| Param | Type | Description |
| --- | --- | --- |
| v | <code>any</code> | Element that will be stored as first and second element of the Pair |

<a name="Pair.equals"></a>

### Pair.equals(j)
Check if the values of the current pair is equal to the values of the passed Pair. Pairs are equal only if the first and second values of both Pairs are equal


| Param | Type | Description |
| --- | --- | --- |
| j | [<code>Pair</code>](#Pair) | The Pair to compare with |

<a name="Pair.concat"></a>

### Pair.concat( p)
Concat the current pair with the passed one. Note that both first and second elements of the Pair should be of type semigroup for cancat to work


| Param | Type | Description |
| --- | --- | --- |
| p | [<code>Pair</code>](#Pair) | Pair to concat |

<a name="Pair.fst"></a>

### Pair.fst()
Get the first element of the Pair

<a name="Pair.snd"></a>

### Pair.snd()
Get the second element of the Pair

<a name="Pair.concat"></a>

### Pair.concat(j)
Applies the function inside the second element of the passed Pair to the current Pair and concats the first element of the second Pair to the first element of the current Pair


| Param | Type | Description |
| --- | --- | --- |
| j | [<code>Pair</code>](#Pair) | Pair with function as the second element |

<a name="Pair.getValue"></a>

### Pair.getValue()
Get the values within the Pair as an Array of length 2

<a name="Pair.map"></a>

### Pair.map(f)
Apply the function to the second element of the current Pair


| Param | Type | Description |
| --- | --- | --- |
| f | <code>function</code> | Function |

<a name="Pair.bimap"></a>

### Pair.bimap(f1, f2)
Apply f1 to the first element and f2 to the second element of the current Pair


| Param | Type | Description |
| --- | --- | --- |
| f1 | <code>function</code> | Function to be applied on the first element |
| f2 | <code>function</code> | Function to be applied on the second element |

<a name="Pair.chain"></a>

### Pair.chain(f)
Chain together many computations that return a Pair


| Param | Type | Description |
| --- | --- | --- |
| f | <code>function</code> | Function that returns another Pair |

<a name="Pair.swap"></a>

### Pair.swap()
Swap the elements of the current pair

<a name="Pair.toString"></a>

### Pair.toString()
Get a stringified version of the Pair


---
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

Concat Pairs. Note that to concat pairs the elements of each Pair should be semigroups of the same type
```
const p1 = Pair([1], [2]);
const p2 = Pair([3], [4]);

const p3 = p1.concat(p2);

console.log(p3.getValue()); // [[1, 3], [2, 4]] 

```

** TODO: Add more examples **