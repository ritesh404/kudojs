export default interface Functor<A> {
    map<B>(fn: (a: A) => B): Functor<B>;
}
