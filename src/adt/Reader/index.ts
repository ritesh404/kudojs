import ReaderType from "./reader-type";

function Reader(v:any){
    return new ReaderType(v);
}
Reader.of = ReaderType.prototype.of;
Reader.ask = ReaderType.prototype.ask;
// @ts-ignore: implicit any
Reader.prototype["fantasy-land/of"] = ReaderType.prototype.of;

export default Reader;
