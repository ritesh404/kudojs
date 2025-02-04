interface PatternMatch {
    caseOf<T>(o: { [k: string]: (...args: any[]) => T }): T;
}

export default PatternMatch;
