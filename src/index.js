// @flow

import flowParser from 'flow-parser';
import fs from 'fs';

const contents = fs.readFileSync('src/actions/actions.js', 'UTF-8');

const result = flowParser.parse(contents);

const typeMap = {
    NumberTypeAnnotation: 'number',
    StringTypeAnnotation: 'string',
    ArrayTypeAnnotation: 'array',
    AnyTypeAnnotation: 'any',
    BooleanTypeAnnotation: 'boolean',
    ObjectTypeAnnotation: 'Object',
};

function getType(prop, action) {
    let value;
    let type;
    if (typeof prop === 'string') {
        type = prop;
    } else {
        type = prop.value.type;
    }
    switch(type) {
        case 'StringLiteralTypeAnnotation' :
            value = prop.value.raw;
            break;
        case 'StringTypeAnnotation' :
            value = 'string';
            break;
        case 'NumberLiteralTypeAnnotation' :
            value = prop.value.raw;
            break;
        case 'NumberTypeAnnotation' :
            value = 'number';
            break;
        case 'ObjectTypeAnnotation' :
            if (typeof prop === 'string') {
                value = 'Object';
            } else {
                value = prop.value.properties
                    .map(prop => {
                        const value = getType(prop, action);
                        return {
                            key: prop.key.name,
                            value
                        };
                    })
                    .map(object => `${object.key}: ${object.value}`)
                    .join(', ');
                value = `{${value}}`;
            }
            break;
        case 'GenericTypeAnnotation' :
            value = prop.value.id.name;
            if (prop.value.id.name === 'Array') {
                const genericType = prop.value.typeParameters.params[0].type;
                switch (prop.value.typeParameters.params[0].type) {
                    case 'GenericTypeAnnotation' :
                        const name = prop.value.typeParameters.params[0].id.name;
                        value = `Array<${name}>`;
                        break;
                    case 'ObjectTypeAnnotation' :
                    case 'AnyTypeAnnotation' :
                    case 'NumberTypeAnnotation' :
                    case 'NumberLiteralTypeAnnotation' :
                    case 'StringTypeAnnotation' :
                    case 'StringLiteralTypeAnnotation' :
                    case 'BooleanTypeAnnotation' :
                    case 'BooleanLiteralTypeAnnotation' :
                        value = `Array<${getType(genericType)}>`;
                        break;
                    case 'UnionTypeAnnotation' :
                        value = buildSetType(prop.value.typeParameters.params[0].types, '|');
                        break;
                    case 'IntersectionTypeAnnotation' :
                        value = buildSetType(prop.value.typeParameters.params[0].types, '&');
                        break;
                    default :
                        debugger;
                        console.log('Unknown type for GenericTypeAnnotation -- ', action.name);
                        break;
                }
            }
            break;
        case 'BooleanLiteralTypeAnnotation' :
            value = prop.value.raw;
            break;
        case 'BooleanTypeAnnotation' :
            value = 'boolean';
            break;
        case 'ArrayTypeAnnotation' :
            value = 'array';
            if (prop.value.elementType && prop.value.elementType.type === 'GenericTypeAnnotation') {
                debugger;
                value = `${prop.value.elementType.id.name}[]`;
            }
            break;
        case 'AnyTypeAnnotation' :
            value = 'any';
            break;
        case 'UnionTypeAnnotation' :
            value = buildSetType(prop.value.types, '|');
            break;
        case 'IntersectionTypeAnnotation' :
            value = buildSetType(prop.value.types, '&');
            break;
        default :
            debugger;
            console.log('Unknown type! ', type);
            break;
    }
    return value;
}

function getGenericType(type) {
    if (type.type === 'GenericTypeAnnotation')
        return type.id.name;
    return 'Unknown generic type argh!';
}
function buildSetType(types, symbol) {
    return types
        .map(t => typeMap[t.type] ? typeMap[t.type] : getGenericType(t))
        .join(` ${symbol} `);
}

const types = result.body.map(type => {
    if (!/Action$/.test(type.declaration.id.name)) {
        return false;
    }
    const action = {
        name: type.declaration.id.name,
        props: []
    };
    action.props = type.declaration.right.properties.map(prop => {
        const value = getType(prop, action);
        return {
            key: prop.key.name,
            value
            // .raw = string literal
        };
    });
    return action;
}).filter( t => t !== false);

function lowercaseFirstLetter(string) {
    return string.charAt(0).toLowerCase() + string.slice(1);
}

const functions = types.map(type => {
    const functionName = lowercaseFirstLetter(type.name);

    const paramProps = type.props.filter(prop => prop.key !== 'type');
    const params = paramProps.map(prop => {
        return `${prop.key}: ${prop.value}`;
    });
    const paramsStr = params.join(', ');

    const returnProps = type.props.map(prop => {
        const value = prop.key ==='type' ? `: ${prop.value}` : '';
        return `${prop.key}${value}`;
    });
    const returnPropsStr = returnProps.join(",\n        ");
    return `function ${functionName}(${paramsStr}): ${type.name} {
    return {
        ${returnPropsStr}
    };
}`;
});

functions.map(f => console.log(f));

const cases = types.map(type => {
    const functionName = lowercaseFirstLetter(type.name);
    const typeProp = type.props.filter(prop => prop.key === 'type').pop();
    return `        case ${typeProp.value}:
            return ${functionName}(state, action);`;
});

function wrapInSwitch(cases) {
    const casesStr = cases.join("\n");
    return `    switch (action.type) {
${casesStr}
        default:
            return state;
    }`;
}

function wrapInReducer(switchCase) {
    return `export default (state: State = initialState, action: Action): State ) {
${switchCase}
}`;
}

console.log(wrapInReducer(wrapInSwitch(cases)));

/*

export default function efficiencyReport(state: State = initialState, action: Action): State {

    switch (action.type) {
        case 'efficiency-report/SET_PAGE':
            return setPage(state, action);
        case 'efficiency-report/SET_HAS_NEW_DATA':
            return setHasNewData(state, action);
        case 'efficiency-report/SET_SORT':
            return setSort(state, action);
        case 'efficiency-report/UPDATE_FILTERS':
            return updateFilters(state, action);
        default:
            return state;
    }
}
*/