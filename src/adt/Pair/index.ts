import PairType from "./pair-type";

// tslint:disable-next-line
function Pair(v1: any, v2: any): PairType<any, any> {
    return new PairType(v1, v2);
}
Pair.of = PairType.prototype.of;
// @ts-ignore: implicit any
Pair.prototype["fantasy-land/of"] = PairType.prototype.of;

export default Pair;
