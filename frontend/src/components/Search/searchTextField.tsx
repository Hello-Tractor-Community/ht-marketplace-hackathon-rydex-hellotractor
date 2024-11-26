import {
  IconButton,
  InputAdornment,
  Autocomplete,
  TextField,
  Box,
} from "@mui/material";
import { Search } from "lucide-react";
import { useState, useEffect } from "react";
import { getSearchOptions } from "../../api/product/getSearchOptions";
import { useNavigate } from "react-router-dom";

export type SearchOption = {
  title: string;
  type: "category" | "product" | "subCategory";
  id: number;
};

const SearchTextField = () => {
  const [options, setOptions] = useState<SearchOption[]>([]);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (inputValue) {
      console.log("searching for", inputValue);
      timeout = setTimeout(async () => {
        console.log("debouncing for", inputValue);
        const results = await getSearchOptions(inputValue);

        console.log("results", results);
        setOptions(results);
      }, 700);
    }
    return () => clearTimeout(timeout);
  }, [inputValue]);

  const navigate = useNavigate();

  return (
    <Box
      component="form"
      //   action="/shop"
      sx={{
        width: "100%",
        maxWidth: "500px",
      }}
    >
      <Autocomplete
        freeSolo
        sx={{
          width: "100%",
        }}
        options={options}
        getOptionLabel={(option) =>
          typeof option === "string" ? option : option.title
        }
        onInputChange={(_, newInputValue) => {
          console.log("newInputValue", newInputValue);
          setInputValue(newInputValue);
        }}
        onChange={(_, newVal) => {
          if (newVal && typeof newVal !== "string") {
            console.log(newVal.title);
            switch (newVal.type) {
              case "category":
                navigate(`/shop?category=${newVal.id}`);
                break;
              case "product":
                navigate(`/product/${newVal.id}`);
                break;
              case "subCategory":
                navigate(`/shop?subCategory=${newVal.id}`);
                break;
            }
          }
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label="What are you looking for?"
            size="small"
            name="search"
            sx={{
              width: "100%",
              maxWidth: "500px",
            }}
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton type="submit">
                    <Search />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        )}
      />
    </Box>
  );
};

export default SearchTextField;
