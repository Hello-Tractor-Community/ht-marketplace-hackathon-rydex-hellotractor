import { Typography, Box, Container, Button, Stack } from "@mui/material";
import hero from "../../assets/images/hero2.jpg";
import Categories from "../../components/LandingPage/featuredCategories";
import Dealers from "../../components/LandingPage/dealers";
import Products from "../../components/LandingPage/products";
import Testimonials from "../../components/LandingPage/testimonials";

const LandingPage = () => {
  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          backgroundImage: `url(${hero})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "70vh",
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: "white",
          padding: 2,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          backgroundBlendMode: "overlay",
        }}
      >
        <Container>
          <Stack direction="row">
            <Stack sx={{ width: "50%" }}>
              <Typography variant="h3" color={"white"}>
                Your marketplace for second-hand{" "}
                <Typography variant="h3" component={"span"} color={"primary"}>
                  tractors
                </Typography>
              </Typography>
              <Typography
                variant="h5"
                color={"white"}
                sx={{
                  mb: 2,
                }}
              >
                The best place to buy and sell agricultural products
              </Typography>
              <Stack direction={"row"} spacing={2}>
                <Button
                  variant="contained"
                  sx={{ width: "fit-content" }}
                  component="a"
                  href="shop"
                >
                  Start Browsing
                </Button>
                <Button
                  variant="outlined"
                  sx={{ width: "fit-content" }}
                  component="a"
                  href="seller/login"
                >
                  Sell Equipment
                </Button>
              </Stack>
            </Stack>
          </Stack>
        </Container>
      </Box>

      <Categories />

      <Dealers />

      <Products />

      <Testimonials />
    </Box>
  );
};

export default LandingPage;
