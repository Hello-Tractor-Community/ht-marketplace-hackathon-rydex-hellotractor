import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Container,
  Stack,
  Typography,
} from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { getBuyerOrders } from "../../../api/order/buyer/getBuyerOrder";
import { Order } from "../../../api/order/placeOrder";
import LoginDialog from "../../../components/Auth/loginDialog";
import dayjs from "dayjs";
import { Chat, Delete, Reviews } from "@mui/icons-material";
import { confirmAction } from "../../../utils/confirm";
import { buyerUpdateOrder } from "../../../api/order/buyer/buyerUpdateOrder";
import { toast } from "../../../utils/toast";
import ContactSellerDialog from "../../../components/Chat/contactSellerDialog";
import ReviewDialog from "../../../components/Orders/reviewDialog";

const BuyerOrdersPage = () => {
  const { loggedIn } = useContext(AuthContext);
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [selectedStoreId, setSelectedStoreId] = useState<number>();
  const [orders, setOrders] = useState<Order[]>();
  const [selectedOrder, setSelectedOrder] = useState<Order>();
  const [reviewOpen, setReviewOpen] = useState(false);

  useEffect(() => {
    if (!loggedIn) return;
    getBuyerOrders({
      include: "orderProducts.product,store",
      sort: "-createdAt",
      filter: "not(equals(status,'CANCELLED'))",
    })
      .then(setOrders)
      .catch(console.error);
  }, [loggedIn]);

  return (
    <Container
      maxWidth="md"
      sx={{
        minHeight: "90%",
      }}
    >
      <Stack
        spacing={6}
        sx={{
          py: 6,
        }}
      >
        <Typography variant="h4">My Orders</Typography>
        <Card>
          <CardHeader title="Orders" />
          <CardContent>
            <Stack spacing={2}>
              {orders?.map((order) => (
                <Card key={order.id}>
                  <CardHeader
                    title={`Order ID: ${order.id}`}
                    subheader={
                      <Typography variant="caption" color="primary">
                        Total:{" "}
                        {order.priceTotal ? (
                          <>KES {order.priceTotal}</>
                        ) : (
                          "Unconfirmed"
                        )}
                      </Typography>
                    }
                    action={
                      <Button
                        color="error"
                        startIcon={<Delete />}
                        onClick={() => {
                          confirmAction({
                            action: async () => {
                              try {
                                await buyerUpdateOrder(order.id, {
                                  status: "CANCELLED",
                                });
                                setOrders((prev) =>
                                  prev?.filter((o) => o.id !== order.id)
                                );
                                toast({
                                  message: "Order cancelled successfully",
                                  severity: "success",
                                });
                              } catch (error) {
                                console.error(error);
                              }
                            },
                            headerText: "Cancel Order",
                            confirmationText:
                              "Are you sure you want to cancel this order?",
                          });
                        }}
                      >
                        Cancel
                      </Button>
                    }
                  />
                  <CardContent>
                    <Stack sx={{ mb: 2 }}>
                      <Typography>Status: {order.status}</Typography>
                      <Typography>
                        Created At:{" "}
                        {dayjs(order.createdAt).format("YYYY/MM/DD hh:mm a")}
                      </Typography>
                    </Stack>
                    <Stack direction={"row"} spacing={2}>
                      <Button
                        variant="outlined"
                        color="primary"
                        startIcon={<Chat />}
                        size="small"
                        onClick={() => {
                          setContactOpen(true);
                          setSelectedStoreId(order.storeId);
                        }}
                      >
                        Contact Seller
                      </Button>
                      {order.status === "DELIVERED" && (
                        <Button
                          variant="outlined"
                          color="primary"
                          startIcon={<Reviews />}
                          size="small"
                          onClick={() => {
                            setSelectedOrder(order);
                            setReviewOpen(true);
                          }}
                        >
                          Leave a Review
                        </Button>
                      )}
                    </Stack>
                  </CardContent>
                </Card>
              ))}
            </Stack>
          </CardContent>
        </Card>
      </Stack>
      <LoginDialog
        open={loginDialogOpen}
        setOpen={setLoginDialogOpen}
        platform="buyer"
        onLogin={() => {}}
      />
      <ContactSellerDialog
        open={contactOpen}
        setOpen={setContactOpen}
        storeId={selectedStoreId}
      />
      <ReviewDialog
        open={reviewOpen}
        setOpen={setReviewOpen}
        order={selectedOrder}
        onSuccess={() => []}
      />
    </Container>
  );
};

export default BuyerOrdersPage;
