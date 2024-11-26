import { useContext, useEffect, useState } from "react";
import {
  Box,
  Container,
  TextField,
  Grid,
  Card,
  CardContent,
  Typography,
  Rating,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  SelectChangeEvent,
  Stack,
  Button,
  ThemeProvider,
  CardActionArea,
} from "@mui/material";
import { Search, MapPin, Star } from "lucide-react";
import {
  getDealerTypes,
  getRegions,
  getStores,
  Store,
} from "../../../api/stores/getStores";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Shop } from "@mui/icons-material";
import GoogleMap from "../../../components/Map/map";
import { MapContext } from "../../../context/MapContext";
import { v4 } from "uuid";
import { createRoot } from "react-dom/client";
import { useTheme } from "@emotion/react";

export default function BuyerStoresPage() {
  const [stores, setStores] = useState<Store[]>([]);
  const [regions, setRegions] = useState<string[]>([]);
  const [dealerTypes, setDealerTypes] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [region, setRegion] = useState("");
  const [dealerType, setDealerType] = useState("");
  const [, setMarkers] = useState<google.maps.marker.AdvancedMarkerElement[]>(
    []
  );
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    getRegions().then(setRegions).catch(console.error);
    getDealerTypes().then(setDealerTypes).catch(console.error);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const params: any = {};

    const filters = [
      // `not(equals(type, 'STORE'))`
    ];
    if (searchParams.get("search")) {
      filters.push(`contains(name, '${searchParams.get("search")}')`);
    }
    if (searchParams.get("region")) {
      filters.push(`equals(region, '${searchParams.get("region")}')`);
    }
    if (searchParams.get("dealerType")) {
      filters.push(`equals(dealerType,'${searchParams.get("dealerType")}')`);
    }

    const grouped = [];
    for (let i = 0; i < filters.length; i += 2) {
      grouped.push(
        filters.length > i ? `and(${filters[i]},${filters[i + 1]})` : filters[i]
      );
    }

    params.filter = `and(${grouped.join(",")})`;

    getStores(params)
      .then(({ stores }) => {
        setStores(stores);
      })
      .catch(console.error);
  }, [searchParams]);

  const { map, mapContext } = useContext(MapContext);

  const navigate = useNavigate();

  const theme = useTheme();

  useEffect(() => {
    if (map && mapContext?.AdvancedMarkerElement) {
      const markers = stores
        .filter((store) => store.location)
        .map((store) => {
          const markerId = v4();
          const content = document.createElement("div");
          content.id = markerId;
          const marker = new mapContext.AdvancedMarkerElement!({
            position: {
              lat: parseFloat(store.location!.latlng.split(",")[0]),
              lng: parseFloat(store.location!.latlng.split(",")[1]),
            },
            map,
            content,
          });

          marker.addListener("click", () => {
            navigate(`/stores/${store.id}`);
          });

          createRoot(content).render(
            <ThemeProvider theme={theme}>
              <Card
                sx={{
                  p: 1,
                }}
              >
                <Stack spacing={1}>
                  <Typography
                    variant="body1"
                    sx={{
                      fontWeight: 600,
                    }}
                  >
                    {store.name}
                  </Typography>
                  <Typography variant="body2">
                    {store.location?.address}
                  </Typography>
                  <Button
                    variant="contained"
                    size="small"
                    color="primary"
                    // onClick={() => navigate(`/store/${store.id}`)}
                  >
                    View Store
                  </Button>
                </Stack>
              </Card>
            </ThemeProvider>
          );

          return marker;
        });

      setMarkers(markers);
      map.setCenter({
        lat: parseFloat(stores[0]?.location?.latlng.split(",")[0] ?? "-1.2921"),
        lng: parseFloat(stores[0]?.location?.latlng.split(",")[1] ?? "36.8219"),
      });
    }
  }, [stores, map, mapContext, navigate, theme]);

  const handleLocationChange = (event: SelectChangeEvent) => {
    setRegion(event.target.value);
  };

  const handleSpecialtyChange = (event: SelectChangeEvent) => {
    setDealerType(event.target.value);
  };

  return (
    <Box sx={{ py: 6, minHeight: "90vh" }}>
      <Container maxWidth="lg" sx={{}}>
        <Stack>
          <Typography variant="h4" sx={{ mb: 4 }}>
            Find Agricultural Equipment Dealers
          </Typography>

          <Box sx={{ mb: 6 }}>
            <Grid
              container
              spacing={3}
              component={"form"}
              onSubmit={(e) => {
                e.preventDefault();

                setSearchParams(
                  JSON.parse(
                    JSON.stringify({
                      search: search || undefined,
                      region: region || undefined,
                      dealerType: dealerType || undefined,
                    })
                  )
                );
              }}
            >
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  placeholder="Search dealers..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search size={20} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <FormControl fullWidth>
                  <InputLabel>Region</InputLabel>
                  <Select
                    value={region}
                    label="Region"
                    onChange={handleLocationChange}
                  >
                    <MenuItem value="">All Locations</MenuItem>
                    {regions.map((region) => (
                      <MenuItem key={region} value={region}>
                        {region}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={3}>
                <Stack direction="row" spacing={2}>
                  <FormControl fullWidth>
                    <InputLabel>Dealer Type</InputLabel>
                    <Select
                      value={dealerType}
                      label="Dealer Type"
                      onChange={handleSpecialtyChange}
                    >
                      <MenuItem value="">All Dealers</MenuItem>
                      {dealerTypes.map((specialty) => (
                        <MenuItem key={specialty} value={specialty}>
                          {specialty}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => {
                      setSearchParams(
                        JSON.parse(
                          JSON.stringify({
                            search: search || undefined,
                            region: region || undefined,
                            dealerType: dealerType || undefined,
                          })
                        )
                      );
                    }}
                  >
                    Search
                  </Button>
                </Stack>
              </Grid>
              {searchParams.get("search") ||
              searchParams.get("region") ||
              searchParams.get("dealerType") ? (
                <Grid item xs={12}>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => {
                      setSearchParams(
                        JSON.parse(
                          JSON.stringify({
                            search: undefined,
                            region: undefined,
                            dealerType: undefined,
                          })
                        )
                      );
                    }}
                  >
                    Clear filters
                  </Button>
                </Grid>
              ) : undefined}
            </Grid>
          </Box>

          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Card
                sx={{
                  width: "100%",
                  height: "100%",
                  minHeight: "300px",
                  maxHeight: "calc(100vh - 150px)",
                  position: "sticky",
                  top: "24px",
                }}
              >
                <GoogleMap
                  defaultPos={{
                    lat: -1.2921,
                    lng: 36.8219,
                  }}
                />
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Stack spacing={3}>
                {[...stores, ...stores].map((store) => (
                  <Card
                    sx={{
                      height: "100%",
                    }}
                  >
                    <CardActionArea
                      component="a"
                      href={`/stores/${store.id}`}
                      sx={{
                        display: "flex",
                        height: "100%",
                        alignItems: "stretch",
                      }}
                    >
                      {store.logo ? (
                        <Box
                          sx={{
                            width: "30%",
                            backgroundImage: `url(${store.logo?.url})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                          }}
                        />
                      ) : (
                        <Box
                          sx={{
                            width: "30%",
                            display: "flex",
                            alignItems: "center",
                            backgroundColor: "background.default",
                            justifyContent: "center",
                          }}
                        >
                          <Shop fontSize="large" />
                        </Box>
                      )}
                      <CardContent
                        sx={{
                          width: "70%",
                        }}
                      >
                        <Typography variant="h6" gutterBottom>
                          {store.name}
                        </Typography>
                        <Box
                          sx={{ display: "flex", alignItems: "center", mb: 1 }}
                        >
                          <MapPin size={16} style={{ marginRight: 8 }} />
                          <Typography variant="body2" color="text.secondary">
                            {store.location?.address}
                          </Typography>
                        </Box>
                        {false && (
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              mb: 2,
                            }}
                          >
                            <Rating
                              // value={store.rating}
                              precision={0.1}
                              readOnly
                              size="small"
                              icon={<Star style={{ color: "#ff6537" }} />}
                            />
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ ml: 1 }}
                            >
                              {/* ({dealer.reviewCount} reviews) */}
                            </Typography>
                          </Box>
                        )}
                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                          <Typography
                            variant="body2"
                            sx={{
                              bgcolor: "rgba(255, 101, 55, 0.1)",
                              color: "primary.main",
                              px: 1,
                              py: 0.5,
                              borderRadius: 1,
                            }}
                          >
                            {store.dealerType}
                          </Typography>
                        </Box>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                ))}
              </Stack>
            </Grid>
          </Grid>
        </Stack>
      </Container>
    </Box>
  );
}
