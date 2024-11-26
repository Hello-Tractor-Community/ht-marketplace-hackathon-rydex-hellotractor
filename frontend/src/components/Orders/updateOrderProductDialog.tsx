import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
} from "@mui/material";
import { FC, useEffect, useState } from "react";
import { OrderProduct } from "../../api/order/placeOrder";
import { updateStoreOrderProduct } from "../../api/order/seller/updateOrder";
import { toast } from "../../utils/toast";
import { Save } from "lucide-react";

type Props = {
  orderProduct?: OrderProduct;
  open: boolean;
  setOpen: (open: boolean) => void;
  onSave?: (orderProduct: OrderProduct) => void;
  storeId?: string | number;
  orderId?: string | number;
};
const UpdateOrderProductDialog: FC<Props> = ({
  orderProduct,
  open,
  setOpen,
  onSave,
  storeId,
  orderId,
}) => {
  const [newQuantity, setNewQuantity] = useState<number>(
    orderProduct?.quantity ?? 0
  );
  const [newPrice, setNewPrice] = useState<number>(
    orderProduct?.pricePerUnit ?? 0
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setNewQuantity(orderProduct?.quantity ?? 0);
    setNewPrice(orderProduct?.pricePerUnit ?? 0);
  }, [open, orderProduct]);

  const handleSave = async () => {
    try {
      if (!orderProduct?.productId || !storeId || !orderId) return;
      setLoading(true);
      await updateStoreOrderProduct(
        {
          pricePerUnit: newPrice,
          quantity: newQuantity,
        },
        storeId,
        orderId,
        orderProduct?.productId
      );
      onSave?.({
        ...orderProduct,
        pricePerUnit: newPrice,
        quantity: newQuantity,
      });
      toast({
        message: "Order Product updated successfully",
        severity: "success",
      });
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  return (
    <Dialog open={open} onClose={() => setOpen(false)} maxWidth="xs" fullWidth>
      <DialogTitle>
        {orderProduct?.product?.name} - {orderProduct?.quantity} units
      </DialogTitle>
      <DialogContent>
        <Stack
          spacing={2}
          sx={{
            py: 2,
          }}
        >
          <TextField
            type="number"
            value={newPrice}
            label="Price Per Unit"
            onChange={(e) => setNewPrice(parseFloat(e.target.value))}
            disabled={!!orderProduct?.productInventoryId}
          />
          <TextField
            type="number"
            value={newQuantity}
            label="Quantity"
            onChange={(e) => setNewQuantity(parseFloat(e.target.value))}
            disabled={!!orderProduct?.productInventoryId}
            helperText={
              orderProduct?.productInventoryId
                ? "Inventory already updated for this product"
                : undefined
            }
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpen(false)} disabled={loading}>
          Cancel
        </Button>
        <Button
          variant="outlined"
          href={`../products/${orderProduct?.productId}`}
          disabled={loading}
        >
          View Product
        </Button>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={loading || !!orderProduct?.productInventoryId}
          startIcon={loading ? <CircularProgress size={16} /> : <Save />}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UpdateOrderProductDialog;
