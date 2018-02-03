export interface Setoid {
    equals(s: Setoid): boolean
}

export interface Semigroup {
    concat(s: Semigroup): Semigroup
}

export interface Monoid extends Semigroup {
    empty(): Monoid
}

export interface Foldable {
    reduce(f: Function, x:any): any
}

export interface Functor {
    map(fn: Function): Functor
}

export interface Alt extends Functor{
    alt(a: Alt): Alt
}

export interface Plus extends Alt {
    zero(): Plus
}

export interface Extend extends Functor {
    extend(fn: Function): Extend
}

export interface BiFunctor  extends Functor {
    bimap(a: Function, b: Function): BiFunctor
}

export interface Apply extends Functor {
    ap(a: Functor): Apply
    map(fn: Function): Apply
}

export interface Applicative extends Apply {
    of(a: any): Applicative
}

export interface Chain extends Apply {
    chain(fn: Function): Monad
}

export interface Traversable extends Functor, Foldable {
    traverse(a: Applicative, f: Function): Applicative
}

export interface Monad extends Applicative, Chain {
    
}

export interface PatternMatch {
    caseOf(o: Object): any
}