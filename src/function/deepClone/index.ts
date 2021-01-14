export default function objectDeepClone(o: any) {
    if (o == null || typeof o !== "object") return o;
    const clone: any = Array.isArray(o) ? [] : {};
    Object.keys(o).map(k => {
        if (o.hasOwnProperty(k)) {
            clone[k] = objectDeepClone(o[k]);
        }
    });

    return clone;
}
