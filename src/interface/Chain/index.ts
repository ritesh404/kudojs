import Apply from "../Apply";

export default interface Chain<A> extends Apply<A> {
    chain<B>(fn: (a: A) => Chain<B>): Chain<B>;
}
