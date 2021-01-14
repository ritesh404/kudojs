import curry from "../curry";
import objectDeepClone from "../deepClone";

function assoc<A>(key: string, val: A, obj: any): any {
    if (!obj || typeof obj !== "object")
        throw new Error("assoc: expects an object");
    const o = objectDeepClone(obj);
    o[key] = val;
    return o;
}
export default curry(assoc);
