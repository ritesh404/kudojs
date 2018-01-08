export interface Setoid {
    equals(s: Setoid): boolean
}

export interface Functor {
    map(fn: Function): Functor
}

export interface Apply {
    ap(a: Apply): Apply
}

export interface Applicative extends Apply {
    of(a: any): Applicative
}

export interface Monad extends Applicative, Functor {
    chain(fn: Function): Monad
}

export interface PatternMatch {
    caseOf(o: Object): any
}