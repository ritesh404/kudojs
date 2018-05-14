import StateType from "./state-type";

// tslint:disable-next-line
const State: any = (v: any) => new StateType(v);
State.of = StateType.prototype.of;
State.get = StateType.prototype.get;
State.put = StateType.prototype.put;
// @ts-ignore: implicit any
State.prototype["fantasy-land/of"] = StateType.prototype.of;

export default State;
