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
import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";
import { Product } from "../../api/product/getProducts";
import { initiateChat } from "../../api/chats/getChats";
import { useNavigate } from "react-router-dom";
import { Send } from "lucide-react";

type Props = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  product?: Product;
  storeId?: number;
};
const ContactSellerDialog: FC<Props> = ({
  open,
  setOpen,
  product,
  storeId,
}) => {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (product) {
      setMessage(`Hi, I am interested in ${product?.name}.`);
    }
  }, [product]);

  const navigate = useNavigate();

  const handleSend = async () => {
    try {
      const s = storeId || product?.storeId;
      if (!message.trim() || !s) {
        console.log("Invalid message or storeId", message, product?.storeId);
        return;
      }
      setLoading(true);
      await initiateChat(s, message.trim());
      setOpen(false);
      navigate("/messages");
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  return (
    <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="xs">
      <DialogTitle>
        {product ? <>Ask about {product?.name}</> : <>Contact Seller</>}
      </DialogTitle>
      <DialogContent>
        <Stack sx={{ py: 2 }}>
          <TextField
            label="Message"
            multiline
            placeholder="Enter your message here"
            maxRows={4}
            helperText="Ask any questions or provide additional information"
            rows={2}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpen(false)} disabled={loading}>
          Cancel
        </Button>
        <Button
          variant="contained"
          color="primary"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : undefined}
          endIcon={<Send />}
          onClick={handleSend}
        >
          Send
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ContactSellerDialog;
