import PairType, {_of} from "./pair-type"

const Pair: any = (v1: any, v2: any) => new PairType(v1, v2);
Pair.of = _of;

export default Pair;