import { Box, Card, Container, Grid, Typography } from "@mui/material";
import { Store } from "../../api/stores/getStores";

export default function BuyerStoreServices({ store }: { store?: Store }) {
  return store?.data?.services?.length ? (
    <Box sx={{ py: 6, pt: 12 }}>
      <Container maxWidth="lg">
        <Typography variant="h5" sx={{ mb: 4 }}>
          Our Services
        </Typography>
        <Grid container spacing={3}>
          {store?.data?.services.slice(0, 4)?.map((service, index) => (
            <Grid
              item
              xs={12}
              sm={6}
              md={12 / (store.data?.services.length ?? 4)}
              key={service.title}
            >
              <Card sx={{ p: 3, height: "100%" }}>
                <Typography variant="h4" color={"primary"}>
                  {index + 1}.
                </Typography>
                <Typography variant="h6" sx={{ my: 2 }}>
                  {service.title}
                </Typography>
                <Typography color="text.secondary">
                  {service.description}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  ) : (
    <Box sx={{ pt: 12 }} />
  );
}
