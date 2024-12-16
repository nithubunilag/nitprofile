// function getDirtyValues<DirtyFields extends Record<string, unknown>, Values extends Record<keyof DirtyFields, unknown>>(
//     dirtyFields: DirtyFields,
//     values: Values,
// ): Partial<typeof values> {
//     const dirtyValues = Object.keys(dirtyFields).reduce((prev, key) => {
//         // Unsure when RFH sets this to `false`, but omit the field if so.
//         if (!dirtyFields[key]) return prev

//         return {
//             ...prev,
//             [key]:
//                 typeof dirtyFields[key] === "object"
//                     ? getDirtyValues(dirtyFields[key] as DirtyFields, values[key] as Values)
//                     : values[key],
//         }
//     }, {})

//     return dirtyValues
// }

import { FieldValues } from "react-hook-form"

export const getDirtyValues = <T extends FieldValues>(
    allFields: T,
    dirtyFields: Partial<Record<keyof T, boolean>>,
): Partial<T> => {
    const changedFieldValues = Object.keys(dirtyFields).reduce((acc, currentField) => {
        return {
            ...acc,
            [currentField]: allFields[currentField],
        }
    }, {} as Partial<T>)

    return changedFieldValues
}
