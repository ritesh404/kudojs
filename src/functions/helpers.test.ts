import "mocha"
import {expect} from "chai"
import {
    id,
    throwError,
    fmap,
    caseOf,
    curry,
    ncurry,
    compose
} from "./helpers"

describe("id function", () => {
    it("should return what is passed", () => {
        const val = "hello";
        expect(id(val)).to.equal(val);
    })
});

describe("throwError function", () => {
    it("should throw an error", () => {
        const val = "this is an error";
        expect(throwError.bind(null, val)).to.throw(val);
    })
});

describe("fmap function", () => {
    it("should map a functor", () => {
        const ar = [1,2,3];
        expect(fmap((a: number)=> a+1, ar)).to.deep.equal([2,3,4]);
    })

    it("should throw an error if a functor is not provided", ()=> {
        expect(fmap.bind(null, ()=>{}, 1)).to.throw("Functor not found")
    });

    it("should throw an error if a function is not provided", ()=> {
        expect(fmap.bind(null, 1, [1,2,3])).to.throw("function not provided")
    });
});

describe("Curry function", () => {

    const add = (a:number,b:number,c:number) => a+b+c;
    const curriedAdd = curry(add);

    it("should return a function", () => {
        const fn = () => {}
        expect(curry(fn)).to.be.a("function");
    });

    it("should throw an error if nothing is provided", ()=> {
        expect(curry.bind(null)).to.throw("Function not provided")
    });

    it("should throw an error if a valid function is not provided", ()=> {
        expect(curry.bind(null, 1)).to.throw("Function not provided")
    });

    it("should return the same value as the original uncurried function", ()=> {
        expect(curriedAdd(1)(2)(3)).to.eq(add(1,2,3))
    });

    it("should return a function when arguments count is less than the original number of arguments", function(){
        expect(curriedAdd(1,2)).to.be.a("function");
    });

    it("should return the result whenever the total number of arguments is greater than or equal to the original number of arguments", function(){
        expect(curriedAdd(1)(2)).to.be.a('function');
        expect(curriedAdd(1)(2)(3)).to.eq(6);
        expect(curriedAdd(1,2)(3)).to.eq(6);
        expect(curriedAdd(1)(2,3)).to.eq(6);
        expect(curriedAdd(1,2)(3,4,5,6,7)).to.eq(6);
    });
})

describe("Named Curry function", () => {

    const add = (arg:{a:number, b:number, c:number}) => arg.a+arg.b+arg.c;
    const curriedAdd = ncurry(add, ["a", "b", "c"]);

    it("should return a function", () => {
        const fn = () => {}
        expect(curry(fn)).to.be.a("function");
    });

    it("should throw an error if nothing is provided", ()=> {
        expect(curry.bind(null)).to.throw("Function not provided")
    });

    it("should throw an error if a valid function is not provided", ()=> {
        expect(curry.bind(null, 1)).to.throw("Function not provided")
    });

    it("should return the same value as the original uncurried function", ()=> {
        expect(curriedAdd({a:1})({b:2})({c:3})).to.eq(add({a:1, b:2, c:3}))
    });

    it("should return a function when arguments count is less than the original number of arguments", () => {
        expect(curriedAdd({a:1})).to.be.a("function");
    });

    it("should return the result whenever the total number of arguments is greater than or equal to the original number of arguments", () => {
        expect(curriedAdd({a:1})({b:2})).to.be.a('function');
        expect(curriedAdd({a:1})({b:2})({c:3})).to.eq(6);
        expect(curriedAdd({a:1,b:2})({c:3})).to.eq(6);
        expect(curriedAdd({a:1})({b:2, c:3})).to.eq(6);
        expect(curriedAdd({a:1, b:2})({c:3,d:4,e:5,f:6,g:7})).to.eq(6);
    });

    it("should return the same results regardless of order of arguments", ()=>{
        expect(curriedAdd({b:2})).to.be.a("function");
        expect(curriedAdd({b:2})({a:1})({c:3})).to.eq(6);
        expect(curriedAdd({c:2})({b:1})({a:3})).to.eq(6);
    });
})

describe("Compose function", () => {
    const add2 = (a: number) => a+2;
    const sub1 = (a: number) => a-1;
    it("should return a function", () => {
        expect(compose(add2, sub1)).to.be.a("function");
    })
    it("should throw an error if there is no function passed", () => {
        expect(compose.bind(null)).to.throw("Nothing to compose!");
    })
    it("should return the same value as the function call if only a single function is composed", () => {
        expect(compose(add2)(1)).to.equal(add2(1));
    });
    it("should return the same result as calling the functions individually", () => {
        expect(compose(add2, sub1)(1)).to.eq(2);
    })

})