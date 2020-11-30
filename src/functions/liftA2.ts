import Apply from "../interfaces/apply";
import curry from "./curry";

function liftA2<A, B>(f: (a: A) => (b: A) => B, f1: Apply<A>, f2: Apply<A>) {
    // @ts-ignore
    const res = f1.map(f).ap(f2);
    return res;
}
export default curry(liftA2);
