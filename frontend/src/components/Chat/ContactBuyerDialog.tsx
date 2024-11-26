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
import { Dispatch, FC, SetStateAction, useState } from "react";
import { createChat } from "../../api/chats/createChat";
import { useNavigate, useParams } from "react-router-dom";

type Props = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  buyerId: number;
};

const ContactBuyerDialog: FC<Props> = ({ open, setOpen, buyerId }) => {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { id } = useParams();

  const navigate = useNavigate();

  const handleSend = async () => {
    if (!message.trim()) return;
    setLoading(true);
    try {
      await createChat({ buyerId, message: message.trim() });
      setOpen(false);
      navigate(`/seller/stores/${id}/messages`);
    } catch (error) {
      console.error("Failed to send message:", error);
    }
    setLoading(false);
  };

  return (
    <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="xs">
      <DialogTitle>Contact Buyer</DialogTitle>
      <DialogContent>
        <Stack sx={{ py: 2 }}>
          <TextField
            label="Message"
            multiline
            placeholder="Enter your message here"
            maxRows={4}
            helperText="Enter your message to the buyer"
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
          onClick={handleSend}
        >
          Send
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ContactBuyerDialog;
