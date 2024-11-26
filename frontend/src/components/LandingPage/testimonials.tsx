import { Box, Card, Container, Grid, Typography } from "@mui/material";
import { Quote } from "lucide-react";

const testimonials = [
  {
    quote:
      "Found my dream tractor at an amazing price. The platform made the entire process smooth and trustworthy.",
    author: "John Smith",
    role: "Dairy Farmer",
  },
  {
    quote:
      "As a dealer, this marketplace has helped us reach more customers than ever before. Excellent platform!",
    author: "Sarah Johnson",
    role: "Equipment Dealer",
  },
  {
    quote:
      "The variety of equipment available is impressive. I've made multiple purchases and have always been satisfied.",
    author: "Michael Brown",
    role: "Commercial Farmer",
  },
];

export default function Testimonials() {
  return (
    <Box sx={{ py: 8, bgcolor: "grey.50" }}>
      <Container maxWidth="lg">
        <Typography variant="h2" sx={{ mb: 6, textAlign: "center" }}>
          What Our Users Say
        </Typography>
        <Grid container spacing={4}>
          {testimonials.map((testimonial, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card
                sx={{
                  height: "100%",
                  p: 4,
                  display: "flex",
                  flexDirection: "column",
                  transition: "0.3s",
                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow: 3,
                  },
                }}
              >
                <Quote
                  size={32}
                  color="#ff6537"
                  style={{ marginBottom: "16px" }}
                />
                <Typography
                  variant="body1"
                  paragraph
                  sx={{ flex: 1, fontStyle: "italic" }}
                >
                  "{testimonial.quote}"
                </Typography>
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                    {testimonial.author}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {testimonial.role}
                  </Typography>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
