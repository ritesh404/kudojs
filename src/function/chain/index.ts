import Monad from "../../interface/Monad";
import curry from "../curry";
import isFunction from "../isFunction";

function chain<A, B>(f: (a: A) => Monad<B>, m: Monad<A>): Monad<B> {
    if (!m.chain) throw Error("chain not implemented");
    if (!isFunction(f)) throw Error("function not provided");
    return m.chain(f);
}

export default curry(chain);
