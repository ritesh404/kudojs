export default interface Foldable<A> {
    reduce<B>(f: (b: B, a: A) => B, x: B): B;
}
