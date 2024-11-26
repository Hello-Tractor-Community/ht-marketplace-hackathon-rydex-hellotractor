/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  InputAdornment,
  Stack,
  TableContainer,
  TextField,
  Typography,
} from "@mui/material";
import { FC, ReactNode, useMemo, useState } from "react";
import { downloadExcel } from "react-export-table-to-excel";
import dayjs from "dayjs";
import camelCaseToSpaced from "../../utils/camelToSpaced";
import { Search } from "@mui/icons-material";
import CoolTable from "./CoolTable";

type Props = {
  rows: {
    [key: string]: any;
  }[];
  title: string;

  /**
   * Show this element on the right side of the title
   */
  action?: JSX.Element & ReactNode;

  /**
   * Show this element below the title
   */
  action2?: JSX.Element & ReactNode;
  hideColumns?: string[];
  getValue?: (key: string, value: any) => any;
  onRecordClick?: (record: any, index: number) => void;
  exportable?: boolean;
  exportName?: string;
  caption?: string;
  getHeader?: (key: string) => any;
  search?: boolean;
};
const TableCard: FC<Props> = ({
  rows,
  title,
  onRecordClick,
  getValue,
  action,
  hideColumns,
  exportable = true,
  exportName,
  caption,
  getHeader,
  search = false,
  action2,
}) => {
  const [searchText, setSearchText] = useState<string>("");
  const filteredRows = useMemo(() => {
    return rows.filter((row) => {
      const values = Object.values(row);
      return values.some((value) => {
        if (typeof value === "string") {
          return value.toLowerCase().includes(searchText.toLowerCase());
        }
        return false;
      });
    });
  }, [rows, searchText]);

  const exportData = () => {
    if (rows.length === 0) return;

    const header = Object.keys(rows[0])
      .filter((key) => !hideColumns?.includes(key))
      .map((key) => camelCaseToSpaced(key));
    const body = rows.map((row) => {
      const newRow: any = {};
      Object.keys(row).forEach((key) => {
        if (!hideColumns?.includes(key)) {
          const gottenValue = getValue ? getValue(key, row[key]) : row[key];
          newRow[camelCaseToSpaced(key)] =
            typeof gottenValue === "string" ||
            typeof gottenValue === "number" ||
            typeof gottenValue === "boolean" ||
            typeof gottenValue === "bigint"
              ? gottenValue.toString()
              : row[key];
        }
      });

      return newRow;
    });
    downloadExcel({
      tablePayload: {
        header,
        body,
      },
      fileName: exportName ?? title ?? dayjs().valueOf(),
      sheet: exportName ?? title ?? dayjs().valueOf(),
    });
  };

  return (
    <Card>
      <CardHeader
        title={title}
        action={
          <Stack direction={"row"} spacing={2}>
            {search && (
              <TextField
                id="outlined-basic"
                label="Search"
                variant="outlined"
                size="small"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
            )}
            {action}
            {exportable && (
              <Button
                variant="contained"
                size="small"
                color="primary"
                onClick={() => exportData()}
              >
                Export
              </Button>
            )}
          </Stack>
        }
      />
      {caption && (
        <CardContent>
          <Typography variant="caption">{caption}</Typography>
        </CardContent>
      )}

      {action2}

      <TableContainer>
        <CoolTable
          getValue={getValue}
          tableData={filteredRows}
          onRecordClick={onRecordClick}
          hideColumns={hideColumns}
          getHeader={getHeader}
        />
      </TableContainer>
    </Card>
  );
};

export default TableCard;
