import { Close } from "@mui/icons-material";
import {
  AppBar,
  CircularProgress,
  Container,
  Dialog,
  Divider,
  IconButton,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";
import { toast } from "../../utils/toast";
import { Form } from "@rjsf/mui";
import validator from "@rjsf/validator-ajv8";
import fields from "../Fields";
import widgets from "../Widgets";
import { FieldProps, RJSFSchema, UiSchema } from "@rjsf/utils";
import FileUploadTextField from "../Fields/FileUploadTextField";
import { createProduct } from "../../api/product/createProduct";
import { useNavigate, useParams } from "react-router-dom";
import { Product } from "../../api/product/getProducts";
import { updateProduct } from "../../api/product/updateProduct";
import SubCategoryAutocomplete from "./subCategoryAutocomplete";
import {
  getSubcategories,
  SubCategory,
} from "../../api/product/getSearchOptions";
import { ProductCondition } from "./filterCard";

const createProductSchema = (subCategory?: SubCategory): RJSFSchema => ({
  type: "object",
  properties: {
    name: { type: "string", title: "Product Name" },
    price: { type: "number", title: "Price" },
    description: { type: "string" },
    status: { type: "string", enum: ["ACTIVE", "PAUSED"], default: "ACTIVE" },
    condition: {
      type: "string",
      title: "Condition",
      default: "USED_GOOD",
      enum: [
        "NEW",
        "USED_EXCELLENT",
        "USED_FAIR",
        "USED_GOOD",
      ] as ProductCondition[],
    },
    location: {
      type: "object",
      title: "Location",
      properties: {
        latlng: { type: "string" },
        address: { type: "string" },
      },
    },

    thumbnail: {
      type: "object",
      title: "Thumbnail",
      properties: {
        id: { type: "string" },
        url: { type: "string" },
        uploadedOn: { type: "string", format: "date-time" },
      },
    },
    photos: {
      type: "array",
      title: "Other Photos",
      items: {
        type: "object",
        properties: {
          id: { type: "string" },
          url: { type: "string" },
          uploadedOn: { type: "string", format: "date-time" },
        },
      },
    },

    ...(subCategory?.specificationSchema
      ? {
          specifications: subCategory.specificationSchema,
        }
      : {}),

    // specifications: { type: "object" },

    // history: {
    //   type: "array",
    //   items: {
    //     type: "object",
    //     properties: {
    //       date: { type: "string", format: "date-time" },
    //       event: { type: "string" },
    //     },
    //   },
    // },
  },
  required: ["name", "price", "description"],
});
const createProductUISchema: UiSchema = {
  photos: {
    items: {
      "ui:field": "FileUploadTextField",
    },
  },
  thumbnail: {
    "ui:field": (props: FieldProps) => {
      return (
        <Stack>
          <Typography variant="h5">Thumbnail</Typography>
          <Divider />
          <FileUploadTextField {...props} />
        </Stack>
      );
    },
  },
  location: {
    "ui:field": "PlacesTextField",
  },
  description: {
    "ui:widget": "textarea",
  },
};

type Props = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  isEdit?: boolean;
  productData?: Product;
};
const ProductDialog: FC<Props> = ({ open, setOpen, isEdit, productData }) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [uploading, setUploading] = useState(false);
  const [subcategory, setSubCategory] = useState<SubCategory>();
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const { id } = useParams();

  const navigate = useNavigate();

  useEffect(() => {
    getSubcategories().then(setSubCategories).catch(console.error);
  }, []);

  useEffect(() => {
    if (productData?.subCategories) {
      setSubCategory(productData.subCategories[0]);
    }
  }, [subCategories, productData]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSubmit = async (data: any) => {
    setUploading(true);
    try {
      if (isEdit) {
        if (!productData?.id || !id) {
          throw new Error("Product id not found");
        }
        await updateProduct(data, productData?.id, id);
        window.location.reload();
      } else {
        if (!subcategory) {
          throw new Error("Please select a subcategory");
        }
        const newProduct = await createProduct(data, id!);
        navigate(`/seller/stores/${id}/products/${newProduct?.id}`);
      }
      toast({
        message: "Product created successfully",
        severity: "success",
      });

      setOpen(false);
    } catch (error) {
      console.error(error);
    }
    setUploading(false);
  };

  console.log("productData", productData);

  return (
    <Dialog open={open} onClose={() => setOpen(false)} fullScreen>
      <Stack
        sx={{
          alignItems: "center",
          height: "100%",
        }}
      >
        <AppBar sx={{ position: "relative", flexShrink: 0 }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={() => setOpen(false)}
              aria-label="close"
            >
              <Close />
            </IconButton>
            <Typography
              sx={{
                ml: 2,
                flex: 1,
                color: (theme) => theme.palette.primary.contrastText,
              }}
              variant="h6"
              component="div"
            >
              {isEdit ? "Edit" : "Create"} Product
            </Typography>
          </Toolbar>
        </AppBar>
        <Container
          maxWidth="md"
          sx={{
            flexGrow: 1,
            overflowY: "auto",
          }}
        >
          <Stack spacing={4} sx={{ py: 4 }}>
            {uploading ? (
              <Stack
                sx={{
                  width: "100%",
                  height: "100%",
                  justifyContent: "center",
                  alignItems: "center",
                  position: "relative",
                }}
                spacing={2}
              >
                <CircularProgress size={32} />
                <Typography variant="h6">Creating product...</Typography>
              </Stack>
            ) : (
              <>
                <SubCategoryAutocomplete
                  value={subcategory}
                  onChange={setSubCategory}
                  options={subCategories}
                />
                <Form
                  formData={productData}
                  schema={createProductSchema(subcategory)}
                  uiSchema={createProductUISchema}
                  validator={validator}
                  onSubmit={(data) => {
                    console.log(" product dialog form submitted", data);
                    handleSubmit(data.formData);
                  }}
                  fields={fields}
                  widgets={widgets}
                />
              </>
            )}
          </Stack>
        </Container>
      </Stack>
    </Dialog>
  );
};

export default ProductDialog;
