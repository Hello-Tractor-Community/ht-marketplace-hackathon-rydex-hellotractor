import { FC, useEffect, useMemo, useState } from "react";
import PageContainer from "../../../components/PageContainer/PageContainer";
import {
  Avatar,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Divider,
  Grid,
  Rating,
  Stack,
  Typography,
} from "@mui/material";
import { getMyProduct, Product } from "../../../api/product/getProducts";
import { useNavigate, useParams } from "react-router-dom";
import { Category } from "@mui/icons-material";
import TableCard from "../../../components/CoolTable/TableCard";
import dayjs from "dayjs";
import ProductDialog from "../../../components/Products/ProductDialog";
import ProductInventoryDialog from "../../../components/Products/productInventoryDialog";

const ProductPage: FC = () => {
  const [product, setProduct] = useState<Product>();
  const [productDialogOpen, setProductDialogOpen] = useState(false);
  const [productInventoryDialogOpen, setProductInventoryDialogOpen] =
    useState(false);
  const recentOrderData = useMemo(
    () =>
      product?.orders?.map((order) => ({
        id: order.id,
        quantity: order.OrderProduct?.quantity,
        pricePerUnit: order.OrderProduct?.pricePerUnit,
        date: dayjs(order.createdAt).format("DD/MM/YYYY hh:mm a"),
      })) ?? [],
    [product]
  );
  const { productId, id } = useParams();

  const navigate = useNavigate();

  useEffect(() => {
    console.log("product page", productId, id);
    if (!productId || !id) return;
    getMyProduct(id, productId, {
      include: "orders,inventory,subCategories",
    })
      .then((product) => {
        console.log("product", product);
        setProduct(product);
      })
      .catch(console.error);
  }, [productId, id]);
  return (
    <PageContainer title="Product Details">
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Stack
            direction={"row"}
            sx={{ justifyContent: "space-between", alignItems: "center" }}
          >
            <Stack
              direction="row"
              spacing={6}
              sx={{
                alignItems: "center",
              }}
            >
              <Avatar
                sx={{
                  height: 100,
                  width: 100,
                  boxShadow: 2,
                }}
                src={product?.thumbnail?.url ?? product?.photos?.[0]?.url}
              >
                <Category />
              </Avatar>
              <Stack>
                <Typography variant="h5">{product?.name}</Typography>
                <Rating readOnly value={4} />
              </Stack>
            </Stack>
            <Button
              variant="contained"
              startIcon={<Category />}
              onClick={() => {
                setProductDialogOpen(true);
              }}
            >
              Edit Product
            </Button>
          </Stack>
        </Grid>
        <Grid item xs={12} md={4}>
          <Stack spacing={6}>
            <Card>
              <CardHeader
                title="Product listing details"
                action={
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => {
                      setProductInventoryDialogOpen(true);
                    }}
                  >
                    Edit
                  </Button>
                }
              />
              <CardContent>
                <Divider />
                <Stack spacing={2}>
                  <Stack>
                    <Typography fontWeight={700}>Product Status</Typography>
                    <Chip
                      color={(() => {
                        switch (product?.status) {
                          case "ACTIVE":
                            return "success";
                          case "PAUSED":
                          default:
                            return "warning";
                        }
                      })()}
                      label={product?.status}
                      sx={{ width: "fit-content" }}
                      variant="outlined"
                    />
                  </Stack>
                  <Stack>
                    <Typography fontWeight={700}>Inventory Tracking</Typography>
                    <Chip
                      color={product?.trackInventory ? "success" : "warning"}
                      label={product?.trackInventory ? "Enabled" : "Disabled"}
                      sx={{ width: "fit-content" }}
                      variant="outlined"
                    />
                  </Stack>
                  {product?.trackInventory && (
                    <Stack>
                      <Typography fontWeight={700}>Stock Count</Typography>
                      <Typography color="primary">
                        {product?.stockCount}
                      </Typography>
                    </Stack>
                  )}
                </Stack>
              </CardContent>
            </Card>
            <Card>
              <CardHeader title="Stats" />
              <CardContent>
                <Divider />
                <Stack spacing={2}>
                  <Stack>
                    <Typography fontWeight={700}>Clicks</Typography>
                    <Typography color="primary"> {product?.clicks}</Typography>
                  </Stack>
                  <Stack>
                    <Typography fontWeight={700}>Views</Typography>
                    <Typography color="primary"> {product?.views}</Typography>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          </Stack>
        </Grid>
        <Grid item xs={12} md={8}>
          <Stack spacing={6}>
            <TableCard
              rows={recentOrderData}
              title="Recent Orders"
              exportable={false}
              onRecordClick={(record) => {
                navigate(`../orders/${record.id}`);
              }}
            />
            <TableCard
              rows={
                product?.inventory?.map((record) => ({
                  amountIn: record.amountIn,
                  amountOut: record.amountOut,
                  date: dayjs(record.createdAt).format("DD/MM/YYYY hh:mm a"),
                })) ?? []
              }
              title="Inventory History"
              exportable={false}
              onRecordClick={(record) => {
                navigate(`../orders/${record.id}`);
              }}
            />
          </Stack>
        </Grid>
      </Grid>
      <ProductDialog
        open={productDialogOpen}
        setOpen={setProductDialogOpen}
        productData={product}
        isEdit={true}
      />
      <ProductInventoryDialog
        open={productInventoryDialogOpen}
        setOpen={setProductInventoryDialogOpen}
        onSuccess={(newStock, status, trackInventory) => {
          if (product) {
            setProduct({
              ...product,
              stockCount: newStock,
              status: status,
              trackInventory,
            });
          }
        }}
        product={product}
      />
    </PageContainer>
  );
};

export default ProductPage;
