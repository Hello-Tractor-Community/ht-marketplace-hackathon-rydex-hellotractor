import { FC, useEffect, useState } from "react";
import PageContainer from "../../../components/PageContainer/PageContainer";
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardHeader,
  Chip,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import { Category } from "@mui/icons-material";
import dayjs from "dayjs";
import { getProducts, Product } from "../../../api/product/getProducts";
import AdminApproveDialog from "../../../components/Products/adminApproveProductDialog";

const AdminProductsPage: FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product>();
  const [productDialogOpen, setProductDialogOpen] = useState(false);

  useEffect(() => {
    getProducts()
      .then(({ products }) => setProducts(products))
      .catch(console.error);
  }, []);

  return (
    <PageContainer title="Products">
      <Grid container spacing={6}>
        {products.map((product) => {
          const defaultImage = product.thumbnail?.url ?? product.photos[0]?.url;

          return (
            <Grid item key={product.id} xs={12} md={6} lg={4}>
              <Card>
                <CardActionArea
                  //   href={`products/${product.id}`}
                  onClick={() => {
                    setSelectedProduct(product);
                    setProductDialogOpen(true);
                  }}
                >
                  <Stack>
                    <Box
                      sx={{
                        width: "100%",
                        aspectRatio: "1/1",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        p: 2,
                      }}
                    >
                      {defaultImage ? (
                        <Box
                          component={"img"}
                          src={defaultImage}
                          alt={product.name}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "contain",
                          }}
                        />
                      ) : (
                        <Category
                          sx={{
                            fontSize: 100,
                            color: "text.secondary",
                          }}
                        />
                      )}
                    </Box>
                    <Stack>
                      <CardHeader title={product.name} />
                      <CardContent>
                        <Stack spacing={4}>
                          <Typography color="text.secondary">
                            {product.description?.slice(0, 100)}
                          </Typography>
                          <Stack
                            direction={"row"}
                            sx={{
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                          >
                            <Stack>
                              <Typography
                                variant="caption"
                                color={"text.secondary"}
                              >
                                Created on:{" "}
                                {dayjs(product.createdAt).format(
                                  "DD MMM YYYY hh:mm a"
                                )}
                              </Typography>
                              <Typography
                                variant="caption"
                                color={"text.secondary"}
                              >
                                Last Modified:{" "}
                                {dayjs(product.updatedAt).format(
                                  "DD MMM YYYY hh:mm a"
                                )}
                              </Typography>
                            </Stack>
                            <Typography
                              color="primary"
                              sx={{
                                alignSelf: "flex-end",
                              }}
                            >
                              KES {product.price}
                            </Typography>
                          </Stack>
                          <Chip
                            label={product.status}
                            variant="outlined"
                            sx={{
                              width: "fit-content",
                            }}
                            color={
                              product.status === "ACTIVE"
                                ? "success"
                                : "warning"
                            }
                          />
                        </Stack>
                      </CardContent>
                    </Stack>
                  </Stack>
                </CardActionArea>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      <AdminApproveDialog
        open={productDialogOpen}
        setOpen={setProductDialogOpen}
        product={selectedProduct}
        onSuccess={(status) => {
          setProducts((prevProducts) => {
            const index = prevProducts.findIndex(
              (product) => product.id === selectedProduct?.id
            );
            if (index !== -1) {
              prevProducts[index].status = status;
            }
            return [...prevProducts];
          });
        }}
      />
    </PageContainer>
  );
};

export default AdminProductsPage;
