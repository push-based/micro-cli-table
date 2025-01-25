/**
 * Replaces quotes in the table string with spaces.
 *
 * @example
 * before:
 * │ 'Satu`s' │
 * │ "Satu's" │
 * │ 'Satu`s' │
 * after:
 * │ Satu`s │
 * │ Satu's │
 * │ Satu`s │
 *
 */
import type {RowFormatter} from "./table";


export function removeDefaultDataStyles() {
    return (rawRow: string): string => {
        if (!rawRow.includes('│')) return rawRow;
        const parts = rawRow.split('│');
        for (let i = 0; i < parts.length; i++) {
            const trimmed = (parts?.[i] ?? '').trim();
            if ((trimmed.startsWith("'") && trimmed.endsWith("'")) || (trimmed.startsWith('"') && trimmed.endsWith('"'))) {
                parts[i] = ` ${trimmed.slice(1, -1).trim()} `;
            }
        }
        return parts.join('│');
    }
}
