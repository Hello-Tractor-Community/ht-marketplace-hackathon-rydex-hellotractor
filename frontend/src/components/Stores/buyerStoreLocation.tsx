import { Box, Card, Container, Grid, Typography } from "@mui/material";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import GoogleMap from "../Map/map";
import { Store } from "../../api/stores/getStores";
import { useContext, useEffect } from "react";
import { MapContext } from "../../context/MapContext";

interface DealerLocationProps {
  store?: Store;
}

export default function BuyerStoreLocation({ store }: DealerLocationProps) {
  const { map, mapContext } = useContext(MapContext);
  useEffect(() => {
    if (map && store && mapContext?.AdvancedMarkerElement) {
      map.setCenter({
        lat: parseFloat(store?.location?.latlng.split(",")[0] ?? "-1.2095867"),
        lng: parseFloat(store?.location?.latlng.split(",")[1] ?? "36.835791"),
      });

      new mapContext.AdvancedMarkerElement({
        position: {
          lat: parseFloat(
            store?.location?.latlng.split(",")[0] ?? "-1.2095867"
          ),
          lng: parseFloat(store?.location?.latlng.split(",")[1] ?? "36.835791"),
        },
        map: map,
        title: store?.name,
      });
    }
  }, [store, map, mapContext]);
  return (
    <Box sx={{ py: 6, bgcolor: "grey.50" }}>
      <Container maxWidth="lg">
        <Typography variant="h5" sx={{ mb: 4 }}>
          Location & Hours
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Card sx={{ p: 3, height: "100%" }}>
              <Box sx={{ mb: 3 }}>
                <Typography
                  variant="h6"
                  sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1 }}
                >
                  <MapPin size={20} style={{ color: "#ff6537" }} />
                  Address
                </Typography>
                <Typography>{store?.location?.address}</Typography>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography
                  variant="h6"
                  sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1 }}
                >
                  <Phone size={20} style={{ color: "#ff6537" }} />
                  Phone
                </Typography>
                <Typography>{store?.phone}</Typography>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography
                  variant="h6"
                  sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1 }}
                >
                  <Mail size={20} style={{ color: "#ff6537" }} />
                  Email
                </Typography>
                <Typography>{store?.email}</Typography>
              </Box>

              <Box>
                <Typography
                  variant="h6"
                  sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1 }}
                >
                  <Clock size={20} style={{ color: "#ff6537" }} />
                  Business Hours
                </Typography>
                {store?.data?.businessHours?.map((schedule) => (
                  <Box key={schedule.day} sx={{ mb: 1 }}>
                    <Typography variant="subtitle2">{schedule.day}</Typography>
                    <Typography color="text.secondary">
                      {schedule.hours}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Card>
          </Grid>
          <Grid item xs={12} md={8}>
            <Card sx={{ height: "400px", overflow: "hidden" }}>
              <GoogleMap
                defaultPos={{
                  lat: parseFloat(
                    store?.location?.latlng.split(",")[0] ?? "-1.2095867"
                  ),
                  lng: parseFloat(
                    store?.location?.latlng.split(",")[1] ?? "36.8357919"
                  ),
                }}
              />
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
