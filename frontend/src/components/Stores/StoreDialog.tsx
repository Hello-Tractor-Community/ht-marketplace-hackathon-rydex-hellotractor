import { Close } from "@mui/icons-material";
import {
  AppBar,
  CircularProgress,
  Container,
  Dialog,
  IconButton,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import { Dispatch, FC, SetStateAction, useState } from "react";

import { createStore, createStoreSchema } from "../../api/stores/createStore";
import { toast } from "../../utils/toast";
import { Form } from "@rjsf/mui";
import validator from "@rjsf/validator-ajv8";
import widgets from "../Widgets";
import { Store } from "../../api/stores/getStores";

type Props = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  disableClose?: boolean;
  onCreate?: (store: Store) => void;
};
const CreateStoreDialog: FC<Props> = ({
  open,
  setOpen,
  disableClose,
  onCreate,
}) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [uploading, setUploading] = useState(false);

  const handleSubmit = async (data: object) => {
    setUploading(true);
    try {
      const store = await createStore(data);
      toast({
        message: "Store created successfully",
        severity: "success",
      });
      onCreate?.(store);

      setOpen(false);
    } catch (error) {
      console.error(error);
    }
    setUploading(false);
  };

  return (
    <Dialog
      open={open}
      onClose={() => {
        if (!disableClose) {
          setOpen(false);
        }
      }}
      fullScreen
    >
      <Stack
        spacing={4}
        sx={{
          alignItems: "center",
        }}
      >
        <AppBar sx={{ position: "relative" }}>
          <Toolbar>
            {!disableClose && (
              <IconButton
                edge="start"
                color="inherit"
                onClick={() => setOpen(false)}
                aria-label="close"
              >
                <Close />
              </IconButton>
            )}
            <Typography
              sx={{
                ml: 2,
                flex: 1,
                color: (theme) => theme.palette.primary.contrastText,
              }}
              variant="h6"
              component="div"
            >
              Create Store
            </Typography>
          </Toolbar>
        </AppBar>
        <Container maxWidth="md">
          <Stack spacing={4} sx={{ pb: 4 }}>
            {uploading ? (
              <Stack
                sx={{
                  width: "100%",
                  height: "100%",
                  justifyContent: "center",
                  alignItems: "center",
                  position: "relative",
                }}
                spacing={2}
              >
                <CircularProgress size={32} />
                <Typography variant="h6">Creating store...</Typography>
              </Stack>
            ) : (
              <Form
                schema={createStoreSchema}
                //   uiSchema={{
                //     "ui:submitButtonOptions": {
                //       submitText: "Next",
                //     },
                //     ...uiSchema,
                //   }}
                validator={validator}
                onSubmit={(data) => {
                  console.log("create store dialog form submitted", data);
                  handleSubmit(data.formData);
                }}
                widgets={widgets}
              />
            )}
          </Stack>
        </Container>
      </Stack>
    </Dialog>
  );
};

export default CreateStoreDialog;
