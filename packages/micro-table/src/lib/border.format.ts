function escapeRegex(s: string): string {
    return s.replace(/[.*+?^${}()|[\]\\]/g, String.raw`\$&`);
}

export function borderStyle( styleMap: Record<string, string>) {
   return (row: string): string => {
        const styleKeys = Object.keys(styleMap);
        if (styleKeys.length === 0) return row;

        const regex = new RegExp(styleKeys.map(escapeRegex).join('|'), 'g');
        return row.replace(regex, char => styleMap[char] || char);
    }
}
