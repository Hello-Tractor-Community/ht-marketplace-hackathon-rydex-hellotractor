import {
  Button,
  Card,
  CardActionArea,
  CardContent,
  CardHeader,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
} from "@mui/material";
import {
  Dispatch,
  FC,
  SetStateAction,
  useEffect,
  useMemo,
  useState,
} from "react";
import { getMyStores, Store } from "../../api/stores/getStores";
import { useAuth } from "../../hooks/useAuth";
import CreateStoreDialog from "./StoreDialog";

type Props = {
  open: boolean;
  disableClose?: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
};
const SelectStoreDialog: FC<Props> = ({ open, setOpen, disableClose }) => {
  const [stores, setStores] = useState<Store[]>([]);
  const [createStoreOpen, setCreateStoreOpen] = useState(false);
  const [loadingStores, setLoadingStores] = useState(false);

  const { authData } = useAuth("seller");

  const seller = useMemo(() => authData.user?.sellers?.[0], [authData]);

  useEffect(() => {
    if (!seller) {
      //   alert("Seller not found");
      return;
    }
    setLoadingStores(true);
    getMyStores()
      .then(setStores)
      .catch(console.error)
      .finally(() => {
        setLoadingStores(false);
      });
  }, [seller, open]);
  return (
    <Dialog maxWidth="sm" fullWidth open={open} onClose={() => {}}>
      <DialogTitle>Select a Store to open</DialogTitle>
      <DialogContent>
        <Stack
          spacing={2}
          sx={{
            alignItems: "center",
            py: 4,
          }}
        >
          {loadingStores ? (
            <>
              <CircularProgress /> <Typography>Loading stores...</Typography>
            </>
          ) : (
            stores.map((store) => (
              <Card
                key={store.id}
                sx={{
                  width: "100%",
                }}
              >
                <CardActionArea href={`/seller/stores/${store.id}`}>
                  <CardHeader title={store.name} />
                  <CardContent>
                    <Typography>{store.description}</Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            ))
          )}
        </Stack>
      </DialogContent>
      <DialogActions>
        {!disableClose && (
          <Button onClick={() => setOpen(false)}>Cancel</Button>
        )}
        <Button
          variant="contained"
          onClick={() => {
            // setOpen(false);
            setCreateStoreOpen(true);
          }}
        >
          Create store
        </Button>
      </DialogActions>
      <CreateStoreDialog open={createStoreOpen} setOpen={setCreateStoreOpen} />
    </Dialog>
  );
};

export default SelectStoreDialog;
