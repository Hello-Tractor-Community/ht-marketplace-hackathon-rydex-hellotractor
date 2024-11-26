import { FC, useContext, useEffect, useMemo, useState } from "react";
import PageContainer from "../../../components/PageContainer/PageContainer";
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  CardHeader,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import { Add, Shop } from "@mui/icons-material";
import { getMyStores, Store } from "../../../api/stores/getStores";
import CreateStoreDialog from "../../../components/Stores/StoreDialog";
import { AuthContext } from "../../../context/AuthContext";

const StoresPage: FC = () => {
  const [stores, setStores] = useState<Store[]>([]);
  const [createStoreOpen, setCreateStoreOpen] = useState(false);

  const { authData } = useContext(AuthContext);

  const seller = useMemo(() => authData.user?.sellers?.[0], [authData]);

  useEffect(() => {
    if (!seller) {
      //   alert("Seller not found");
      return;
    }
    getMyStores().then(setStores).catch(console.error);
  }, [seller]);

  return (
    <PageContainer title="Stores">
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Button
            variant="contained"
            startIcon={<Add />}
            sx={{
              width: "fit-content",
              height: "fit-content",
            }}
            onClick={() => {
              setCreateStoreOpen(true);
            }}
          >
            Create store
          </Button>
        </Grid>
        {stores.map((store) => (
          <Grid item key={store.id} xs={12} md={6} lg={4}>
            <Card>
              <CardActionArea href={`/seller/stores/${store.id}`}>
                <Stack direction="row">
                  <Box
                    sx={{
                      width: "30%",
                      aspectRatio: "1/1",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      p: 2,
                    }}
                  >
                    <Shop
                      sx={{
                        fontSize: 100,
                        color: "text.secondary",
                      }}
                    />
                  </Box>
                  <Stack>
                    <CardHeader title={store.name} />
                    <CardContent>
                      <Typography>{store.description}</Typography>
                    </CardContent>
                  </Stack>
                </Stack>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
      <CreateStoreDialog open={createStoreOpen} setOpen={setCreateStoreOpen} />
    </PageContainer>
  );
};

export default StoresPage;
