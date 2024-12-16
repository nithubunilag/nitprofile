export const convertArrayToObject = (array: string[]): { [key: string]: string } => {
    const result: { [key: string]: string } = {}

    array.forEach((item) => {
        const [key, value] = item.split("=")
        result[key] = value
    })

    return result
}
