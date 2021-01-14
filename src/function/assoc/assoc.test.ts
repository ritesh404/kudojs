import * as test from "tape";
import assoc from "./";

test("assoc", t => {
    t.throws(
        () => assoc("d", 1, undefined),
        "should throw error if object is undefined"
    );

    t.equals(assoc("d", 1, {}).d, 1, "should set the value to a key in object");

    const o = {};
    t.notEquals(assoc("d", 1, o), o, "should not mutate original object");
    t.end();
});
