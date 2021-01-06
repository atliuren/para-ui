import React, { FunctionComponent } from 'react';
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";

interface PTableHeaderProps {}

const PTableHeader: FunctionComponent<PTableHeaderProps> = () => {

  return (
      <TableHead>
          <TableRow>
              <TableCell>Dessert (100g serving)</TableCell>
              <TableCell align="right">Calories</TableCell>
              <TableCell align="right">Fat&nbsp;(g)</TableCell>
              <TableCell align="right">Carbs&nbsp;(g)</TableCell>
              <TableCell align="right">Protein&nbsp;(g)</TableCell>
          </TableRow>
      </TableHead>
  );
};

export default PTableHeader;
