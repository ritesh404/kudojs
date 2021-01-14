import * as test from "tape";
import deepClone from "./";

test("deep clone", t => {
    t.equals(deepClone(1), 1, "should return value if type is not object");
    const o1 = { d: 1 };
    t.notEquals(deepClone(o1), o1, "should not mutate original object");
    const s = { p: 1 };
    const o2 = { d: s };
    t.notEquals(
        deepClone(o2).d,
        o2.d,
        "returned value should not be deep equal to original value"
    );
    t.end();
});
