declare module 'jian-pinyin' {
    export function getSpell(char: string, fn: (char: string, spell: string[]) => string): string;
}