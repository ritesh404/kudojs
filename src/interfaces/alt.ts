import Functor from "./functor";

export default interface Alt<A> extends Functor<A> {
    alt(a: Alt<A>): Alt<A>;
}
