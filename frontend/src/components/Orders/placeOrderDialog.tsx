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
import { Dispatch, FC, SetStateAction, useContext, useState } from "react";
import { Product } from "../../api/product/getProducts";
import { placeOrder } from "../../api/order/placeOrder";
import { toast } from "../../utils/toast";
import { CartContext } from "../../context/CartContext";
import { useNavigate } from "react-router-dom";

type Props = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  product?: Product;
  isAddToCart?: boolean;
};
const PlaceOrderDialog: FC<Props> = ({
  open,
  setOpen,
  product,
  isAddToCart,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const { addToCart } = useContext(CartContext);

  const navigate = useNavigate();

  const handlePlaceOrder = async () => {
    try {
      if (!product) {
        return;
      }
      setLoading(true);
      const order = await placeOrder({
        storeId: product?.storeId,
        orderProducts: [
          {
            productId: product.id,
            quantity,
          },
        ],
      });

      navigate(`/thankyou?orderId=${order.id}`);
      setOpen(false);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, quantity);

    setOpen(false);
    toast({
      message: "Product added to cart",
      severity: "success",
      action: (
        <Button size="small" color="success" href="/cart">
          View Cart
        </Button>
      ),
    });
  };
  return (
    <Dialog open={open} onClose={() => {}} maxWidth="xs" fullWidth>
      <DialogTitle>{isAddToCart ? "Add to Cart" : "Place Order"}</DialogTitle>
      <DialogContent>
        <Stack spacing={2}>
          <p>Product: {product?.name}</p>
          <p>Price: {product?.price}</p>
          <TextField
            label="Quantity"
            value={quantity}
            onChange={(e) => {
              setQuantity(parseInt(e.target.value));
            }}
            type="number"
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            setOpen(false);
          }}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button
          onClick={() => {
            if (isAddToCart) {
              handleAddToCart();
            } else {
              handlePlaceOrder();
            }
          }}
          color="primary"
          variant="contained"
          disabled={loading}
          startIcon={loading && <CircularProgress size={16} />}
        >
          {isAddToCart ? "Add to Cart" : "Place Order"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PlaceOrderDialog;
