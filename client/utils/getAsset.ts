export const getAsset = (filePath: string, type: "icons" | "images") => {
    return `/${type}/${filePath}`
}
