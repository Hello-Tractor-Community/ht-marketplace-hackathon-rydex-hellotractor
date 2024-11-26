import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Container,
  Grid,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import {
  getProducts,
  humanFriendlyCondition,
  Product,
} from "../../api/product/getProducts";

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    getProducts({
      "page[size]": 3,
      "page[number]": 1,
    })
      .then(({ products }) => setProducts(products))
      .catch(console.error);
  }, []);

  return (
    <Box sx={{ py: 8 }}>
      <Container maxWidth="lg">
        <Typography variant="h2" sx={{ mb: 6, textAlign: "center" }}>
          Featured Equipment
        </Typography>
        <Grid container spacing={4}>
          {products.map((product) => (
            <Grid item xs={12} md={4} key={product.id}>
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
                <CardMedia
                  component="img"
                  height="240"
                  image={product.thumbnail?.url ?? product.photos?.[0]?.url}
                  alt={product.name}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h5" component="h2">
                    {product.name}
                  </Typography>
                  <Typography variant="h6" color="primary.main" gutterBottom>
                    KES {product.price}
                  </Typography>
                  <Typography color="text.secondary">
                    Condition: {humanFriendlyCondition(product.condition)}
                  </Typography>
                </CardContent>
                <CardActions sx={{ p: 2 }}>
                  <Button
                    size="large"
                    variant="contained"
                    fullWidth
                    href={`/product/${product.id}`}
                  >
                    View Details
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
