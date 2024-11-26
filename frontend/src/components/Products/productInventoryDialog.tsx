import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Switch,
  TextField,
} from "@mui/material";
import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";
import { Product, ProductListingStatus } from "../../api/product/getProducts";
import { createStockRecord } from "../../api/product/createStockRecord";
import { updateProduct } from "../../api/product/updateProduct";
import { toast } from "../../utils/toast";

type Props = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  product?: Product;
  onSuccess?: (
    newStock: number,
    newStatus: ProductListingStatus,
    trackInventory: boolean
  ) => void;
};
const ProductInventoryDialog: FC<Props> = ({
  product,
  open,
  setOpen,
  onSuccess,
}) => {
  const [status, setStatus] = useState<ProductListingStatus>("ACTIVE");
  const [newStock, setNewStock] = useState(0);
  const [trackInventory, setTrackInventory] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (product) {
      setStatus(product.status);
      setTrackInventory(product.trackInventory ?? false);
    }
  }, [product]);

  const handleSave = async () => {
    try {
      if (!product) return;

      const diffStock = newStock - (product?.stockCount ?? 0);

      console.log("diffStock", diffStock);
      console.log("trackInventory", trackInventory);
      console.log("prduct", product);

      setLoading(true);

      if (
        product?.status !== status ||
        product?.trackInventory !== trackInventory
      ) {
        await updateProduct(
          { status, trackInventory },
          product.id,
          product.storeId
        );
      }

      if (trackInventory) {
        if (diffStock > 0) {
          await createStockRecord(product?.storeId, product?.id, [
            {
              amountIn: diffStock,
              amountOut: 0,
            },
          ]);
        }
        if (diffStock < 0) {
          await createStockRecord(product?.storeId, product?.id, [
            {
              amountIn: 0,
              amountOut: -diffStock,
            },
          ]);
        }
      }

      toast({
        message: "Product inventory updated successfully",
        severity: "success",
      });
      onSuccess?.(newStock, status, trackInventory);
      setOpen(false);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  return (
    <Dialog
      open={open}
      onClose={() => {
        setOpen(false);
      }}
    >
      <DialogTitle>Edit Product Listing Details</DialogTitle>
      <DialogContent>
        <Stack sx={{ py: 2 }} spacing={2}>
          <FormControl fullWidth>
            <InputLabel id="pstats">Product Status</InputLabel>
            <Select
              value={status}
              onChange={(e) =>
                setStatus(e.target.value as ProductListingStatus)
              }
              label="Product Status"
              labelId="pstats"
            >
              <MenuItem value="ACTIVE">Active</MenuItem>
              <MenuItem value="PAUSED">Paused</MenuItem>
              <MenuItem value="SOLD_OUT">Sold out</MenuItem>
            </Select>
          </FormControl>

          <FormControlLabel
            label="Track inventoy"
            control={
              <Switch
                checked={trackInventory}
                onChange={(e) => setTrackInventory(e.target.checked)}
              />
            }
          />

          {trackInventory && (
            <TextField
              label="New Stock Count"
              type="number"
              helperText={
                product?.stockCount !== undefined &&
                product?.stockCount !== null
                  ? `Current Stock Count: ${product.stockCount}`
                  : ""
              }
              value={newStock}
              onChange={(e) => setNewStock(Number(e.target.value))}
            />
          )}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            setOpen(false);
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={16} /> : undefined}
          onClick={handleSave}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProductInventoryDialog;
