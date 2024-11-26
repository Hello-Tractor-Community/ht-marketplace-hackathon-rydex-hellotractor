/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Box,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
} from "@mui/material";
import { FC, useEffect, useMemo, useState } from "react";
import camelCaseToSpaced from "../../utils/camelToSpaced";
import { Delete } from "@mui/icons-material";

type Props = {
  tableData: {
    [key: string]: any;
  }[];
  onRecordClick?: (record: any, index: number) => void;
  onDelete?: (record: any) => void;
  filter?: string;
  hideColumns?: string[];
  getValue?: (key: string, value: any) => any;
  getHeader?: (key: string) => any;
  disablePagination?: boolean;
};

const CoolTable: FC<Props> = ({
  tableData,
  onRecordClick,
  onDelete,
  getValue,
  filter,
  hideColumns,
  getHeader,
  disablePagination,
}) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (_: any, newPage: number) => {
    setPage(newPage);
  };

  useEffect(() => {
    setPage(0);
  }, [tableData]);

  const handleChangeRowsPerPage = (event: any) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const data = useMemo(() => tableData, [tableData]);

  const paginatedData = useMemo(
    () =>
      rowsPerPage > 0
        ? data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
        : data,
    [data, page, rowsPerPage]
  );

  const filteredData = useMemo(
    () =>
      paginatedData.filter((row) =>
        Object.values(row).some((value) =>
          filter
            ? value.toString().toLowerCase().includes(filter.toLowerCase())
            : true
        )
      ),
    [paginatedData, filter]
  );

  return (
    <>
      <Box sx={{ width: "100%", overflow: "auto" }}>
        <Table size="small">
          {data.length > 0 ? (
            <>
              <TableHead>
                <TableRow>
                  {Object.keys(tableData[0]).map((header) => {
                    if (hideColumns?.includes(header)) return null;

                    return (
                      <TableCell key={header} sx={{ fontWeight: "bold" }}>
                        {getHeader
                          ? getHeader(header)
                          : camelCaseToSpaced(header)}
                      </TableCell>
                    );
                  })}
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredData.map((row, index) => (
                  <TableRow
                    key={"row" + index}
                    onClick={() => {
                      if (onRecordClick) onRecordClick(row, index);
                    }}
                    sx={{
                      ...(onRecordClick
                        ? {
                            cursor: "pointer",
                            "&:hover": {
                              backgroundColor: "#ccc",
                            },
                          }
                        : {}),

                      transition: "background-color 0.15s",
                    }}
                  >
                    {Object.keys(row).map((key, index) => {
                      if (hideColumns?.includes(key)) return null;

                      return (
                        <TableCell key={key + Math.random() * index}>
                          {getValue ? getValue(key, row[key]) : row[key]}
                        </TableCell>
                      );
                    })}
                    {onDelete !== undefined && (
                      <TableCell>
                        <IconButton onClick={() => onDelete(row)}>
                          <Delete />
                        </IconButton>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
                {!disablePagination && (
                  <TableRow>
                    <TablePagination
                      rowsPerPageOptions={[
                        5,
                        10,
                        25,
                        { label: "All", value: -1 },
                      ]}
                      colSpan={
                        tableData[0] ? Object.keys(tableData[0]).length : 1
                      }
                      count={tableData.length}
                      rowsPerPage={rowsPerPage}
                      page={page}
                      SelectProps={{
                        inputProps: {
                          "aria-label": "rows per page",
                        },
                        native: true,
                      }}
                      onPageChange={handleChangePage}
                      onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                  </TableRow>
                )}
              </TableBody>
            </>
          ) : (
            <TableBody>
              <TableRow>
                <TableCell>No Records</TableCell>
              </TableRow>
            </TableBody>
          )}
        </Table>
      </Box>
    </>
  );
};
export default CoolTable;
