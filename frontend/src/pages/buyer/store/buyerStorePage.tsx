import { Box } from "@mui/material";
import BuyerStoreHeader from "../../../components/Stores/buyerStoreHeader";
import BuyerStoreServices from "../../../components/Stores/buyerStoreServices";
import BuyerStoreLocation from "../../../components/Stores/buyerStoreLocation";
import { useEffect, useState } from "react";
import { getStore, Store } from "../../../api/stores/getStores";
import { useParams } from "react-router-dom";

export default function BuyerStorePage() {
  const [store, setStore] = useState<Store>();
  const { storeId } = useParams<{ storeId: string }>();

  useEffect(() => {
    if (!storeId) return;
    getStore(storeId).then(setStore).catch(console.error);
  }, [storeId]);

  return (
    <Box>
      {store ? (
        <>
          <BuyerStoreHeader store={store} />
          <BuyerStoreServices store={store} />
          <BuyerStoreLocation store={store} />
          {/* <BuyerStoreProducts /> */}
        </>
      ) : (
        <Box>Loading...</Box>
      )}
    </Box>
  );
}
