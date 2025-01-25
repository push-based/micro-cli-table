/**
 * The console table method renders the index column as a string of numbers for array items.
 * This method removes the index column from the table string.
 *
 * @exapmle
 * before:
 * ┌─────────┬─────────┐
 * │ (index) │ Numbers │
 * ├─────────┼─────────┤
 * │ 0       │ 30      │
 * │ 1       │ 55      │
 * └─────────┴─────────┘
 * after:
 * ┌─────────┐
 * │ Numbers │
 * ├─────────┤
 * │ 30      │
 * │ 55      │
 * └─────────┘
 * @param opt
 */
export function indexColumn(opt?: false | {
    heading: string
}): (t: string) => string {
    return (rowString: string): string => {
        if (opt === false || opt == null) {
            return rowString.slice(0, 2) + rowString.slice(12);
        }
        const heading = opt?.heading ?? 'Index';
        if (rowString.includes('(index)')) {
            return rowString.replace('(index)', heading);
        }
        return rowString;
    }
}
