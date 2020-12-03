import * as test from "tape";
import fmap from "../../function/fmap";
import id from "../../function/id";
import Task from ".";

const add2 = (x: number) => x + 2;
const sub1 = (x: number) => x - 1;
const impureTask = (rej, res) => {
    let d = 1;
    setTimeout(() => {
        d += 2;
        res(d);
    }, 0);
};
const a = Task(impureTask);
const b = Task((rej, res) => setTimeout(() => res(sub1), 0));
const c = Task((rej, res) => setTimeout(() => res(add2), 0));
const gimmeTask = x => Task((rej, res) => setTimeout(() => res(x + 2), 0));

test("Task#Functor Identity", t => {
    // @ts-ignore
    t.throws(() => a.map(1), "map expects a function");
    let res1 = 2;
    let res2 = 2;
    fmap(id)(a).fork(id, x => {
        res1 = x;
    });
    a.fork(id, x => {
        res2 = x;
    });
    setTimeout(() => {
        t.equals(res1, res2, "should pass the identity law");
        t.end();
    }, 3);
});

test("Task#Functor Composition", t => {
    let res1 = "res1";
    let res2 = "res2";
    // @ts-ignore
    a.map(x => sub1(add2(x))).fork(id, x => {
        res1 = x;
    });
    a.map(sub1)
        .map(add2)
        .fork(id, x => {
            res2 = x;
        });
    setTimeout(() => {
        t.equals(res1, res2, "should pass functor composition law");
        t.end();
    }, 5);
});

test("Task#Semigroup", t => {
    let res1 = [1];
    let res2 = [2];
    const a1 = gimmeTask(2);
    const a2 = gimmeTask(3);
    // @ts-ignore
    t.throws(() => a.concat(1), "concat expects a Task");
    a.concat(a1)
        .concat(a2)
        .fork(id, (r1, r2, r3) => {
            res1 = [r1, r2, r3];
        });
    a.concat(a1.concat(a2)).fork(id, (r1, r2, r3) => {
        res2 = [r1, r2, r3];
    });
    setTimeout(() => {
        t.deepEqual(res1, res2, "semigroup associativity");
        t.end();
    }, 7);
});

test("Task#Applicative", t => {
    let res1 = 1;
    let res2 = 2;
    // @ts-ignore
    t.throws(() => a.ap({}), "applicative expects a Task");
    t.throws(
        () =>
            Task.of(1)
                .ap(Task.of(1))
                .fork(id, id),
        "applicative expects function to return a function"
    );
    // @ts-ignore
    a.ap(c.ap(b.map(p => q => x => p(q(x))))).fork(id, x => {
        res1 = x;
    });
    a.ap(c)
        .ap(b)
        .fork(id, x => {
            res2 = x;
        });
    setTimeout(() => {
        t.equals(res1, res2, "should pass applicative composition");
        t.end();
    }, 9);
});

test("Task#Chain Associativity", t => {
    let res1 = 1;
    let res2 = 2;
    // @ts-ignore
    t.throws(() => a.chain(1), "chain expects a function");
    t.throws(
        () =>
            Task.of(1)
                .chain(x => 1)
                .fork(id, id),
        "chain expects function to return a task"
    );
    gimmeTask(1)
        .chain(gimmeTask)
        .chain(gimmeTask)
        .fork(id, x => {
            res1 = x + 1;
        });
    gimmeTask(1)
        .chain(x => gimmeTask(x).chain(gimmeTask))
        .fork(id, x => {
            res2 = x + 1;
        });
    setTimeout(() => {
        t.equals(res1, res2, "chain Associativity");
        t.end();
    }, 20);
});

test("Task#To Promise", t => {
    let res1 = 1;
    let res2 = 2;
    const p = a.toPromise();
    p.then(x => {
        // @ts-ignore
        res1 = x;
    });
    a.fork(id, x => {
        res2 = x;
    });
    setTimeout(() => {
        t.equals(res1, res2, "to promise");
        t.end();
    }, 11);
});

test("Task#Rejected", t => {
    Task.rejected(2).fork(x => {
        t.equals(x, 2, "Rejected Task");
    }, id);
    a.rejected(2).fork(x => {
        t.equals(x, 2, "Rejected Task");
        t.end();
    }, id);
});

test("Task#Of", t => {
    Task.of(3).fork(id, x => {
        t.equals(x, 3, "of creates a Task");
    });
    a.of(3).fork(id, x => {
        t.equals(x, 3, "of creates a Task");
        t.end();
    });
});

test("Task", t => {
    // @ts-ignore
    t.throws(() => Task(1), "expects a function");
    // @ts-ignore
    t.throws(() => a.fork(1, id), "fork expects a reject function");
    // @ts-ignore
    t.throws(() => a.fork(id, 1), "fork expects a resolve function");
    t.notOk(a.fork(id, id), "fork may not return anything");
    t.equals(a.getValue(), impureTask, "get value");
    t.ok(typeof a.toString() === "string", "should give a string");

    t.end();
});
