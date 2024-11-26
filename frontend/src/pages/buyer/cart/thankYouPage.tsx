import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Container,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Order } from "../../../api/order/placeOrder";
import { useSearchParams } from "react-router-dom";
import { getBuyerOrder } from "../../../api/order/buyer/getBuyerOrder";
import dayjs from "dayjs";
import { Chat } from "@mui/icons-material";
import ContactSellerDialog from "../../../components/Chat/contactSellerDialog";

const ThankYouPage = () => {
  const [order, setOrder] = useState<Order>();
  const [contactOpen, setContactOpen] = useState(false);
  const [query] = useSearchParams();
  useEffect(() => {
    const orderId = query.get("orderId");
    if (orderId) {
      getBuyerOrder(orderId, {
        include: "orderProducts.product,store",
      })
        .then(setOrder)
        .catch(console.error);
    }
  }, [query]);

  return (
    <Container
      maxWidth="md"
      sx={{
        minHeight: "90vh",
      }}
    >
      <Stack
        spacing={6}
        sx={{
          py: 6,
          height: "100%",
        }}
      >
        <Typography variant="h4">Order Confirmation</Typography>
        <Card>
          <CardHeader title="Thank you for your order!" />
          <CardContent>
            <Stack>
              <Typography sx={{ mb: 6 }}>
                Your order has been placed successfully. You will receive an
                email confirmation shortly.
              </Typography>
              <Grid container spacing={2} sx={{ mb: 6 }}>
                <Grid item xs={6} md={3}>
                  <Stack>
                    <Typography variant="body2" color={"primary"}>
                      Order Number
                    </Typography>
                    <Typography fontWeight={700}>{order?.id}</Typography>
                  </Stack>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Stack>
                    <Typography variant="body2" color={"primary"}>
                      Order Date
                    </Typography>
                    <Typography fontWeight={700}>
                      {dayjs(order?.createdAt).format("YYYY/MM/DD hh:mm a")}
                    </Typography>
                  </Stack>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Stack>
                    <Typography variant="body2" color={"primary"}>
                      Store
                    </Typography>
                    <Typography fontWeight={700}>
                      {order?.store?.name}
                    </Typography>
                  </Stack>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Stack>
                    <Typography variant="body2" color={"primary"}>
                      Total
                    </Typography>
                    <Typography fontWeight={700}>
                      KES {order?.priceTotal}
                    </Typography>
                  </Stack>
                </Grid>
              </Grid>
              <Typography variant="h6" sx={{ mb: 6 }}>
                Order Details
              </Typography>

              <Stack spacing={2} sx={{ mb: 6 }}>
                {order?.orderProducts.map((orderProduct) => (
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    sx={{
                      alignItems: "center",
                    }}
                  >
                    <Stack
                      spacing={6}
                      direction="row"
                      sx={{
                        alignItems: "center",
                      }}
                    >
                      <Box
                        component="img"
                        src={orderProduct.product?.thumbnail?.url}
                        alt={orderProduct.product?.name}
                        sx={{
                          width: 100,
                          height: 100,
                          borderRadius: 1,
                          objectFit: "cover",
                          boxShadow: 1,
                        }}
                      />
                      <Stack>
                        <Typography variant="h6">
                          {orderProduct.product?.name}
                        </Typography>
                        <Typography variant="body1">
                          {orderProduct.product?.description}
                        </Typography>
                      </Stack>
                    </Stack>
                    <Stack
                      sx={{
                        alignItems: "end",
                      }}
                    >
                      <Typography variant="h6" color={"primary"}>
                        KES {orderProduct.product?.price}
                      </Typography>
                      <Typography>Quantity: {orderProduct.quantity}</Typography>
                    </Stack>
                  </Stack>
                ))}
              </Stack>

              <Stack direction={"row"} spacing={2}>
                <Button
                  variant="contained"
                  color="primary"
                  href="/orders"
                  sx={{
                    width: "fit-content",
                  }}
                >
                  View My Orders
                </Button>
                <Button
                  variant="outlined"
                  color="primary"
                  startIcon={<Chat />}
                  onClick={() => {
                    setContactOpen(true);
                  }}
                >
                  Contact Seller
                </Button>
              </Stack>
            </Stack>
          </CardContent>
        </Card>
      </Stack>
      <ContactSellerDialog
        open={contactOpen}
        setOpen={setContactOpen}
        storeId={order?.storeId}
      />
    </Container>
  );
};

export default ThankYouPage;
