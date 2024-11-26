import { Category, ChevronRight } from "@mui/icons-material";
import {
  Box,
  Breadcrumbs,
  Card,
  CardActionArea,
  CardContent,
  CardHeader,
  Chip,
  Container,
  Grid,
  Link,
  Pagination,
  Stack,
  Typography,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import {
  getCategoryProducts,
  getProducts,
  getSubCategoryProducts,
  humanFriendlyCondition,
  Product,
} from "../../api/product/getProducts";
import { useSearchParams } from "react-router-dom";
import FilterCard from "../../components/Products/filterCard";
import { MapPin } from "lucide-react";

const EcommerceLayout = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [highestPrice, setHighestPrice] = useState(0);
  const [lowestPrice, setLowestPrice] = useState(0);
  const [strategy, setStrategy] = useState<
    "category" | "subCategory" | "search" | "default"
  >("category");
  const [pageSize] = useState(9);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    setPageNumber(1);
  }, [searchParams]);

  useEffect(() => {
    console.log("reloading");

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const params: any = {
      "page[number]": pageNumber,
      "page[size]": pageSize,
      sort: "-updatedAt",
    };

    const filters = [];
    if (searchParams.get("minPrice")) {
      filters.push(`greaterOrEqual(price, '${searchParams.get("minPrice")}')`);
    }
    if (searchParams.get("maxPrice")) {
      filters.push(`lessOrEqual(price, '${searchParams.get("maxPrice")}')`);
    }
    if (searchParams.get("condition")) {
      filters.push(`equals(condition,'${searchParams.get("condition")}')`);
    }

    const grouped = [];
    for (let i = 0; i < filters.length; i += 2) {
      grouped.push(
        filters.length > i ? `and(${filters[i]},${filters[i + 1]})` : filters[i]
      );
    }

    params.filter = `and(${grouped.join(",")})`;
    if (searchParams.get("specs")) {
      params.specifications = searchParams.get("specs");
    }
    const category = searchParams.get("category");
    if (category) {
      getCategoryProducts(category, params)
        .then(({ total, products, highestPrice, lowestPrice }) => {
          setProducts(products);
          setHighestPrice(highestPrice ?? 1000000);
          setLowestPrice(lowestPrice ?? 0);
          setTotal(total);
        })
        .catch(console.error);

      setStrategy("category");

      return;
    }
    const subCategory = searchParams.get("subCategory");
    if (subCategory) {
      getSubCategoryProducts(subCategory, params)
        .then(({ total, products, highestPrice, lowestPrice }) => {
          setProducts(products);
          setTotal(total);
          setHighestPrice(highestPrice ?? 1000000);
          setLowestPrice(lowestPrice ?? 0);
        })
        .catch(console.error);

      setStrategy("subCategory");

      return;
    }
    const search = searchParams.get("search");
    if (search) {
      getProducts({
        ...params,
        filter: `contains(name,'${search}')`,
      })
        .then(({ total, products, highestPrice, lowestPrice }) => {
          setProducts(products);
          setTotal(total);
          setHighestPrice(highestPrice ?? 1000000);
          setLowestPrice(lowestPrice ?? 0);
        })
        .catch(console.error);
      setStrategy("search");
      return;
    }

    setStrategy("default");
    getProducts(params)
      .then(({ total, products, highestPrice, lowestPrice }) => {
        setProducts(products);
        console.log("name of last product", products[products.length - 1].name);
        setTotal(total);
        setHighestPrice(highestPrice ?? 1000000);
        setLowestPrice(lowestPrice ?? 0);
      })
      .catch(console.error);
  }, [pageNumber, pageSize, searchParams]);

  const breadCrumbs = useMemo(() => {
    const crumbs = [
      {
        href: "/",
        label: "Home",
      },
    ];
    if (strategy === "category") {
      crumbs.push({
        href: `/shop?category=${products?.[0]?.subCategories?.[0]?.category?.id}`,
        label: products?.[0]?.subCategories?.[0]?.category?.name ?? "Category",
      });
    }
    if (strategy === "subCategory") {
      crumbs.push(
        {
          href: `/shop?category=${products?.[0]?.subCategories?.[0]?.category?.id}`,
          label:
            products?.[0]?.subCategories?.[0]?.category?.name ?? "Category",
        },
        {
          href: `/shop?subCategory=${products?.[0]?.subCategories?.[0]?.id}`,
          label: products?.[0]?.subCategories?.[0]?.name ?? "Subcategory",
        }
      );
    }
    if (strategy === "search") {
      crumbs.push({
        href: `/shop?search=${searchParams.get("search")}`,
        label: "Search Results",
      });
    }

    return crumbs;
  }, [products, strategy, searchParams]);

  return (
    <Container
      maxWidth="xl"
      sx={{
        minHeight: "90%",
      }}
    >
      <Stack spacing={6} sx={{ p: 6 }}>
        <Stack>
          <Breadcrumbs
            aria-label="breadcrumb"
            sx={{ mb: 1 }}
            separator={<ChevronRight fontSize="small" />}
          >
            {breadCrumbs.map((crumb) => (
              <Link
                key={crumb.href}
                underline="hover"
                href={crumb.href}
                variant="caption"
              >
                {crumb.label}
              </Link>
            ))}
          </Breadcrumbs>
          <Typography variant="h5">
            {(() => {
              if (strategy === "category")
                return (
                  products?.[0]?.subCategories?.[0]?.category?.name ??
                  "Category"
                );
              if (strategy === "subCategory")
                return products?.[0]?.subCategories?.[0]?.name ?? "Subcategory";
              if (strategy === "search")
                return "Search Results: " + searchParams.get("search");

              return "All Products";
            })()}
          </Typography>
          <Typography variant="body1">
            Showing {(pageNumber - 1) * pageSize + 1}-
            {pageNumber * pageSize > total ? total : pageNumber * pageSize} of{" "}
            {total}
          </Typography>
        </Stack>

        <Box>
          <Grid container spacing={6}>
            <Grid item xs={12} md={3}>
              <Stack spacing={2}>
                <FilterCard
                  highestPrice={highestPrice}
                  lowestPrice={lowestPrice}
                  subCategory={products?.[0]?.subCategories?.[0]}
                />
              </Stack>
            </Grid>

            <Grid item xs={12} md={9}>
              <Stack>
                <Grid container spacing={6}>
                  {products.map((product) => {
                    const defaultImage =
                      product.thumbnail?.url ?? product.photos[0]?.url;

                    return (
                      <Grid item key={product.id} xs={12} sm={6} md={4}>
                        <Card
                          sx={{
                            height: "100%",
                          }}
                        >
                          <CardActionArea
                            href={`/product/${product.id}`}
                            sx={{
                              height: "100%",
                              "&:hover": {
                                boxShadow: 7,
                              },
                            }}
                          >
                            <Stack>
                              <Box
                                sx={{
                                  width: "100%",
                                  aspectRatio: {
                                    xs: "2/1",
                                    sm: "1/1",
                                  },
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
                                    {/* <Typography color="text.secondary">
                                  {product.description?.slice(0, 100)}
                                </Typography> */}
                                    <Stack
                                      direction={"row"}
                                      sx={{
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                      }}
                                    >
                                      <Typography
                                        color="primary"
                                        sx={{
                                          alignSelf: "flex-end",
                                          fontWeight: 700,
                                        }}
                                      >
                                        KES {product.price}
                                      </Typography>
                                      <Chip
                                        color="primary"
                                        variant="outlined"
                                        size="small"
                                        sx={{
                                          alignSelf: "flex-end",
                                        }}
                                        label={humanFriendlyCondition(
                                          product.condition
                                        )}
                                      ></Chip>
                                    </Stack>

                                    <Typography
                                      sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 1,
                                        fontWeight: 600,
                                      }}
                                      variant="caption"
                                    >
                                      <MapPin
                                        size={20}
                                        style={{ color: "#ff6537" }}
                                      />
                                      {product?.location.address}
                                    </Typography>
                                  </Stack>
                                </CardContent>
                              </Stack>
                            </Stack>
                          </CardActionArea>
                        </Card>
                      </Grid>
                    );
                  })}
                  <Grid item xs={12}>
                    <Pagination
                      count={Math.ceil(total / pageSize)}
                      onChange={(_, page) => setPageNumber(page)}
                    />
                  </Grid>
                </Grid>
              </Stack>
            </Grid>
          </Grid>
        </Box>
      </Stack>
    </Container>
  );
};
export default EcommerceLayout;
