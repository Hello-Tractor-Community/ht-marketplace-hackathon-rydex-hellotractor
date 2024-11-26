import { Chat, ChevronRight, ShoppingCart } from "@mui/icons-material";
import {
  Box,
  Breadcrumbs,
  Button,
  Card,
  Container,
  Grid,
  Link,
  Rating,
  Stack,
  Typography,
  Table,
  TableBody,
  LinearProgress,
  Avatar,
  Divider,
  CardContent,
} from "@mui/material";
import { Fragment, useContext, useEffect, useMemo, useState } from "react";
import { getProduct, Product } from "../../../api/product/getProducts";
import { useParams } from "react-router-dom";
import Carousel from "react-material-ui-carousel";
import PlaceOrderDialog from "../../../components/Orders/placeOrderDialog";
import { AuthContext } from "../../../context/AuthContext";
import LoginDialog from "../../../components/Auth/loginDialog";
import ContactSellerDialog from "../../../components/Chat/contactSellerDialog";
import { specificationMapper } from "../../../utils/specsMapper";
import dayjs from "dayjs";
import GoogleMap from "../../../components/Map/map";
import { MapContext } from "../../../context/MapContext";
import { MapPin } from "lucide-react";

const BuyerProductPage = () => {
  const [product, setProduct] = useState<Product>();
  const { loggedIn } = useContext(AuthContext);
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);
  const [placeOrderDialogOpen, setPlaceOrderDialogOpen] = useState(false);
  const [isAddToCart, setIsAddToCart] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [onLogin, setOnLogin] = useState<() => void>(() => () => {});

  const productImages = useMemo(() => {
    if (!product) return [];
    return [product.thumbnail, ...product.photos].filter(Boolean);
  }, [product]);
  const { id } = useParams();

  useEffect(() => {
    if (!id) return;
    getProduct(id).then(setProduct).catch(console.error);
  }, [id]);

  const { map, mapContext } = useContext(MapContext);
  useEffect(() => {
    if (map && product && mapContext?.AdvancedMarkerElement) {
      map.setCenter({
        lat: parseFloat(
          product?.location?.latlng.split(",")[0] ?? "-1.2095867"
        ),
        lng: parseFloat(product?.location?.latlng.split(",")[1] ?? "36.835791"),
      });

      new mapContext.AdvancedMarkerElement({
        position: {
          lat: parseFloat(
            product?.location?.latlng.split(",")[0] ?? "-1.2095867"
          ),
          lng: parseFloat(
            product?.location?.latlng.split(",")[1] ?? "36.835791"
          ),
        },
        map: map,
        title: product?.name,
      });
    }
  }, [product, map, mapContext]);

  return (
    <Container
      maxWidth="lg"
      sx={{
        minHeight: "90%",
      }}
    >
      <Stack sx={{ pt: 6, height: "100%" }}>
        <Stack
          sx={{
            zIndex: 6,
          }}
        >
          <Breadcrumbs
            aria-label="breadcrumb"
            sx={{ mb: 1 }}
            separator={<ChevronRight fontSize="small" />}
          >
            <Link underline="hover" href="/" variant="caption">
              Home
            </Link>
            <Link
              underline="hover"
              href={`/product/${product?.id}`}
              variant="caption"
            >
              {product?.name}
            </Link>
          </Breadcrumbs>
        </Stack>
        <Box>
          <Grid
            sx={{
              height: "100%",
              width: "100%",
              py: 6,
            }}
            container
            spacing={6}
          >
            <Grid item xs={12} md={6} sx={{}}>
              <Card sx={{ position: "sticky", top: "24px" }}>
                <Carousel animation="fade">
                  {productImages.map((item) => (
                    <Box
                      component={"img"}
                      key={item.id}
                      sx={{
                        width: "100%",
                        height: "50vh",
                        objectFit: "cover",
                      }}
                      src={item.url}
                      alt={`${product?.name}-image-${item.id}`}
                    />
                  ))}
                </Carousel>
                <CardContent>
                  <Stack direction={"row"} spacing={2}>
                    <Button
                      variant="contained"
                      color="primary"
                      disabled={product?.status !== "ACTIVE"}
                      onClick={() => {
                        setIsAddToCart(false);
                        if (loggedIn) {
                          setPlaceOrderDialogOpen(true);
                        } else {
                          setOnLogin(() => () => {
                            setPlaceOrderDialogOpen(true);
                          });
                          setLoginDialogOpen(true);
                        }
                      }}
                    >
                      Place Order
                    </Button>
                    <Button
                      variant="outlined"
                      color="primary"
                      startIcon={<ShoppingCart />}
                      disabled={product?.status !== "ACTIVE"}
                      onClick={() => {
                        setIsAddToCart(true);
                        setPlaceOrderDialogOpen(true);
                      }}
                    >
                      Add to Cart
                    </Button>
                    <Button
                      variant="outlined"
                      color="primary"
                      startIcon={<Chat />}
                      disabled={product?.status !== "ACTIVE"}
                      onClick={() => {
                        if (loggedIn) {
                          setContactOpen(true);
                        } else {
                          setOnLogin(() => () => {
                            setContactOpen(true);
                          });
                          setLoginDialogOpen(true);
                        }
                      }}
                    >
                      Contact Seller
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card
                sx={{
                  overflowX: "auto",
                }}
              >
                <Stack sx={{ p: 6 }} spacing={6}>
                  <Stack>
                    <Typography variant="h3">
                      {product?.name}
                      {product?.status === "PAUSED" && (
                        <Typography variant="caption" color="error">
                          {" "}
                          (Not accepting orders)
                        </Typography>
                      )}
                      {product?.status === "SOLD_OUT" && (
                        <Typography variant="caption" color="error">
                          {" "}
                          (Sold out)
                        </Typography>
                      )}
                    </Typography>
                    {!!product?.rating && (
                      <Stack
                        direction="row"
                        spacing={2}
                        sx={{
                          alignItems: "end",
                        }}
                      >
                        <Rating value={product?.rating} readOnly />
                        <Typography variant="caption">
                          ({product?.reviewCount})
                        </Typography>
                      </Stack>
                    )}
                    <Typography variant="body1">
                      {product?.description}
                    </Typography>
                  </Stack>
                  <Stack>
                    <Typography variant="h5" color="primary">
                      KES {product?.price}
                    </Typography>
                  </Stack>

                  {!!product?.location.latlng && (
                    <Stack spacing={2}>
                      <Stack>
                        <Typography variant="h5">Location</Typography>
                        <Divider />
                        <Typography
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                          }}
                        >
                          <MapPin size={20} style={{ color: "#ff6537" }} />
                          {product?.location.address}
                        </Typography>
                      </Stack>
                      <Card sx={{ width: "100%", height: "300px" }}>
                        <GoogleMap />
                      </Card>
                    </Stack>
                  )}

                  {!!product?.specifications &&
                    !!Object.keys(product?.specifications).length && (
                      <Stack>
                        <Typography variant="h5">Specifications</Typography>{" "}
                        <Divider />
                        <Table>
                          <TableBody>
                            {specificationMapper(product?.specifications)}
                          </TableBody>
                        </Table>
                      </Stack>
                    )}
                </Stack>
              </Card>
            </Grid>
            <Grid item xs={12}>
              <Card>
                <Stack sx={{ p: 6 }} spacing={6}>
                  <Typography variant="h4">Reviews</Typography>
                  <Stack direction={"row"} spacing={12}>
                    <Stack
                      spacing={1}
                      sx={{
                        width: "20%",
                      }}
                    >
                      {[5, 4, 3, 2, 1].map((rating) => (
                        <Stack
                          direction={"row"}
                          spacing={2}
                          sx={{
                            alignItems: "center",
                          }}
                        >
                          <Typography
                            variant="caption"
                            sx={{ width: "15px", textAlign: "end" }}
                          >
                            {rating}
                          </Typography>

                          <Rating value={1} readOnly max={1} />
                          <Typography
                            variant="caption"
                            sx={{ width: "25px", textAlign: "end" }}
                          >
                            (
                            {product?.productReviews?.filter(
                              (review) => review.rating === rating
                            ).length ?? 0}
                            )
                          </Typography>
                          <LinearProgress
                            variant="determinate"
                            value={
                              ((product?.productReviews?.filter(
                                (review) => review.rating === rating
                              ).length ?? 0) /
                                (product?.productReviews?.length ?? 1)) *
                              100
                            }
                            sx={{
                              width: "100%",
                            }}
                          />
                        </Stack>
                      ))}
                    </Stack>
                    <Stack
                      sx={{
                        width: "80%",
                      }}
                      spacing={2}
                    >
                      {product?.productReviews
                        ?.slice(0, 5)
                        ?.map((review, index) => (
                          <Fragment key={review.id}>
                            <Stack sx={{ p: 2 }} spacing={4} direction={"row"}>
                              <Avatar>
                                {review.order?.buyer?.user?.name[0]}
                              </Avatar>
                              <Stack spacing={2}>
                                <Typography variant="h6">
                                  {review.comment}
                                </Typography>
                                <Rating
                                  value={review.rating}
                                  readOnly
                                  size="small"
                                />
                                <Typography variant="body1">
                                  {review.order?.buyer?.user?.name}
                                </Typography>
                                <Typography variant="caption">
                                  {dayjs(review.createdAt).format(
                                    "YYYY/MM/DD hh:mm a"
                                  )}
                                </Typography>
                              </Stack>
                            </Stack>
                            {index !==
                              (product.productReviews?.length ?? 0) - 1 && (
                              <Box
                                sx={{
                                  borderBottom: 1,

                                  borderColor: "divider",
                                }}
                              />
                            )}
                          </Fragment>
                        ))}
                    </Stack>
                  </Stack>
                </Stack>
              </Card>
            </Grid>
            {/* <Grid item xs={12}></Grid> */}
          </Grid>
        </Box>
      </Stack>
      <LoginDialog
        open={loginDialogOpen}
        setOpen={setLoginDialogOpen}
        platform="buyer"
        onLogin={onLogin}
      />
      <PlaceOrderDialog
        open={placeOrderDialogOpen}
        setOpen={setPlaceOrderDialogOpen}
        product={product}
        isAddToCart={isAddToCart}
      />
      <ContactSellerDialog
        open={contactOpen}
        setOpen={setContactOpen}
        product={product}
      />
    </Container>
  );
};

export default BuyerProductPage;
