import { Functor } from "./functor";

export default interface BiFunctor<A, B> extends Functor<B> {
    bimap<C, D>(fa: (a: A) => C, fb: (a: B) => D): BiFunctor<C, D>;
}
