import {
  Box,
  Card,
  CardActionArea,
  Container,
  Grid,
  Typography,
} from "@mui/material";
import { icons } from "lucide-react";
import { useEffect, useState } from "react";
import { Category, getCategories } from "../../api/product/getSearchOptions";

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    getCategories({
      "page[size]": 3,
      "page[number]": 1,
    })
      .then(setCategories)
      .catch(console.error);
  }, []);
  return (
    <Box sx={{ py: 8 }}>
      <Container maxWidth="lg">
        <Typography variant="h2" sx={{ mb: 6, textAlign: "center" }}>
          Featured Categories
        </Typography>
        <Grid container spacing={6}>
          {categories.map((category) => {
            const LucidIcon = icons[category.icon as keyof typeof icons];
            return (
              <Grid item xs={12} sm={6} md={4} key={category.id}>
                <Card
                  sx={{
                    textAlign: "center",
                    cursor: "pointer",
                    transition: "0.3s",
                    "&:hover": {
                      transform: "translateY(-8px)",
                      boxShadow: 3,
                    },
                  }}
                >
                  <CardActionArea
                    component="a"
                    href={`/shop?category=${category.id}`}
                    sx={{
                      p: 3,
                    }}
                  >
                    {LucidIcon && (
                      <LucidIcon
                        size={48}
                        color="#ff6537"
                        style={{ marginBottom: "16px" }}
                      />
                    )}
                    <Typography variant="h6" sx={{ mb: 1 }}>
                      {category.name}
                    </Typography>
                    <Typography color="text.secondary">
                      View products
                    </Typography>
                  </CardActionArea>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </Container>
    </Box>
  );
}
