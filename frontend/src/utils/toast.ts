import { SnackbarValues } from "../components/CoolSnackbar/CoolSnackbar";

export const toast = (values: SnackbarValues) => {
  const event = new CustomEvent("toast", { detail: values });
  window.dispatchEvent(event);
};
