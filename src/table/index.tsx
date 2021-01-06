import React, {FunctionComponent} from "react";
import TableContainer from "@material-ui/core/TableContainer";
import Table from "@material-ui/core/Table";
import PTableActions, {ParaTableActionInterface} from "./p-table-actions";
import PTableHeader from "./p-table-header";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import {ThemeProvider} from "@material-ui/core/styles";
import {ParaUIStyleProvider, whiteTheme} from "../providers";

interface ParaTableProps {
    actionsProps?: object;
    actions?: ParaTableActionInterface[]
}

function createData(name: string, calories: number, fat: number, carbs: number, protein: number) {
    return {name, calories, fat, carbs, protein};
}

const rows = [
    createData("Frozen yoghurt", 159, 6.0, 24, 4.0),
    createData("Ice cream sandwich", 237, 9.0, 37, 4.3),
    createData("Eclair", 262, 16.0, 24, 6.0),
    createData("Cupcake", 305, 3.7, 67, 4.3),
    createData("Gingerbread", 356, 16.0, 49, 3.9),
];

const ParaTable: FunctionComponent<ParaTableProps> = (props) => {
    const {actions, actionsProps} = props;
    return (
        <ThemeProvider theme={whiteTheme}>
            <ParaUIStyleProvider>
                <PTableActions {...actionsProps} actions={actions}/>
                <TableContainer className={"para-table"}>
                    <Table aria-label="para-table" size="small">
                        <PTableHeader/>
                        <TableBody>
                            {rows.map((row) => (
                                <TableRow key={row.name}>
                                    <TableCell component="th" scope="row">
                                        {row.name}
                                    </TableCell>
                                    <TableCell align="right">{row.calories}</TableCell>
                                    <TableCell align="right">{row.fat}</TableCell>
                                    <TableCell align="right">{row.carbs}</TableCell>
                                    <TableCell align="right">{row.protein}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </ParaUIStyleProvider>
        </ThemeProvider>
    );
};

export default ParaTable;
export {ParaTable};