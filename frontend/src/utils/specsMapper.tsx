import { TableCell, TableRow } from "@mui/material";
import camelCaseToSpaced from "./camelToSpaced";

export const specificationMapper = (specs: object) => {
  return (
    specs &&
    Object.entries(specs)
      .filter(([, val]) => val)
      .map(([key, value]) => {
        if (Array.isArray(value)) {
          if (!value.length) return null;
          return (
            <TableRow key={key}>
              <TableCell>{camelCaseToSpaced(key)}</TableCell>
              <TableCell>
                <ul>
                  {value.map((val, i) => (
                    <li key={i}>{val}</li>
                  ))}
                </ul>
              </TableCell>
            </TableRow>
          );
        }
        if (typeof value === "object") {
          return (
            <TableRow key={key}>
              <TableCell>{key}</TableCell>
              <TableCell>{specificationMapper(value)}</TableCell>
            </TableRow>
          );
        }

        return (
          <TableRow key={key}>
            <TableCell>{camelCaseToSpaced(key)}</TableCell>
            <TableCell>
              {typeof value === "string" ? camelCaseToSpaced(value) : value}
            </TableCell>
          </TableRow>
        );
      })
      .filter(Boolean)
  );
};
