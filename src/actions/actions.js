export type NumberAction = {
    type: 'NUMBER',
    value: number
};

export type NumberLiteralAction = {
    type: 'NUMBER_LITERAL',
    value: 123
};

export type StringAction = {
    type: 'STRING',
    value: string
};

export type StringLiteralAction = {
    type: 'STRING_LITERAL',
    value: 'string-literal'
};

export type BooleanAction = {
    type: 'BOOLEAN',
    value: boolean
};

export type BooleanLiteralAction = {
    type: 'BOOLEAN_LITERAL',
    value: true
};
export type Generic = any;

export type GenericAction = {
    type: 'GENERIC',
    value: Generic
};
export type AnyAction = {
    type: 'ARRAY_GENERIC',
    value: any
};
export type GenericArrayAction = {
    type: 'GENERIC_ARRAY',
    value: Generic[]
};
export type ArrayObjectAction = {
    type: 'ARRAY_OBJECT',
    value: Array<{}>
};
export type ArrayGenericAction = {
    type: 'ARRAY_GENERIC',
    value: Array<Generic>
};
export type ArrayAnyAction = {
    type: 'ARRAY_ANY',
    value: Array<any>
};
export type ArrayNumberAction = {
    type: 'ARRAY_NUMBER',
    value: Array<number>
};
export type ArrayStringAction = {
    type: 'ARRAY_STRING',
    value: Array<string>
};
export type ArrayBooleanAction = {
    type: 'ARRAY_BOOLEAN',
    value: Array<boolean>
};
export type ArrayIntersectionAction = {
    type: 'ARRAY_INTERSECTION',
    value: Array<string & Object & number>
};
export type ArrayUnionAction = {
    type: 'ARRAY_UNION',
    value: Array<string | Object | number>
};
export type IntersectionAction = {
    type: 'INTERSECTION',
    value: string & Object & number
};
export type UnionAction = {
    type: 'UNION',
    value: string | Object | number
};
export type ObjectAction = {
    type: 'Object',
    value: {a: string, b: Object, c: any, d: number}
};

export type VariousAction = {
    type: 'Various',
    number: number,
    string: string,
    obj: Object,
    value: string | Object | number
};
export type SuperCooolAction = {
    type: 'super-cool/AWESOME',
    value: string
};
