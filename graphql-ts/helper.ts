import {
    graphql,
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString,
    GraphQLFloat,
    GraphQLBoolean,
    GraphQLList
} from 'graphql';

export function $args(func) {
    return (func + '')
        .replace(/[/][/].*$/mg, '') // strip single-line comments
        .replace(/\s+/g, '') // strip white space
        .replace(/[/][*][^/*]*[*][/]/g, '') // strip multi-line comments
        .split('){', 1)[0].replace(/^[^(]*[(]/, '') // extract the parameters
        //.replace(/=[^,]+/g, '') // strip any ES6 defaults
        .split(',').filter(Boolean); // split & filter [""]
}

export function getGraphQLType(type: string) {
    type = type.toLowerCase();
    if (type == "string" ) {
        return GraphQLString
    }
    if (type == "number") {
        return GraphQLFloat
    }
    if (type == "boolean") {
        return GraphQLBoolean
    }
}
