export default function compose(...fns: Array<Function>): Function {
    if (fns.length <= 0) throw Error("Expected a function to compose");
    return fns.reduce((f, g) => (...args: Array<any>) => f(g(...args)));
}
