import { FC, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Rating,
  CircularProgress,
} from "@mui/material";
import { Order } from "../../api/order/placeOrder";
import { reviewOrder } from "../../api/order/buyer/reviewOrder";
import { toast } from "../../utils/toast";

type OrderDialogProps = {
  order?: Order;
  open: boolean;
  setOpen: (open: boolean) => void;
  onSuccess: (feedback: {
    productId: number;
    rating: number;
    comment?: string;
  }) => void;
};

const ReviewDialog: FC<OrderDialogProps> = ({
  order,
  open,
  setOpen,
  onSuccess,
}) => {
  const [selectedProduct, setSelectedProduct] = useState<number | null>(null);
  const [rating, setRating] = useState<number | null>(null);
  const [comment, setComment] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      if (selectedProduct && rating && order) {
        setLoading(true);
        await reviewOrder(order.id, selectedProduct, rating, comment);
        onSuccess({ productId: selectedProduct, rating, comment });
        setOpen(false);
        toast({
          severity: "success",
          message: "Feedback submitted successfully",
        });
      }
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  return (
    <Dialog open={open} onClose={() => setOpen(false)}>
      <DialogTitle>Provide Feedback</DialogTitle>
      <DialogContent>
        <FormControl fullWidth margin="normal">
          <InputLabel id="select-product">Select Product</InputLabel>
          <Select
            label="Select Product"
            labelId="select-product"
            value={selectedProduct}
            onChange={(e) => setSelectedProduct(e.target.value as number)}
          >
            {order?.orderProducts.map((orderProduct) => (
              <MenuItem
                key={orderProduct.productId}
                value={orderProduct.productId}
              >
                {orderProduct.product?.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth margin="normal">
          <Rating
            value={rating}
            onChange={(_, newValue) => setRating(newValue)}
          />
        </FormControl>
        <TextField
          label="Comment"
          fullWidth
          multiline
          rows={4}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          margin="normal"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpen(false)}>Cancel</Button>
        <Button
          onClick={handleSubmit}
          disabled={!selectedProduct || !rating || loading}
          startIcon={loading && <CircularProgress size={16} />}
          variant="contained"
        >
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ReviewDialog;
