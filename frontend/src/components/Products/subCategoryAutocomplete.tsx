import { FC } from "react";
import { SubCategory } from "../../api/product/getSearchOptions";
import { Autocomplete, SxProps, TextField } from "@mui/material";

type Props = {
  value?: SubCategory;
  onChange?: (value: SubCategory) => void;
  sx?: SxProps;
  options: SubCategory[];
  textFieldSx?: SxProps;
};

const SubCategoryAutocomplete: FC<Props> = ({
  sx,
  textFieldSx,
  value,
  onChange,
  options,
}) => {
  return (
    <Autocomplete
      sx={sx}
      options={options}
      getOptionLabel={(option) => option.name}
      value={value}
      onChange={(_, newVal) => {
        if (newVal && typeof newVal !== "string") {
          onChange?.(newVal);
        }
      }}
      renderInput={(params) => (
        <TextField {...params} label="Product Category" sx={textFieldSx} />
      )}
    />
  );
};

export default SubCategoryAutocomplete;
