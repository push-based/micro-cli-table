import {describe, expect} from "vitest";
import {table} from "./table.js";
import {borderStyle} from "./border.format";
import {double} from "./border/double";
import {alignment} from "./alignment.format";
import { indexColumn } from "./index.format";
import { removeDefaultDataStyles } from "./data-styles.format";

// removes all color codes from the output for snapshot readability
export function removeColorCodes(stdout: string) {
    // eslint-disable-next-line no-control-regex
    return stdout.replace(/\u001B\[\d+m/g, '');
}

describe("removeDefaultDataStyles", () => {
    it.each([
        "'",
        '"',
    ])('should remove quotes (%s) correctly', (quote) => {
        expect(removeDefaultDataStyles()(`│ ${quote}test'"test${quote} │`)).toBe(`│ test'"test │`);
    });
});

describe('indexColumn', () => {
    it.each([
        ['┌─────────┬─────────┐', '┌─────────┐'],
        ['│ (index) │ Numbers │', '│ Numbers │'],
        ['├─────────┼─────────┤', '├─────────┤'],
        ['│ 0       │ 30      │', '│ 30      │'],
        ['│ 1       │ 55      │', '│ 55      │'],
        ['└─────────┴─────────┘', '└─────────┘']
    ])('should remove the index column from a table row', (row, newRow) => {
        expect(indexColumn()(row)).toBe(newRow);
    });
});

describe("table", () => {
    it('should render single string', () => {
        expect('\n' + removeColorCodes(table('test'))).toMatchInlineSnapshot(`
      "
      te
      "
    `)
    });

    it('should render single object', () => {
        expect('\n' + removeColorCodes(table({name: 'Mura', age: 20}))).toMatchInlineSnapshot(`
          "
          ┌─────────┬────────┐
          │ (index) │ Values │
          ├─────────┼────────┤
          │ name    │ 'Mura' │
          │ age     │ 20     │
          └─────────┴────────┘
          "
        `);
    });

    it('should render array of primitives', () => {
        expect('\n' + removeColorCodes(table([1, 2, 3, 4]))).toMatchInlineSnapshot(`
          "
          ┌─────────┬────────┐
          │ (index) │ Values │
          ├─────────┼────────┤
          │ 0       │ 1      │
          │ 1       │ 2      │
          │ 2       │ 3      │
          │ 3       │ 4      │
          └─────────┴────────┘
          "
        `)
    });

    it('should render array of arrays', () => {
        expect('\n' + removeColorCodes(table([[1, 2, 3, 4], [1, 2, 3, 4]]))).toMatchInlineSnapshot(`
          "
          ┌─────────┬───┬───┬───┬───┐
          │ (index) │ 0 │ 1 │ 2 │ 3 │
          ├─────────┼───┼───┼───┼───┤
          │ 0       │ 1 │ 2 │ 3 │ 4 │
          │ 1       │ 1 │ 2 │ 3 │ 4 │
          └─────────┴───┴───┴───┴───┘
          "
        `)
    });

    it('should render \' ', () => {
        expect('\n' + removeColorCodes(table([{prop: `Should render (')`}]))).toMatchInlineSnapshot(`
          "
          ┌─────────┬─────────────────────┐
          │ (index) │ prop                │
          ├─────────┼─────────────────────┤
          │ 0       │ "Should render (')" │
          └─────────┴─────────────────────┘
          "
        `)
    });

    it('should render \" ', () => {
        expect('\n' + removeColorCodes(table([{prop: `Should render (")`}]))).toMatchInlineSnapshot(`
          "
          ┌─────────┬─────────────────────┐
          │ (index) │ prop                │
          ├─────────┼─────────────────────┤
          │ 0       │ 'Should render (")' │
          └─────────┴─────────────────────┘
          "
        `)
    });

    it('should render " ', () => {
        expect('\n' + removeColorCodes(table([{prop: `Should render (\`)`}]))).toMatchInlineSnapshot(`
          "
          ┌─────────┬─────────────────────┐
          │ (index) │ prop                │
          ├─────────┼─────────────────────┤
          │ 0       │ 'Should render (\`)' │
          └─────────┴─────────────────────┘
          "
        `)
    });

    it('should take a row formatter function', (quote) => {
        const formatterSpy = vi.fn((str: string): string => str.replace(/'/g, '*'));
        expect('\n' + removeColorCodes(table([{prop: `00'0`}, {prop: `00'1`}], {
            rowFormatter: [formatterSpy]
        })))
            .toContain(`"00*0"`);
    });

    it('should take a table formatter function', (quote) => {
        const formatterSpy = vi.fn((str: string): string => str.replace(/'/g, '*'));
        expect('\n' + removeColorCodes(table([{prop: "00'0"}, {prop: 1}], {
            rowFormatter: [formatterSpy]
        })))
            .toContain(`"00*0"`);
    });

    it('should take a borderStyle formatter function', (quote) => {
        expect('\n' + removeColorCodes(table([{prop: "12345678910"}], {
            rowFormatter: [borderStyle(double)]
        })))
            .toMatchInlineSnapshot(`
              "
              ╔═════════╦═══════════════╗
              ║ (index) ║ prop          ║
              ╠═════════╬═══════════════╣
              ║ 0       ║ '12345678910' ║
              ╚═════════╩═══════════════╝
              "
            `);
    });

    it('should take a alignment formatter function', (quote) => {
        expect('\n' + removeColorCodes(table([{num: "12345678910"}, {num: "213"}], {
            rowFormatter: [alignment('center')]
        })))
            .toMatchInlineSnapshot(`
              "
              ┌─────────┬───────────────┐
              │(index)│num│
              ├─────────┼───────────────┤
              │0│'12345678910'│
              │1│'213'│
              └─────────┴───────────────┘
              "
            `);
    });
});
