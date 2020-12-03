import Applicative from "../Applicative";
import Chain from "../Chain";

export default interface Monad<A> extends Applicative<A>, Chain<A> {
    chain<B>(fn: (a: A) => Monad<B>): Monad<B>;
}
