import * as React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { debounce } from "@mui/material/utils";
import { SxProps } from "@mui/material";
import { MapContext } from "../../context/MapContext";
import parse from "autosuggest-highlight/parse";
import { FieldProps } from "@rjsf/utils";
import { Location } from "../../api/stores/getStores";

// This key was created specifically for the demo in mui.com.
// You need to create a new one for your application.
// const GOOGLE_MAPS_API_KEY = "AIzaSyDRzIIY6hpnZ0URcHFZ739AILUW2H7RELw";

interface MainTextMatchedSubstrings {
  offset: number;
  length: number;
}
interface StructuredFormatting {
  main_text: string;
  secondary_text: string;
  main_text_matched_substrings?: readonly MainTextMatchedSubstrings[];
}
export interface PlaceType {
  description: string;
  structured_formatting: StructuredFormatting;
  place_id: string;
}

export type PlaceResult = {
  Location: string;
  Latitude: number;
  Longitude: number;
  City?: string;
  Country?: string;
};

type Props = {
  setPlaceResult?: (result: PlaceResult) => void;
  invalid?: boolean;
  helperText?: string;
  sx?: SxProps;
  label?: string;
};

const PlacesTextField: React.FC<Partial<FieldProps> & Props> = ({
  formData,
  onChange,

  setPlaceResult,
  sx,
  invalid,
  label,
  helperText,
  //   value,
  //   setValue,
}) => {
  const [autoCompleteVal, setAutoCompleteVal] =
    React.useState<PlaceType | null>(null);
  const [inputValue, setInputValue] = React.useState("");
  const [options, setOptions] = React.useState<readonly PlaceType[]>([]);
  const { mapContext } = React.useContext(MapContext);

  React.useEffect(() => {
    console.log(formData);
    if (formData) {
      setAutoCompleteVal({
        description: formData.address,
        place_id: formData.place_id,
        structured_formatting: {
          main_text: formData.address,
          secondary_text: formData.address,
        },
      });
    }
  }, [formData]);

  const fetch = React.useMemo(() => {
    return debounce(
      (
        request: google.maps.places.AutocompletionRequest,
        callback: (
          results: readonly google.maps.places.AutocompletePrediction[] | null,
          status: google.maps.places.PlacesServiceStatus
        ) => void
      ) => {
        mapContext?.autocompleteService?.getPlacePredictions(request, callback);
      },
      400
    );
  }, [mapContext?.autocompleteService]);

  React.useEffect(() => {
    let active = true;

    if (!mapContext?.autocompleteService) {
      return undefined;
    }

    if (inputValue === "") {
      setOptions(autoCompleteVal ? [autoCompleteVal] : []);
      return undefined;
    }

    fetch(
      {
        input: inputValue,

        componentRestrictions: {
          country: "ke",
        },
      },
      (results) => {
        if (active) {
          let newOptions: readonly PlaceType[] = [];

          if (autoCompleteVal) {
            newOptions = [autoCompleteVal];
          }

          if (results) {
            newOptions = [...newOptions, ...results];
          }

          setOptions(newOptions);
        }
      }
    );

    return () => {
      active = false;
    };
  }, [autoCompleteVal, inputValue, fetch, mapContext]);

  return (
    <Autocomplete
      id="google-map-demo"
      sx={sx}
      getOptionLabel={(option) =>
        typeof option === "string" ? option : option.description
      }
      filterOptions={(x) => x}
      options={options}
      autoComplete
      includeInputInList
      filterSelectedOptions
      value={autoCompleteVal}
      noOptionsText="No locations"
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      onChange={(_, newValue: PlaceType) => {
        setAutoCompleteVal(newValue);
        if (newValue?.place_id) {
          mapContext?.placesService?.getDetails(
            { placeId: newValue.place_id },
            (place, status) => {
              if (status === google.maps.places.PlacesServiceStatus.OK) {
                // Get the latitude and longitude of the place.
                const lat = place?.geometry?.location?.lat();
                const lng = place?.geometry?.location?.lng();
                const City = place?.address_components?.find((c) => {
                  return c.types.includes("locality");
                })?.long_name;
                const Country = place?.address_components?.find((c) => {
                  return c.types.includes("country");
                })?.long_name;
                setPlaceResult?.({
                  Latitude: lat ?? 0,
                  Longitude: lng ?? 0,
                  Location: newValue.description ?? "",
                  City,
                  Country,
                });

                onChange?.({
                  latlng: `${lat},${lng}`,
                  address: newValue.description,
                } as Location);
              } else {
                console.log(`Request failed. Status: ${status}`);
              }
            }
          );
        } else {
          console.log("Failed to get Place");
        }
      }}
      onInputChange={(_, newInputValue) => {
        setInputValue(newInputValue);
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label ?? "Choose a location"}
          fullWidth
          helperText={helperText}
          error={invalid}
        />
      )}
      renderOption={(props, option) => {
        const matches =
          option.structured_formatting.main_text_matched_substrings || [];

        const parts = parse(
          option.structured_formatting.main_text,
          matches.map((match) => [match.offset, match.offset + match.length])
        );

        return (
          <li {...props}>
            <Grid container alignItems="center">
              <Grid item sx={{ display: "flex", width: 44 }}>
                <LocationOnIcon sx={{ color: "text.secondary" }} />
              </Grid>
              <Grid
                item
                sx={{ width: "calc(100% - 44px)", wordWrap: "break-word" }}
              >
                {parts.map((part, index) => (
                  <Box
                    key={index}
                    component="span"
                    sx={{ fontWeight: part.highlight ? "bold" : "regular" }}
                  >
                    {part.text}
                  </Box>
                ))}
                <Typography variant="body2" color="text.secondary">
                  {option.structured_formatting.secondary_text}
                </Typography>
              </Grid>
            </Grid>
          </li>
        );
      }}
    />
  );
};

export default PlacesTextField;
