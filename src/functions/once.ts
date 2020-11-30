import isFunction from "./isFunction";

export default function once(f: Function) {
    if (!isFunction(f)) throw Error("Function not provided");
    let _called = false;
    let _result: any;

    return (...args: Array<any>) => {
        if (!_called) {
            _called = true;
            _result = f.apply(null, args);
        }
        return _result;
    };
}
