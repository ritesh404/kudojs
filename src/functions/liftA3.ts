import { Apply } from "../interfaces";
import curry from "./curry";

/**
 * @function liftA3
 * @param {Function} f - Function to be lifted
 * @param {Apply} f1 - 'Apply' to the function
 * @param {Apply} f2 - 'Apply' to the function
 * @param {Apply} f3 - 'Apply' to the function
 * @description lets us combine 3 separate wrapped values into one with a given function.
 */
function liftA3<A, B>(
    f: (a: A) => (b: A) => B,
    f1: Apply<A>,
    f2: Apply<A>,
    f3: Apply<A>
) {
    const res = f1
        .map(f)
        // @ts-ignore
        .ap(f2)
        .ap(f3);
    return res;
}
export default curry(liftA3);
