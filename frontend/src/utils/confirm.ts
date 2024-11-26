import { ConfirmDialogValues } from "../components/ConfirmDialog/ConfirmDialog";

export const confirmAction = (values: ConfirmDialogValues) => {
  const event = new CustomEvent("confirmAction", { detail: values });
  window.dispatchEvent(event);
};
