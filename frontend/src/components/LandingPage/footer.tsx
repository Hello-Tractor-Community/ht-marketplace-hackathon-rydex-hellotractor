import { Box, Container, Grid, Link, Typography } from "@mui/material";
import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react";

export default function Footer() {
  return (
    <Box
      sx={{
        bgcolor: "black",
        color: "white",
        py: 6,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom color="inherit">
              About Us
            </Typography>
            <Typography variant="body2" color="inherit">
              The leading marketplace for agricultural equipment, connecting
              farmers with trusted dealers and quality machinery.
            </Typography>
            <Box sx={{ mt: 2, display: "flex", gap: 2 }}>
              <Facebook size={24} />
              <Twitter size={24} />
              <Instagram size={24} />
              <Linkedin size={24} />
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom color="inherit">
              Quick Links
            </Typography>
            <Link href="/shop" color="inherit" display="block" sx={{ mb: 1 }}>
              Browse Equipment
            </Link>
            <Link
              href="/seller/login"
              color="inherit"
              display="block"
              sx={{ mb: 1 }}
            >
              Sell Equipment
            </Link>
            <Link
              href="/dealers"
              color="inherit"
              display="block"
              sx={{ mb: 1 }}
            >
              Find Dealers
            </Link>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom color="inherit">
              Contact Info
            </Typography>
            <Typography variant="body2" paragraph color="inherit">
              Ground Floor, The Address, Muthangari Drive,
              <br />
              Westlands, Nairobi, Kenya.
            </Typography>
            <Typography variant="body2" paragraph color="inherit">
              Email: hello@hellotractor.com
              <br />
              Phone: +254 (0) 706 492 729
            </Typography>
          </Grid>
        </Grid>
        <Box
          sx={{
            mt: 4,
            pt: 4,
            borderTop: "1px solid rgba(255,255,255,0.1)",
            textAlign: "center",
          }}
        >
          <Typography variant="body2" color="inherit">
            © {new Date().getFullYear()} Hello Tractor. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
