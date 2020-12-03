import Monad from "../../interface/monad";
import curry from "../curry";
import isFunction from "../isFunction";

function chain<A>(f: Function, m: Monad<A>): Monad<A> {
    if (!m.chain) throw Error("chain not implemented");
    if (!isFunction(f)) throw Error("function not provided");
    return m.chain.call(m, f);
}
export default curry(chain);
