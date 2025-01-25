# Micro Table

A extremely lightweight TypeScript table rendering for the terminal.

**Features:**

- [x] Extremely lightweight
- [x] No dependencies
- [x] Custom border style
- [x] Format hooks for rows

## Benchmarks

<details>
<summary><code>table.js</code></summary>

```typescript
import {Console} from 'node:console';
import {PassThrough} from 'node:stream';

const ts = new PassThrough();
const logger = () => {
    return new Console({stdout: ts}).table(data);
}

export function table(data: any, opt): string {
    const rowFormats = opt?.rowFormats ?? [];
    return String(logger.table(data) ?? ts.read())
        .split(`\n`)
        .flatMap((line, _, rows) =>
            rowFormats
                .reduce((acc, fn) => acc.flatMap(row => {
                        const formatted = fn(row, acc.indexOf(row), rows);
                        return Array.isArray(formatted) ? formatted : [formatted];
                    }), [line])
        )
        .join(`\n`);
}
```

</details>

| **File Name**         | **CJS** | **ESM** |
|-----------------------|---------|---------|
| `alignment.format.js` | 1.0 KB  | 1.10 KB |
| `border.format.js`    | 0.9 KB  | 0.95 KB |
| `table.js`            | 2.37 KB | 2.33 KB |

## Installation

```sh   
npm install @push-based/micro-table
```

### Usage

```ts
import {table} from '@push-based/micro-table';

const strigTable = table([
    {
        name: 'Alice',
        age: 25,
    },
    {
        name: 'Bob',
        age: 30,
    }
]);

// Output:
// ┌───────┬─────┐
// │ Name  │ Age │
// ├───────┼─────┤
// │ Alice │  25 │
// │ Bob   │  30 │
// └───────┴─────┘
console.log(strigTable);
```

#### Border Style

By default, the table has a border style of `single`.

You can change the border style by using the `borderStyle` helper with one of the following styles:

- `single`
- `double`
- `round`
- `zigzag`

```ts
import {table, borderStyle} from '@push-based/micro-table';

const strigTable = table(data, {
    rowFormats: [
        borderStyle('double')
    ]
});

// Output:
// ╔═══════╦═════╗
// ║ Name  ║ Age ║
// ╠═══════╬═════╣
// ║ Alice ║ 30  ║
// ║ Bob   ║ 25  ║
// ╚═══════╩═════╝
console.log(strigTable);
```

##### Custom Border Style

You can also create a custom border style by using the `borderStyle` helper with a custom character set.

```ts
import {table, borderStyle} from '@push-based/micro-table';

const strigTable = table(data, {
    rowFormats: [
        borderStyle({
            '┌': '┏',
            '┐': '┓',
            '└': '┗',
            '┘': '┛',
            '─': '━',
            '│': '┃',
            '┼': '╋',
            '├': '┣',
            '┤': '┫',
            '┬': '┳',
            '┴': '┻',
        })
    ]
});
```
