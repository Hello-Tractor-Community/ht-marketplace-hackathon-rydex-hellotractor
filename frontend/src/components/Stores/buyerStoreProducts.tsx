import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Container,
  Grid,
  Typography,
} from "@mui/material";

const products = [
  {
    id: 1,
    name: "John Deere 6R Series",
    image:
      "https://images.unsplash.com/photo-1530267981375-f08d53d8d0c7?auto=format&fit=crop&w=800&q=80",
    price: "$125,000",
    condition: "New",
  },
  {
    id: 2,
    name: "Case IH Magnum",
    image:
      "https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=800&q=80",
    price: "$98,500",
    condition: "Used - Excellent",
  },
  {
    id: 3,
    name: "New Holland T7",
    image:
      "https://images.unsplash.com/photo-1592878904946-b3cd8ae243d0?auto=format&fit=crop&w=800&q=80",
    price: "$145,000",
    condition: "New",
  },
];

export default function BuyerStoreProducts() {
  return (
    <Box sx={{ py: 6 }}>
      <Container maxWidth="lg">
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 4,
          }}
        >
          <Typography variant="h5">Featured Equipment</Typography>
          <Button variant="outlined">View All Equipment</Button>
        </Box>
        <Grid container spacing={3}>
          {products.map((product) => (
            <Grid item xs={12} sm={6} md={4} key={product.id}>
              <Card sx={{ height: "100%" }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={product.image}
                  alt={product.name}
                />
                <CardContent>
                  <Typography gutterBottom variant="h6">
                    {product.name}
                  </Typography>
                  <Typography variant="h6" color="primary" gutterBottom>
                    {product.price}
                  </Typography>
                  <Typography color="text.secondary">
                    Condition: {product.condition}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
