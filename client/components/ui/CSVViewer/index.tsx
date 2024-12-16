import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@/components/ui"

interface ICSVViewerProps {
    csvData: string[][]
}

export const CSVViewer = (props: ICSVViewerProps) => {
    const { csvData } = props

    const MAX_DISPLAY_ITEMS = 10

    return (
        <div>
            {csvData.length > 0 && (
                <TableContainer>
                    <Table height={200}>
                        <TableHead items={csvData[0]} />
                        <TableBody>
                            {csvData.slice(1, MAX_DISPLAY_ITEMS + 1).map((row, rowIndex) => (
                                <TableRow key={rowIndex}>
                                    {row.map((cell, cellIndex) => (
                                        <TableCell key={cellIndex}>{cell}</TableCell>
                                    ))}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            {csvData.length > MAX_DISPLAY_ITEMS && (
                <p>
                    Showing {MAX_DISPLAY_ITEMS} items out of {csvData.length}
                </p>
            )}
        </div>
    )
}
