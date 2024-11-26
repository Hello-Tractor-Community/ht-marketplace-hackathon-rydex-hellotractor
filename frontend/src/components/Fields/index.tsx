import { RegistryFieldsType } from "@rjsf/utils";
import FileUploadTextField from "./FileUploadTextField";
import PlacesTextField from "./placesTextField";

const fields: RegistryFieldsType = {
  //custom rjsf widgets
  FileUploadTextField: (props) => <FileUploadTextField {...props} />,
  PlacesTextField: (props) => <PlacesTextField {...props} />,
};

export default fields;
