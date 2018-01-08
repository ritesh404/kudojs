export interface Setoid {
    equals(s: Setoid): boolean
}

export interface Functor {
    map(fn: Function): Functor
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