export interface Setoid {
    equals(s: Setoid): boolean
}

export interface Semigroup {
    concat(s: Semigroup): Semigroup
}

export interface Functor {
    map(fn: Function): Functor
}

export interface BiFunctor  extends Functor{
    bimap(a: Function, b: Function): BiFunctor
}

export interface Apply extends Functor {
    ap(a: Functor): Apply
    map(fn: Function): Apply
}

export interface Applicative extends Apply {
    of(a: any): Applicative
}

export interface Monad extends Applicative {
    chain(fn: Function): Monad
}

export interface PatternMatch {
    caseOf(o: Object): any
}