import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { FC, useState } from "react";
import { Product, ProductListingStatus } from "../../api/product/getProducts";
import { adminUpdateProduct } from "../../api/product/updateProduct";
import { toast } from "../../utils/toast";

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  product?: Product;
  onSuccess?: (newStatus: ProductListingStatus) => void;
};

const AdminApproveDialog: FC<Props> = ({
  open,
  setOpen,
  product,
  onSuccess,
}) => {
  const [status, setStatus] = useState<ProductListingStatus>("ACTIVE");
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    try {
      if (!product) return;

      setLoading(true);

      if (product?.status !== status) {
        await adminUpdateProduct({ status }, product.id);
      }

      toast({
        message: "Product updated successfully",
        severity: "success",
      });
      onSuccess?.(status);
      setOpen(false);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };
  return (
    <Dialog open={open} onClose={() => setOpen(false)} maxWidth="xs" fullWidth>
      <DialogTitle> {product?.name} </DialogTitle>
      <DialogContent>
        <FormControl fullWidth>
          <InputLabel id="pstats">Product Status</InputLabel>
          <Select
            value={status}
            onChange={(e) => setStatus(e.target.value as ProductListingStatus)}
            label="Product Status"
            labelId="pstats"
          >
            <MenuItem value="ACTIVE">Active</MenuItem>
            <MenuItem value="PENDING_APPROVAL">Pending Approval</MenuItem>
          </Select>
        </FormControl>
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

export default AdminApproveDialog;
