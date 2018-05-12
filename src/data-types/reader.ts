import ReaderType from "./reader-type";

// tslint:disable-next-line
const Reader: any = (v: any) => new ReaderType(v);
Reader.of = ReaderType.prototype.of;
// @ts-ignore: implicit any
Reader.prototype["fantasy-land/of"] = ReaderType.prototype.of;

export default Reader;
