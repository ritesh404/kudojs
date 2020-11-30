export default function constant<A>(x: A): () => A {
    return function constant_() {
        return x;
    };
}
