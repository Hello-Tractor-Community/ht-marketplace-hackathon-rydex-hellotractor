import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Container,
  Grid,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { FC, useContext, useState } from "react";
import { CartContext } from "../../../context/CartContext";
import { v4 } from "uuid";
import { Add, Remove } from "@mui/icons-material";
import LoginDialog from "../../../components/Auth/loginDialog";
import { AuthContext } from "../../../context/AuthContext";
import { placeOrder, PlaceOrderPayload } from "../../../api/order/placeOrder";

const CartPage: FC = () => {
  const { cartItems, addToCart } = useContext(CartContext);
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);
  const [onLogin, setOnLogin] = useState<() => void>(() => () => {});
  const { loggedIn } = useContext(AuthContext);

  const handleOrder = async () => {
    try {
      if (!loggedIn) return;
      if (!cartItems.length) return;

      const orders: PlaceOrderPayload[] = cartItems.reduce((acc, item) => {
        const store = acc.find((p) => p.storeId === item.product.storeId);
        if (store) {
          store.orderProducts.push({
            productId: item.product.id,
            quantity: item.quantity,
          });
        } else {
          acc.push({
            storeId: item.product.storeId,
            orderProducts: [
              {
                productId: item.product.id,
                quantity: item.quantity,
              },
            ],
          });
        }
        return acc;
      }, [] as PlaceOrderPayload[]);

      console.log(orders);

      const promises = orders.map((order) => placeOrder(order));

      const finalorders = await Promise.all(promises);

      for (const order of finalorders) {
        window.open(`/thankyou?orderId=${order.id}`, "_blank");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Container
      maxWidth="lg"
      sx={{
        minHeight: "90vh",
      }}
    >
      <Grid
        container
        spacing={6}
        sx={{
          py: 6,
          height: {
            xs: "fit-content",
            md: "100%",
          },
        }}
      >
        <Grid
          item
          xs={12}
          md={8}
          sx={{
            height: {
              xs: "fit-content",
              md: "100%",
            },
          }}
        >
          <Card
            sx={{
              height: {
                xs: "fit-content",
                md: "100%",
              },
            }}
          >
            <CardHeader title="Cart" />
            <CardContent>
              <Stack spacing={2}>
                {cartItems.map((item) => (
                  <Stack key={v4()}>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      sx={{
                        alignItems: "center",
                      }}
                    >
                      <Stack
                        spacing={2}
                        direction="row"
                        sx={{
                          alignItems: "center",
                        }}
                      >
                        <Box
                          component="img"
                          src={item.product.thumbnail?.url}
                          alt={item.product.name}
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
                            {item.product.name}
                          </Typography>
                          <Typography variant="body1">
                            {item.product.description}
                          </Typography>
                        </Stack>
                      </Stack>
                      <Stack
                        sx={{
                          alignItems: "end",
                        }}
                      >
                        <Typography variant="h6" color={"primary"}>
                          KES {item.product.price}
                        </Typography>
                        <Stack
                          direction="row"
                          justifyContent="flex-end"
                          sx={{
                            alignItems: "center",
                          }}
                        >
                          <IconButton
                            onClick={() => {
                              addToCart(item.product, -1);
                            }}
                          >
                            <Remove />
                          </IconButton>
                          <Typography variant="h6">{item.quantity}</Typography>
                          <IconButton
                            onClick={() => {
                              addToCart(item.product, 1);
                            }}
                          >
                            <Add />
                          </IconButton>
                        </Stack>
                      </Stack>
                    </Stack>
                  </Stack>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardHeader title="Summary" />
            <CardContent>
              <Stack spacing={2}>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  sx={{
                    alignItems: "center",
                  }}
                >
                  <Typography>Subtotal</Typography>
                  <Typography>
                    {cartItems.reduce(
                      (acc, item) => acc + item.product.price * item.quantity,
                      0
                    )}
                  </Typography>
                </Stack>
                {/* <Stack
                  direction="row"
                  justifyContent="space-between"
                  sx={{
                    alignItems: "center",
                  }}
                >
                  <Typography>Shipping</Typography>
                  <Typography>0</Typography>
                </Stack> */}
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  sx={{
                    alignItems: "center",
                  }}
                >
                  <Typography>Total</Typography>
                  <Typography>
                    {cartItems.reduce(
                      (acc, item) => acc + item.product.price * item.quantity,
                      0
                    )}
                  </Typography>
                </Stack>

                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    if (loggedIn) {
                      handleOrder();
                    } else {
                      setOnLogin(() => () => {
                        handleOrder();
                      });
                      setLoginDialogOpen(true);
                    }
                  }}
                >
                  Order now
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <LoginDialog
        open={loginDialogOpen}
        setOpen={setLoginDialogOpen}
        platform="buyer"
        onLogin={onLogin}
      />
    </Container>
  );
};

export default CartPage;
