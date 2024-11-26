import {
  Box,
  Card,
  CardActionArea,
  Container,
  Grid,
  Rating,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { getStores, Store } from "../../api/stores/getStores";

export default function Dealers() {
  const [stores, setStores] = useState<Store[]>([]);

  useEffect(() => {
    getStores({
      "page[size]": 3,
      "page[number]": 1,
    })
      .then(({ stores }) => setStores(stores))
      .catch(console.error);
  }, []);
  return (
    <Box sx={{ py: 8, bgcolor: "grey.50" }}>
      <Container maxWidth="lg">
        <Typography variant="h2" sx={{ mb: 6, textAlign: "center" }}>
          Top Rated Dealers
        </Typography>
        <Grid container spacing={4}>
          {stores.map((store) => (
            <Grid item xs={12} md={4} key={store.name}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  transition: "0.3s",
                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow: 3,
                  },
                }}
              >
                <CardActionArea component="a" href={`/stores/${store.id}`}>
                  <Box
                    sx={{
                      height: 200,
                      backgroundImage: `url(${store.logo})`,
                      backgroundColor: "grey.600",
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  />
                  <Box sx={{ p: 3 }}>
                    <Typography variant="h6" gutterBottom>
                      {store.name}
                    </Typography>
                    <Typography color="text.secondary" gutterBottom>
                      {store.location?.address}
                    </Typography>
                    <Rating value={store.rating} precision={0.1} readOnly />
                    <Typography variant="body2" color="text.secondary">
                      {store.rating} out of 5
                    </Typography>
                  </Box>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
