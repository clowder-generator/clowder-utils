import {isBlank} from "./string-helper";

/**
 * Case:
 * - snake case
 * - kebab case
 * - camel case
 * - pascal case
 * - screaming snake case
 * - screaming kebab case
 */
export class CaseConversionError extends Error {
    constructor(msg: string) {
        super(msg);
        Object.setPrototypeOf(this, CaseConversionError.prototype);
    }
}

export class Case {

    private readonly _words: string[] = [];
    get words() {
        return this._words;
    }

    constructor(private strs: string[]) {
        if (strs.length === 0) {
            throw new CaseConversionError("Cannot build case object with empty array");
        }
        if (strs.some(e => isBlank(e))) {
            throw new CaseConversionError("Cannot build case object with blank string in the array");
        }
        this._words = [...strs];
    }

    public toKebabCase(): string {
        return this._words.join("-");
    }

    public toCamelCase(): string {
        return Case.unCapitalize(this.toPascalCase());
    }

    public toSnakeCase(): string {
        return this._words.join("_");
    }

    public toPascalCase(): string {
        return this._words
            .map(e => Case.capitalize(e))
            .join("");
    }

    public toScreamingSnakeCase(): string {
        return this._words
            .map(e => e.toUpperCase())
            .join("_");
    }

    public toScreamingKebabCase(): string {
        return this._words
            .map(e => e.toUpperCase())
            .join("-");
    }

    private static capitalize(str: string) {
        const first = str.charAt(0);
        const remaining = str.slice(1);
        return first.toUpperCase() + remaining;
    }

    private static unCapitalize(str: string) {
        const first = str.charAt(0);
        const remaining = str.slice(1);
        return first.toLowerCase() + remaining;
    }
}

export const fromSnakeCase = (str: string): Case => {
    assertValidForConvertion(str);

    if (!/^[a-z0-9]+(_[a-z0-9]+)*$/.test(str)) {
        throw new CaseConversionError(`the string "${str}" does not match snakeCase pattern`);
    }

    return new Case(
        str.split("_")
    );
}

export const fromKebabCase = (str: string): Case => {
    assertValidForConvertion(str);

    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(str)){
        throw new CaseConversionError(`the string "${str}" does not match kebabCase pattern`);
    }
    return new Case(
        str.split("-")
    );
}

export const fromCamelCase = (str: string): Case => {
    assertValidForConvertion(str);

    if (!/^[a-z0-9]+([A-Z0-9][a-z0-9]*)*$/.test(str)){
        throw new CaseConversionError(`the string "${str}" does not match camelCase pattern`);
    }
    return new Case(splitWordOnUpperCaseChar(str));
}

export const fromPascalCase = (str: string): Case => {
    assertValidForConvertion(str);

    if (!/^([A-Z0-9][a-z0-9]*)*$/.test(str)){
        throw new CaseConversionError(`the string "${str}" does not match pascalCase pattern`);
    }

    return new Case(splitWordOnUpperCaseChar(str));
}

export const fromScreamingSnakeCase = (str: string): Case => {
    assertValidForConvertion(str);

    if (!/^[A-Z0-9]+(_[A-Z0-9]+)*$/.test(str)) {
        throw new CaseConversionError(`the string "${str}" does not match screamingSnakeCase pattern`);
    }

    return new Case(
        str.split("_")
            .map(e => e.toLowerCase())
    );
}

export const fromScreamingKebabCase = (str: string): Case => {
    assertValidForConvertion(str);

    if (!/^[A-Z0-9]+(-[A-Z0-9]+)*$/.test(str)) {
        throw new CaseConversionError(`the string "${str}" does not match screamingKebabCase pattern`);
    }

    return new Case(
        str.split("-")
            .map(e => e.toLowerCase())
    );
}

const assertDoesNotContainsImproperChar = (str: string) => {
    if (!/^[a-zA-Z0-9_-]+$/.test(str)) {
        throw new CaseConversionError("invalid string with special char");
    }
}

const assertNotEmptyString = (str: string) => {
    if (str === "") {
        throw new CaseConversionError("invalid empty string");
    }
}


const assertNoBlankInWord = (str: string) => {
    if (/^.*\s+$.*/.test(str)) {
        throw new CaseConversionError("invalid string with blank char");
    }
}

const assertValidForConvertion = (str: string) => {
    assertNotEmptyString(str);
    assertNoBlankInWord(str);
    assertDoesNotContainsImproperChar(str)
}

const splitWordOnUpperCaseChar = (str: string): string[] => {
    return str.split("")
        .reduce((acc, cur) => {
            if (acc.length === 0 || /[A-Z]/.test(cur)) {
                acc.push(cur);
            } else {
                acc[acc.length-1] = acc[acc.length-1] + cur;
            }
            return acc
        }, [])
        .map(e => e.toLowerCase());
}