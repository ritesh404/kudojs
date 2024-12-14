import { describe, it, expect } from "vitest";
import fmap from "../../function/fmap";
import id from "../../function/id";
import Task from ".";

const add2 = (x: number) => x + 2;
const sub1 = (x: number) => x - 1;
const impureTask = (rej: Function, res: Function) => {
    let d = 1;
    setTimeout(() => {
        d += 2;
        res(d);
    }, 0);
};

describe("Task", () => {
    const a = Task(impureTask);
    const b = Task((rej: Function, res: Function) =>
        setTimeout(() => res(sub1), 0),
    );
    const c = Task((rej: Function, res: Function) =>
        setTimeout(() => res(add2), 0),
    );
    const gimmeTask = (x: number) =>
        Task((rej: Function, res: Function) => setTimeout(() => res(x + 2), 0));

    it("should validate constructor arguments", () => {
        expect(() => Task(1 as any)).toThrow("Task: Expected a Function");
        expect(() => a.fork(1 as any, id)).toThrow(
            "Task: Reject and Resolve need to be functions",
        );
        expect(() => a.fork(id, 1 as any)).toThrow(
            "Task: Reject and Resolve need to be functions",
        );
        expect(a.fork(id, id)).toBeUndefined();
        expect(a.getValue()).toBe(impureTask);
        expect(typeof a.toString()).toBe("string");
    });

    it("should satisfy functor identity law", async () => {
        expect(() => a.map(1 as any)).toThrow("Task: Expected a function");

        const result = await new Promise((resolve) => {
            let res1: any, res2: any;
            fmap(id)(a).fork(id, (x: any) => {
                res1 = x;
            });
            a.fork(id, (x: any) => {
                res2 = x;
            });

            setTimeout(() => {
                resolve({ res1, res2 });
            }, 3);
        });

        expect(result.res1).toBe(result.res2);
    });

    it("should satisfy functor composition law", async () => {
        const result = await new Promise((resolve) => {
            let res1: any, res2: any;
            a.map((x) => sub1(add2(x))).fork(id, (x: any) => {
                res1 = x;
            });
            a.map(sub1)
                .map(add2)
                .fork(id, (x: any) => {
                    res2 = x;
                });

            setTimeout(() => {
                resolve({ res1, res2 });
            }, 5);
        });

        expect(result.res1).toBe(result.res2);
    });

    it("should handle semigroup correctly", async () => {
        const a1 = gimmeTask(2);
        const a2 = gimmeTask(3);
        expect(() => a.concat(1 as any)).toThrow("Task: type mismatch");

        const result = await new Promise((resolve) => {
            let res1: any[] = [],
                res2: any[] = [];

            a.concat(a1)
                .concat(a2)
                .fork(id, (...args) => {
                    res1 = args;
                });

            a.concat(a1.concat(a2)).fork(id, (...args) => {
                res2 = args;
            });

            setTimeout(() => {
                resolve({ res1, res2 });
            }, 7);
        });

        expect(result.res1).toEqual(result.res2);
    });

    it("should handle applicative correctly", async () => {
        expect(() => a.ap({} as any)).toThrow("Task: type mismatch");
        expect(() => Task.of(1).ap(Task.of(1)).fork(id, id)).toThrow(
            "Task: Wrapped value should be a function",
        );

        const result = await new Promise((resolve) => {
            let res1: any, res2: any;

            a.ap(c.ap(b.map((p) => (q) => (x) => p(q(x))))).fork(
                id,
                (x: any) => {
                    res1 = x;
                },
            );

            a.ap(c)
                .ap(b)
                .fork(id, (x: any) => {
                    res2 = x;
                });

            setTimeout(() => {
                resolve({ res1, res2 });
            }, 9);
        });

        expect(result.res1).toBe(result.res2);
    });

    it("should handle chain correctly", async () => {
        expect(() => a.chain(1 as any)).toThrow("Task: Function require");
        expect(() =>
            Task.of(1)
                .chain((x) => 1)
                .fork(id, id),
        ).toThrow("Task: function must return another Task");

        const result = await new Promise((resolve) => {
            let res1: any, res2: any;

            gimmeTask(1)
                .chain(gimmeTask)
                .chain(gimmeTask)
                .fork(id, (x: any) => {
                    res1 = x + 1;
                });

            gimmeTask(1)
                .chain((x) => gimmeTask(x).chain(gimmeTask))
                .fork(id, (x: any) => {
                    res2 = x + 1;
                });

            setTimeout(() => {
                resolve({ res1, res2 });
            }, 20);
        });

        expect(result.res1).toBe(result.res2);
    });

    it("should handle toPromise correctly", async () => {
        const result = await new Promise((resolve) => {
            let res1: any, res2: any;

            a.toPromise().then((x: any) => {
                res1 = x;
            });

            a.fork(id, (x: any) => {
                res2 = x;
            });

            setTimeout(() => {
                resolve({ res1, res2 });
            }, 11);
        });

        expect(result.res1).toBe(result.res2);
    });

    it("should handle rejected correctly", () => {
        Task.rejected(2).fork((x: any) => {
            expect(x).toBe(2);
        }, id);

        a.rejected(2).fork((x: any) => {
            expect(x).toBe(2);
        }, id);
    });

    it("should handle of correctly", () => {
        Task.of(3).fork(id, (x: any) => {
            expect(x).toBe(3);
        });

        a.of(3).fork(id, (x: any) => {
            expect(x).toBe(3);
        });
    });
});
