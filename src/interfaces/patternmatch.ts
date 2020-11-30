export default interface PatternMatch {
    caseOf(o: { [k: string]: (a: any) => any }): any;
}
