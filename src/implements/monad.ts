export default interface Monad {
    chain(fn: Function): Monad
}