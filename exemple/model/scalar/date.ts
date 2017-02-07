import { scalarType, field } from './../../../index';
import { Kind } from 'graphql/language'

const coerceDate = (value: any) => {
    console.log('VALUE', value);
    const date = new Date(value)

    return date
}

@scalarType
export class DateQl {
    @field
    serialize(value: any) {
        return new Date(value).toISOString()
    };
    @field
    parseValue(value: any) {
        const date = new Date(value)
        return date
    }
    @field
    parseLiteral(valueNode: any): any {
        const kind = valueNode.kind;
        const value = valueNode.value;
        let date
        switch (kind) {
            case Kind.INT:
            case Kind.FLOAT:
                date = new Date(+value)
                break
            case Kind.STRING:
                date = new Date(value)
                break
            default:
        }
        return date
    }
}