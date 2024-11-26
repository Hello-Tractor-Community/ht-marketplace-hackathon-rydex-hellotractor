import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
} from "@mui/material";
import { Dispatch, FC, SetStateAction, useState } from "react";
import { Order } from "../../api/order/placeOrder";
import { Form } from "@rjsf/mui";
import { RJSFSchema } from "@rjsf/utils";
import validator from "@rjsf/validator-ajv8";
import { useParams } from "react-router-dom";
import { updateStoreOrder } from "../../api/order/seller/updateOrder";
import { toast } from "../../utils/toast";

type Props = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  order?: Order;
  schema: RJSFSchema;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSuccess?: (formData: any) => void;
};

const StoreUpdateOrderDialog: FC<Props> = ({
  open,
  setOpen,
  order,
  schema,
  onSuccess,
}) => {
  const [loading, setLoading] = useState(false);
  const { id } = useParams<{
    id: string;
  }>();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSubmit = async (formData: any) => {
    try {
      if (!order || !id || !order.id) return;
      setLoading(true);
      await updateStoreOrder(formData, id, order.id);
      toast({
        message: "Order updated successfully",
        severity: "success",
      });
      onSuccess?.(formData);
      setOpen(false);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  return (
    <Dialog open={open} onClose={() => {}} maxWidth="sm" fullWidth>
      <DialogTitle>Update Order</DialogTitle>
      <DialogContent>
        <Stack sx={{ py: 2 }}>
          <Form
            formData={order}
            schema={schema}
            //   uiSchema={createProductUISchema}
            validator={validator}
            onSubmit={(data) => {
              console.log(" product dialog form submitted", data);
              handleSubmit(data.formData);
            }}
            disabled={loading}
            // fields={fields}
            // widgets={widgets}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpen(false)}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
};

export default StoreUpdateOrderDialog;
