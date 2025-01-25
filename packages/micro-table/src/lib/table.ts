import {Console} from 'node:console';
import {PassThrough} from 'node:stream';
import {removeDefaultDataStyles} from "./data-styles.format";

// Create a custom transform stream that high jacks the stdout stream
const ts = new PassThrough();

// Initialize a console instance with the transform stream to capture the formatted table
const logger = new Console({stdout: ts});

export type RowFormatter<I extends string = string, O extends string = string> = (t: I, i?: number, r?: I[]) => O | O[];

type Primitive = string | number | boolean;

interface NestedRecord<T = Primitive> {
    [key: string]: T | NestedRecord<T>;
}

type TabularData<T = Primitive> = Array<NestedRecord<T>> | NestedRecord<T> | Symbol | undefined;

/**
 * Renders the provided data as a table string.
 *
 * @example
 * const data = [{ name: 'Satu', 'The Age': 30 }, { name: 'Mura', 'The Age': 25 }];
 *
 * console.log(table(data));
 * ┌────────┬─────┐
 * │ name   │ Age │
 * ├────────┼─────┤
 * │ Satu   │ 30  │
 * │ Mura   │ 25  │
 * └────────┴─────┘
 *
 * console.log(table(data, {rowFormatter: [borderStyle(double)]}));
 *  ╔═══════╦═════╗
 *  ║ Name  ║ Age ║
 *  ╠═══════╬═════╣
 *  ║ Satu  ║ 30  ║
 *  ║ Mura  ║ 25  ║
 *  ╚═══════╩═════╝
 */
export function table<T>(data: TabularData<T>, opt?: {
    propertyFilter?: (keyof TabularData<T>)[],
    rowFormatter?: RowFormatter[]
}): string {
    const rowFormats: RowFormatter[] = [removeDefaultDataStyles(), ...(Array.isArray(opt?.rowFormatter) ? opt?.rowFormatter : [])];
    return String(logger.table(data) ?? ts.read())
        .split(`\n`)
        .flatMap((line, _, rows) =>
            rowFormats
                .reduce((acc, fn) => acc
                        .flatMap((row: string) => {
                            const formatted = fn(row, acc.indexOf(row), rows);
                            return Array.isArray(formatted) ? formatted : [formatted];
                        }),
                    [line] // work with arrays to enable higher order formatter
                )
        )
        .join(`\n`);
}

