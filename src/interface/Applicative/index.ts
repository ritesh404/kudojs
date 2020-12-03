import Apply from "../Apply";

export default interface Applicative<A> extends Apply<A> {
    of(a: A): Applicative<A>;
}
