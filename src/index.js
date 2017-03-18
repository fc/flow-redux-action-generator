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

function getType(action, prop) {
    let value;
    switch(prop.value.type) {
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
        case 'GenericTypeAnnotation' :
            value = prop.value.id.name;
            if (prop.value.id.name === 'Array') {
                switch (prop.value.typeParameters.params[0].type) {
                    case 'GenericTypeAnnotation' :
                        const name = prop.value.typeParameters.params[0].id.name;
                        value = `Array<${name}>`;
                        break;
                    case 'AnyTypeAnnotation' :
                        value = 'Array<any>';
                        break;
                    case 'ObjectTypeAnnotation' :
                        value = 'Array<{}>';
                        break;
                    case 'NumberTypeAnnotation' :
                        value = 'Array<number>';
                        break;
                    case 'StringTypeAnnotation' :
                        value = 'Array<string>';
                        break;
                    case 'BooleanTypeAnnotation' :
                        value = 'Array<boolean>';
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
        default :
        debugger;
        // case 'ArrayTypeAnnotation' :
            value = 'Array<...>';
            break;
            // ObjectTypeAnnoation
            // FunctionTypeAnnotation
            // and more!
    }
    return value;
}
function buildSetType(types, symbol) {
    return types
        .map(t => typeMap[t.type] ? typeMap[t.type] : console.log('Unknown type: ', t.type))
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
        const value = getType(action, prop);
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