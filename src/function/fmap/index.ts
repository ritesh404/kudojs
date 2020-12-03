import Functor from "../../interface/Functor";
import curry from "../curry";
import isFunction from "../isFunction";

function fmap<A>(fn: Function, f: Functor<A>): Functor<A> {
    if (!isFunction(fn)) throw Error("function not provided");
    if (!f.map) throw Error("Functor not found");
    return f.map.call(f, fn);
}
export default curry(fmap);
