import { RegistryWidgetsType } from "@rjsf/utils";
import FileUploadTextWidget from "./FileUploadTextWidget";

const widgets: RegistryWidgetsType = {
  //custom rjsf widgets
  FileUploadTextWidget: (props) => <FileUploadTextWidget {...props} />,
};

export default widgets;
