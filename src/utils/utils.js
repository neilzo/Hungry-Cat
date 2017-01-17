export function isEmpty(object) {
    if (typeof object !== 'object') {
        throw new Error('That is not an object!');
    }
    // Good code is code that you can't read but just works
    // JK todo fix this unreadable mess
    return !(!!Object.keys(object).length);
}
