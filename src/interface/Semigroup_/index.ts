export default interface Semigroup {
    concat(s: Semigroup): Semigroup;
}
