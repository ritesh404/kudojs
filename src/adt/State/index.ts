import StateType from "./state-type";

function State(v: any) {
    return new StateType(v);
}
State.of = StateType.prototype.of;
State.get = StateType.prototype.get;
State.put = StateType.prototype.put;
// @ts-ignore: implicit any
State.prototype["fantasy-land/of"] = StateType.prototype.of;

export default State;
