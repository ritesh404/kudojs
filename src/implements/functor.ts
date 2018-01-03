export default interface Functor {
    map(fn: Function): Functor
}