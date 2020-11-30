import Applicative from "./applicative";
import Chain from "./chain";

export default interface Monad<A> extends Applicative<A>, Chain<A> {
    chain<B>(fn: (a: A) => Monad<B>): Monad<B>;
}
