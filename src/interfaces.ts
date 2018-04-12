export interface Setoid {
    equals(s: Setoid): boolean;
}

export interface Semigroup {
    concat(s: Semigroup): Semigroup;
}

export interface Monoid extends Semigroup {
    empty(): Monoid;
}

export interface Foldable<A> {
    reduce<B>(f: (b: B, a: A) => B, x: B): B;
}

export interface Functor<A> {
    map<B>(fn: (a: A) => B): Functor<B>;
}

export interface Alt<A> extends Functor<A> {
    alt(a: Alt<A>): Alt<A>;
}

export interface Plus<A> extends Alt<A> {
    zero(): Plus<A>;
}

// export interface Extend extends Functor {
//     extend(fn: Function): Extend
// }

export interface BiFunctor<A, B> extends Functor<B> {
    bimap<C, D>(fa: (a: A) => C, fb: (a: B) => D): BiFunctor<C, D>;
}

export interface Apply<A> extends Functor<A> {
    ap<B>(j: Apply<(a: A) => B>): Apply<B>;
    map<B>(fn: (a: A) => B): Apply<B>;
}

export interface Applicative<A> extends Apply<A> {
    of(a: A): Applicative<A>;
}

export interface Chain<A> extends Apply<A> {
    chain<B>(fn: (a: A) => Chain<B>): Chain<B>;
}

// export interface Traversable extends Functor, Foldable {
//     traverse(a: Applicative, f: Function): Applicative
// }

export interface Monad<A> extends Applicative<A>, Chain<A> {
    chain<B>(fn: (a: A) => Monad<B>): Monad<B>;
}

export interface PatternMatch {
    caseOf(o: { [k: string]: Function }): any;
}
