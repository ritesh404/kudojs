import Functor from "../Functor";

export default interface Alt<A> extends Functor<A> {
    alt(a: Alt<A>): Alt<A>;
}
