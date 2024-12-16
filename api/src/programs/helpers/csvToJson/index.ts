import type { Readable } from "stream"
import csvToJson from "csvtojson"
import type { Converter } from "csvtojson/v2/Converter"
import type { IProgramUser } from "@/programs/payload_interfaces"

interface CSVToJSONConverter<T> {
    convert(csvFilePath: string): Promise<T[]>
    stream(readableStream: Readable, onData: (data: T) => void): void
}

class CSVTOJSON<T> implements CSVToJSONConverter<T> {
    constructor(private converter: Converter = csvToJson()) {}

    async convert(csvFilePath: string): Promise<T[]> {

        return await this.converter.fromFile(csvFilePath)
    }

    stream = (readableStream: Readable, onData: (data: T) => void): void => {
        const stream = this.converter.fromStream(readableStream)

        stream.subscribe(onData)
    }
}

export const customCsvToJsonConverter = new CSVTOJSON<IProgramUser>()
