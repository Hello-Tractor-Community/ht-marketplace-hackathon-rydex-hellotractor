import {
  Card,
  CardContent,
  CardHeader,
  Divider,
  Select,
  Slider,
  Stack,
  TextField,
  Typography,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  useMediaQuery,
  Theme,
  IconButton,
  Collapse,
} from "@mui/material";
import { SubCategory } from "../../api/product/getSearchOptions";
import { FC, useEffect, useMemo, useState } from "react";
import { Form } from "@rjsf/mui";
import validator from "@rjsf/validator-ajv8";
import { useSearchParams } from "react-router-dom";
import { ExpandLess, ExpandMore } from "@mui/icons-material";

type Props = {
  subCategory?: SubCategory;
  lowestPrice?: number;
  highestPrice?: number;
};

export type ProductCondition =
  | "NEW"
  | "USED_FAIR"
  | "USED_GOOD"
  | "USED_EXCELLENT";

const FilterCard: FC<Props> = ({ subCategory, lowestPrice, highestPrice }) => {
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(10000);
  const [condition, setCondition] = useState<ProductCondition | "">("");
  const [params, setParams] = useSearchParams();

  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down("md")
  );
  const [isMinimized, setIsMinimized] = useState(false);

  useEffect(() => {
    setIsMinimized(isMobile);
  }, [isMobile]);

  useEffect(() => {
    setMinPrice(lowestPrice ?? 0);
    setMaxPrice(highestPrice ?? 10000);
  }, [lowestPrice, highestPrice]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSubmit = (formData?: any) => {
    try {
      setParams((prev) => {
        if (minPrice) {
          prev.set("minPrice", minPrice.toString());
        }
        if (maxPrice) {
          prev.set("maxPrice", maxPrice.toString());
        }
        if (condition) {
          prev.set("condition", condition);
        }
        if (formData && Object.keys(formData).length) {
          prev.set("specs", JSON.stringify(formData));
        }

        return prev;
      });
    } catch (error) {
      console.error(error);
    }
  };

  const hasFilters = useMemo(
    () =>
      !!params.get("specs") ||
      !!params.get("minPrice") ||
      !!params.get("maxPrice") ||
      !!params.get("condition"),
    [params]
  );

  return (
    <Card sx={{ position: "sticky", top: "24px" }}>
      <CardHeader
        title={"Filters"}
        action={
          <Stack direction={"row"} spacing={2}>
            {hasFilters ? (
              <Button
                variant="outlined"
                size="small"
                onClick={() => {
                  setParams((prev) => {
                    prev.delete("specs");
                    prev.delete("minPrice");
                    prev.delete("maxPrice");
                    prev.delete("condition");
                    setMinPrice(lowestPrice ?? 0);
                    setMaxPrice(highestPrice ?? 10000);
                    setCondition("");

                    return prev;
                  });
                }}
              >
                Clear filters
              </Button>
            ) : undefined}
            {isMobile && (
              <IconButton
                onClick={() => {
                  setIsMinimized((prev) => !prev);
                }}
              >
                {isMinimized ? <ExpandMore /> : <ExpandLess />}
              </IconButton>
            )}
          </Stack>
        }
      />

      <CardContent>
        <Collapse in={!isMobile || !isMinimized}>
          <Stack>
            <Divider />
            <Stack sx={{ mb: 4 }}>
              <Typography variant="h6">Price</Typography>
              <Slider
                value={[minPrice, maxPrice]}
                min={lowestPrice}
                max={highestPrice}
                onChange={(_, val) => {
                  if (Array.isArray(val)) {
                    setMinPrice(val[0]);
                    setMaxPrice(val[1]);
                  }
                }}
              />
              <Stack direction="row" spacing={2}>
                <TextField
                  variant="standard"
                  label="min"
                  size="small"
                  type="number"
                  value={minPrice}
                  onChange={(e) => setMinPrice(Number(e.target.value))}
                />
                <TextField
                  variant="standard"
                  label="max"
                  size="small"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                />
              </Stack>
            </Stack>
            <FormControl>
              <InputLabel id="condition-select-label">Condition</InputLabel>
              <Select
                value={condition}
                onChange={(e) =>
                  setCondition(e.target.value as ProductCondition)
                }
                labelId="condition-select-label"
                label="Condition"
              >
                <MenuItem value="NEW">New</MenuItem>
                <MenuItem value="USED_FAIR">Used - Fair</MenuItem>
                <MenuItem value="USED_GOOD">Used - Good</MenuItem>
                <MenuItem value="USED_EXCELLENT">Used - Excellent</MenuItem>
              </Select>
            </FormControl>
            {subCategory?.filterSchema ? (
              <Form
                schema={subCategory?.filterSchema}
                validator={validator}
                uiSchema={{
                  "ui:submitButtonOptions": {
                    submitText: "Apply",
                  },
                }}
                onSubmit={(data) => {
                  handleSubmit(data.formData);
                }}
              />
            ) : (
              <Button
                sx={{
                  width: "fit-content",
                  mt: 4,
                }}
                variant="contained"
                onClick={() => {
                  handleSubmit();
                }}
              >
                Apply
              </Button>
            )}
          </Stack>
        </Collapse>
      </CardContent>
    </Card>
  );
};

export default FilterCard;
