export function without(input: Object, keys: string[]): Object {
    return Object.fromEntries(
        Object.entries(input).filter(([key]) => !keys.includes(key)),
    );
}
