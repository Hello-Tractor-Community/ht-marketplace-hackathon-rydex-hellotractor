import { FC, Fragment, useEffect, useMemo, useState } from "react";
import PageContainer from "../../../components/PageContainer/PageContainer";
import { Order, OrderProduct } from "../../../api/order/placeOrder";
import { useParams, useSearchParams } from "react-router-dom";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Rating,
  Stack,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import { getStoreOrder } from "../../../api/order/seller/getStoreOrders";
import StoreUpdateOrderDialog from "../../../components/Orders/storeUpdateOrderDialog";
import TableCard from "../../../components/CoolTable/TableCard";
import UpdateOrderProductDialog from "../../../components/Orders/updateOrderProductDialog";
import dayjs from "dayjs";
import { createStockRecord } from "../../../api/product/createStockRecord";
import { toast } from "../../../utils/toast";
import ContactBuyerDialog from "../../../components/Chat/ContactBuyerDialog";

const StoreOrderPage: FC = () => {
  const [order, setOrder] = useState<Order>();
  const [search, setSearch] = useSearchParams();
  const [tab, setTab] = useState(search.get("tab") ?? "details");
  const [updateOrderOpen, setUpdateOrderOpen] = useState(false);
  const [updateOrderProductOpen, setUpdateOrderProductOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<OrderProduct>();
  const [updateStockLoaing, setUpdateStockLoading] = useState(false);
  const [contactBuyerOpen, setContactBuyerOpen] = useState(false);

  const { id, orderId } = useParams();

  useEffect(() => {
    if (tab) setSearch({ tab });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  useEffect(() => {
    if (!id || !orderId) return;
    getStoreOrder(id, orderId, {
      include:
        "buyer.user,orderProducts.product,productReviews.order.buyer.user",
    })
      .then(setOrder)
      .catch(console.error);
  }, [id, orderId]);

  const canUpateStock = useMemo(
    () => order?.orderProducts?.some((op) => !op.productInventoryId),
    [order]
  );

  const handleUpdateStock = async () => {
    try {
      if (!order || !id || !orderId) return;

      setUpdateStockLoading(true);

      const promises = order.orderProducts
        ?.filter((op) => !op.productInventoryId)
        .map((op) =>
          createStockRecord(id, op.productId, [
            {
              amountIn: 0,
              amountOut: op.quantity,
              orderId: order.id,
            },
          ])
        );

      await Promise.all(promises ?? []);

      setOrder((prev) => ({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ...(prev as any),
        orderProducts: prev?.orderProducts?.map((op) => ({
          ...op,
          productInventoryId: op.productInventoryId ?? 1,
        })),
      }));

      toast({
        message: "Stock records updated successfully",
        severity: "success",
      });
    } catch (error) {
      console.error(error);
    }

    setUpdateStockLoading(false);
  };

  return (
    <PageContainer title={`Order #${order?.id}`}>
      <Card>
        <Tabs value={tab} onChange={(_, v) => setTab(v)}>
          <Tab label="Order Details" value={"details"} />
          <Tab label="Order Products" value={"products"} />
          <Tab label="Reviews" value={"reviews"} />
        </Tabs>
        <CardContent>
          <Box hidden={tab !== "details"}>
            <Card>
              <CardHeader title="Order Details" />
              <CardContent>
                <Stack spacing={4} sx={{ mb: 2 }}>
                  <Stack>
                    <Typography>
                      <strong>Order ID:</strong> {orderId}
                    </Typography>
                    <Typography>
                      <strong>Buyer:</strong> {order?.buyer?.user?.name}
                    </Typography>
                    <Typography>
                      <strong>Price Total:</strong> {order?.priceTotal}
                    </Typography>
                    <Typography>
                      <strong>Status:</strong>{" "}
                      <Typography component={"span"} color={"primary"}>
                        {order?.status}
                      </Typography>
                    </Typography>
                    <Typography>
                      <strong>Created At:</strong>{" "}
                      {dayjs(order?.createdAt).format("DD/MM/YYYY hh:mm a")}
                    </Typography>
                  </Stack>
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{ width: "fit-content" }}
                    onClick={() => setUpdateOrderOpen(true)}
                  >
                    Update Order Status
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{ width: "fit-content" }}
                    onClick={() => setContactBuyerOpen(true)}
                  >
                    Chat with Buyer
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Box>
          <Box hidden={tab !== "products"}>
            <TableCard
              rows={
                order?.orderProducts?.map((orderProduct) => ({
                  id: orderProduct.productId,
                  productName: orderProduct.product?.name,
                  quantity: orderProduct.quantity,
                  pricePerUnit: orderProduct.pricePerUnit,
                })) ?? []
              }
              title="Order Products"
              onRecordClick={(record) => {
                setSelectedRecord(
                  order?.orderProducts?.find((op) => op.productId === record.id)
                );
                setUpdateOrderProductOpen(true);
              }}
              action={
                canUpateStock ? (
                  <Button
                    variant="contained"
                    size="small"
                    color="primary"
                    onClick={handleUpdateStock}
                    disabled={updateStockLoaing}
                    startIcon={
                      updateStockLoaing ? (
                        <CircularProgress size={16} />
                      ) : undefined
                    }
                  >
                    Update Stock Records
                  </Button>
                ) : undefined
              }
            />
          </Box>
          <Box hidden={tab !== "reviews"}>
            {order?.productReviews?.slice(0, 5)?.map((review, index) => (
              <Fragment key={review.id}>
                <Stack sx={{ p: 2 }} spacing={4} direction={"row"}>
                  <Avatar>{review.order?.buyer?.user?.name[0]}</Avatar>
                  <Stack spacing={2}>
                    <Typography variant="h5">
                      {
                        order.orderProducts.find(
                          (o) => o.productId === review.productId
                        )?.product?.name
                      }
                    </Typography>
                    <Typography variant="body1">{review.comment}</Typography>
                    <Rating value={review.rating} readOnly size="small" />
                    <Typography variant="body2">
                      {review.order?.buyer?.user?.name}
                    </Typography>
                    <Typography variant="caption">
                      {dayjs(review.createdAt).format("YYYY/MM/DD hh:mm a")}
                    </Typography>
                  </Stack>
                </Stack>
                {index !== (order.productReviews?.length ?? 0) - 1 && (
                  <Box
                    sx={{
                      borderBottom: 1,

                      borderColor: "divider",
                    }}
                  />
                )}
              </Fragment>
            ))}
          </Box>
        </CardContent>
      </Card>
      {order?.buyer?.user?.id && (
        <ContactBuyerDialog
          open={contactBuyerOpen}
          setOpen={setContactBuyerOpen}
          buyerId={order?.buyer?.user?.id}
        />
      )}
      <UpdateOrderProductDialog
        open={updateOrderProductOpen}
        setOpen={setUpdateOrderProductOpen}
        orderProduct={selectedRecord}
        storeId={id}
        orderId={orderId}
        onSave={(data) => {
          setOrder((prev) => ({
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ...(prev as any),
            orderProducts: prev?.orderProducts?.map((op) =>
              op.id === data.id ? { ...op, ...data } : op
            ),
            priceTotal:
              prev?.orderProducts?.reduce(
                (acc, op) => acc + (op.pricePerUnit ?? 0) * op.quantity,
                0
              ) ?? 0,
          }));
        }}
      />
      <StoreUpdateOrderDialog
        open={updateOrderOpen}
        setOpen={setUpdateOrderOpen}
        schema={{
          type: "object",
          properties: {
            status: {
              type: "string",
              title: "Status",
              enum: [
                "PENDING",
                "PROCESSING",
                "SHIPPED",
                "DELIVERED",
                "CANCELLED",
              ],
            },
          },
        }}
        onSuccess={(data) => {
          setOrder((prev) => ({ ...prev, ...data }));
        }}
        order={order}
      />
    </PageContainer>
  );
};

export default StoreOrderPage;
