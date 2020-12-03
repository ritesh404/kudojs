import Alt from "../Alt";

export default interface Plus<A> extends Alt<A> {
    zero(): Plus<A>;
}
