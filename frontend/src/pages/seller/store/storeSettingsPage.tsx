import {
  Card,
  CardContent,
  CircularProgress,
  Fade,
  Stack,
  Typography,
} from "@mui/material";
import PageContainer from "../../../components/PageContainer/PageContainer";
import { useEffect, useMemo, useState } from "react";
import { getStore, Store } from "../../../api/stores/getStores";
import { useParams } from "react-router-dom";
import { Form } from "@rjsf/mui";
import {
  createStoreSchema,
  updateStore,
} from "../../../api/stores/createStore";
import validator from "@rjsf/validator-ajv8";
import widgets from "../../../components/Widgets";

const StoreSettingsPage = () => {
  const [store, setStore] = useState<Store>();
  const [loading, setLoading] = useState(false);
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      getStore(id).then(setStore).catch(console.error);
    }
  }, [id]);

  const handleSubmit = async (data: object) => {
    try {
      if (!id) return;
      setLoading(true);
      await updateStore(id, data);
      window.location.reload();
    } catch (error) {
      console.log("error updating store", error);
    }
    setLoading(false);
  };

  const defaultData = useMemo(() => {
    if (store) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id, createdAt, updatedAt, ...rest } = store;
      return rest;
    }
  }, [store]);

  return (
    <PageContainer title="Store settings">
      <Card
        sx={{
          height: "100%",
        }}
      >
        <CardContent
          sx={{
            height: "100%",
            overflow: "auto",
          }}
        >
          {loading ? (
            <Stack
              spacing={2}
              sx={{
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <CircularProgress />

              <Typography variant="h6">Loading...</Typography>
            </Stack>
          ) : (
            <Fade in>
              <Stack>
                <Form
                  schema={createStoreSchema}
                  // uiSchema={{
                  //   "ui:submitButtonOptions": {
                  //     submitText: "Next",
                  //   },
                  // }}
                  validator={validator}
                  onSubmit={(data) => {
                    console.log("create store dialog form submitted", data);
                    handleSubmit(data.formData);
                  }}
                  formData={defaultData}
                  widgets={widgets}
                />
              </Stack>
            </Fade>
          )}
        </CardContent>
      </Card>
    </PageContainer>
  );
};

export default StoreSettingsPage;
