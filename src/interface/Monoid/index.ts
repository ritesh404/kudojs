import Semigroup from "../Semigroup";

export default interface Monoid extends Semigroup {
    empty(): Monoid;
}
