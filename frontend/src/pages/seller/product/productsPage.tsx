import { FC, useEffect, useState } from "react";
import PageContainer from "../../../components/PageContainer/PageContainer";
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  CardHeader,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import { Add, Category } from "@mui/icons-material";
import { useParams } from "react-router-dom";
import dayjs from "dayjs";
import { getMyProducts, Product } from "../../../api/product/getProducts";
import ProductDialog from "../../../components/Products/ProductDialog";

const ProductsPage: FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct] = useState<Product>();
  const [isEdit, setIsEdit] = useState(false);
  const [productDialogOpen, setProductDialogOpen] = useState(false);
  const { id } = useParams();

  useEffect(() => {
    if (!id) {
      return;
    }
    getMyProducts(id).then(setProducts).catch(console.error);
  }, [id]);

  return (
    <PageContainer title="Products">
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Button
            variant="contained"
            startIcon={<Add />}
            sx={{
              width: "fit-content",
              height: "fit-content",
            }}
            onClick={() => {
              setIsEdit(false);
              setProductDialogOpen(true);
            }}
          >
            Create Product
          </Button>
        </Grid>
        {products.map((product) => {
          const defaultImage = product.thumbnail?.url ?? product.photos[0]?.url;

          return (
            <Grid item key={product.id} xs={12} md={6} lg={4}>
              <Card>
                <CardActionArea
                  href={`products/${product.id}`}
                  // onClick={() => {
                  //   setIsEdit(true);
                  //   setSelectedProduct(product);
                  //   setProductDialogOpen(true);
                  // }}
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
      <ProductDialog
        open={productDialogOpen}
        setOpen={setProductDialogOpen}
        isEdit={isEdit}
        productData={selectedProduct}
      />
    </PageContainer>
  );
};

export default ProductsPage;
