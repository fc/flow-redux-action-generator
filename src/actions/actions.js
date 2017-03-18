/*
export type NumberAction = {
    type: 'module-name/NUMBER',
    value: number
};

export type NumberLiteralAction = {
    type: 'module-name/NUMBER_LITERAL',
    value: 123
};

export type StringAction = {
    type: 'module-name/STRING',
    value: string
};

export type StringLiteralAction = {
    type: 'module-name/STRING_LITERAL',
    value: 'string-literal'
};

export type BooleanAction = {
    type: 'module-name/BOOLEAN',
    value: boolean
};

export type BooleanLiteralAction = {
    type: 'module-name/BOOLEAN_LITERAL',
    value: true
};

export type Generic = any;

export type GenericAction = {
    type: 'module-name/GENERIC',
    value: Generic
};

export type AnyAction = {
    type: 'module-name/ARRAY_GENERIC',
    value: any
};

export type GenericArrayAction = {
    type: 'module-name/GENERIC_ARRAY',
    value: Generic[]
};

export type ArrayObjectAction = {
    type: 'module-name/ARRAY_OBJECT',
    value: Array<{}>
};

export type ArrayGenericAction = {
    type: 'module-name/ARRAY_GENERIC',
    value: Array<Generic>
};

export type ArrayAnyAction = {
    type: 'module-name/ARRAY_ANY',
    value: Array<any>
};

export type ArrayNumberAction = {
    type: 'module-name/ARRAY_NUMBER',
    value: Array<number>
};

export type ArrayStringAction = {
    type: 'module-name/ARRAY_STRING',
    value: Array<string>
};
export type ArrayBooleanAction = {
    type: 'module-name/ARRAY_BOOLEAN',
    value: Array<boolean>
};
*/
export type ArrayIntersectionAction = {
    type: 'module-name/ARRAY_INTERSECTION',
    value: Array<string & Object & number>
};
export type ArrayUnionAction = {
    type: 'module-name/ARRAY_INTERSECTION',
    value: Array<string | Object | number>
};