import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
} from "@mui/material";
import { FC, useEffect, useState } from "react";

export type ConfirmDialogValues = {
  headerText: string;
  confirmationText: string | JSX.Element;
  action: () => void;
};
const ConfirmDialog: FC = () => {
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState<ConfirmDialogValues>({
    headerText: "",
    confirmationText: "",
    action: () => "",
  });

  useEffect(() => {
    window.addEventListener("confirmAction", ((
      e: CustomEvent<ConfirmDialogValues>
    ) => {
      setOpen(true);
      setValues(e.detail);
    }) as EventListener);
  }, []);

  return (
    <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
      <DialogTitle>{values.headerText}</DialogTitle>
      <DialogContent>
        <Stack
          spacing={6}
          sx={{
            alignItems: "center",
          }}
        >
          {typeof values.confirmationText === "string" ? (
            <Typography
              sx={{
                textAlign: "center",
                width: "100%",
              }}
            >
              {values.confirmationText}
            </Typography>
          ) : (
            values.confirmationText
          )}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            setOpen(false);
          }}
        >
          Cancel
        </Button>

        <Button
          variant="contained"
          onClick={() => {
            values.action?.();
            setOpen(false);
          }}
        >
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;
