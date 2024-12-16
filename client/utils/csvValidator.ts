export const isCsvValid = (csvFile: string): boolean => {
    const expectedHeadings = ["Name", "Email", "Phone", "Address"]

    const rows = csvFile.split("\n").map((row) => row.split(","))

    if (rows.length <= 1) return false

    const csvHeadings = rows[0]

    return csvHeadings.length === expectedHeadings.length && csvHeadings.every((v, i) => v === expectedHeadings[i])
}
