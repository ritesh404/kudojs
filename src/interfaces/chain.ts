import Apply from "./apply";

export default interface Chain<A> extends Apply<A> {
    chain<B>(fn: (a: A) => Chain<B>): Chain<B>;
}
