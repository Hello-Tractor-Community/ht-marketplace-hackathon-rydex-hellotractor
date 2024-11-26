import { Shop } from "@mui/icons-material";
import { Box, Container, Typography, Rating } from "@mui/material";
import { Store } from "../../api/stores/getStores";

interface BuyerStoreHeaderProps {
  store?: Store;
}

export default function BuyerStoreHeader({ store }: BuyerStoreHeaderProps) {
  return (
    <Box sx={{ position: "relative", mb: 4 }}>
      <Box
        sx={{
          height: "300px",
          width: "100%",
          ...(store?.data?.coverImage && {
            backgroundImage: `url(${store?.data?.coverImage})`,
          }),
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundColor: "black",
          position: "relative",
          "&::after": {
            content: '""',
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "50%",
            background: "linear-gradient(to top, rgba(0,0,0,0.5), transparent)",
          },
        }}
      />
      <Container maxWidth="lg" sx={{ position: "relative" }}>
        <Box
          sx={{
            position: "absolute",
            bottom: "-50px",
            display: "flex",
            alignItems: "flex-end",
            gap: 3,
          }}
        >
          <Box
            sx={{
              width: 120,
              height: 120,
              borderRadius: 2,
              overflow: "hidden",
              boxShadow: 3,
              bgcolor: "white",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              img: {
                width: "100%",
                height: "100%",
                objectFit: "cover",
              },
            }}
          >
            {store?.logo ? (
              <img src={store?.logo.url} alt={store.name} />
            ) : (
              <Shop fontSize="large" />
            )}
          </Box>
          <Box sx={{ mb: 2 }}>
            <Typography
              variant="h4"
              sx={{ color: "white", textShadow: "0 2px 4px rgba(0,0,0,0.3)" }}
            >
              {store?.name}
            </Typography>

            {store?.rating ? (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Rating value={store?.rating} precision={0.1} readOnly />
                <Typography>({store?.reviewCount} reviews)</Typography>
              </Box>
            ) : (
              <Box sx={{ color: "white" }}>
                <Typography>No reviews</Typography>
              </Box>
            )}
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
