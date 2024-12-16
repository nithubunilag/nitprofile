export const convertToUpperCaseWithUnderscore = (inputString: string): string => {
  // Split the input string into words
  const words = inputString.split(" ")

  // Capitalize each word and join them with underscores
  const formattedString = words.map((word) => word.toUpperCase()).join("_")

  return formattedString
}
