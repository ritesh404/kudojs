import IdentityType from "./indentity-type";

function Identity(v: any): IdentityType<any> {
    return new IdentityType(v);
}
Identity.of = IdentityType.prototype.of;

Identity.prototype["fantasy-land/of"] = IdentityType.prototype.of;

export default Identity;
