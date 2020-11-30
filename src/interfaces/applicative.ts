import { Apply } from "./apply";

export default interface Applicative<A> extends Apply<A> {
    of(a: A): Applicative<A>;
}
