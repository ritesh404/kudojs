import IdentityType from "./indentity-type";

// tslint:disable-next-line
const Identity: any = (v: any) => new IdentityType(v);
Identity.of = IdentityType.prototype.of;
// @ts-ignore: implicit any
Identity.prototype["fantasy-land/of"] = IdentityType.prototype.of;

export default Identity;
