import type {RowFormatter} from "./table";

export function alignment(align: 'left' | 'center' | 'right'): RowFormatter {
    return (...[row, index, rows]: Parameters<RowFormatter>): ReturnType<RowFormatter> => {
        const columnWidths = (rows as string[]).find(line => line.includes('┬'))
            ?.split('│')
            .slice(1, -1)
            .map(segment => segment.trim().length) || [];

        if (!row.includes('│')) return row;
        const columns = row.split('│');
        return columns
            .map((col, i) =>
                i === 0 || i === columns.length - 1
                    ? col
                    : alignText(col.trim(), columnWidths[i - 1] || col.trim().length, align)
            ).join('│');
    }
}

function alignText(text: string, width: number, align: 'left' | 'center' | 'right'): string {
    const padding = Math.max(width - text.length, 0);
    if (align === 'left') return text + ' '.repeat(padding);
    if (align === 'right') return ' '.repeat(padding) + text;
    const leftPadding = Math.floor(padding / 2);
    const rightPadding = padding - leftPadding;
    return ' '.repeat(leftPadding) + text + ' '.repeat(rightPadding);
}
