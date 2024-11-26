import { FC } from "react";
import { Settings, SettingsProvider } from "./SettingsContext";
import ThemeComponent from "../theme/ThemeComponent";
import CoolSnackbar from "../components/CoolSnackbar/CoolSnackbar";
import NavProvider from "./NavContext";
import ConfirmDialog from "../components/ConfirmDialog/ConfirmDialog";
import AuthProvider from "./AuthContext";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import MapProvider from "./MapContext";

type Props = {
  children: React.ReactNode;

  //This is for getting the theme from other sources eg story book
  settings?: Settings;
};
const MasterProvider: FC<Props> = ({ children, settings }) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <SettingsProvider settings={settings}>
        <AuthProvider>
          <NavProvider>
            <MapProvider>
              <ThemeComponent>
                {children}
                <CoolSnackbar />
                <ConfirmDialog />
              </ThemeComponent>
            </MapProvider>
          </NavProvider>
        </AuthProvider>
      </SettingsProvider>
    </LocalizationProvider>
  );
};

export default MasterProvider;
