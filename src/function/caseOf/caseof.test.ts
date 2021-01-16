import * as test from "tape";
import caseOf from "./";

import Either from "../../adt/Either";

test("caseOf", t => {
    const e1 = Either.of(1);
    t.equals(
        caseOf({ Right: v => v + 1, Left: x => x }, e1),
        2,
        "pattern match"
    );
    t.throws(
        () => caseOf({ Right: v => v + 1, Left: x => x }, "hello"),
        "pattern match fail"
    );
    t.equals(
        caseOf({ string: x => x, _: x => x }, "string"),
        "string",
        "pattern match strings"
    );
    t.equals(
        caseOf({ string: x => x, _: x => x }, 1),
        1,
        "pattern match numbers"
    );
    t.throws(
        () => caseOf({ str: x => x }, "hello"),
        "Must provide default case for strings"
    );
    t.throws(
        () => caseOf({ 5: x => x }, 1),
        "Must provide default case for numbers"
    );
    t.end();
});
