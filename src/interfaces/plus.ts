import { Alt } from "./alt";

export default interface Plus<A> extends Alt<A> {
    zero(): Plus<A>;
}
