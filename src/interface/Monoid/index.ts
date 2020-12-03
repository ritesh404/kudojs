import Semigroup from "../semigroup";

export default interface Monoid extends Semigroup {
    empty(): Monoid;
}
