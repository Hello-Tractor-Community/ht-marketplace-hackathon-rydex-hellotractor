import { FC, useEffect, useMemo, useState } from "react";
import PageContainer from "../../../components/PageContainer/PageContainer";
import TableCard from "../../../components/CoolTable/TableCard";
import { useParams } from "react-router-dom";

import { getStores, Store } from "../../../api/stores/getStores";

const AdminStoresPage: FC = () => {
  const [stores, setStores] = useState<Store[]>([]);

  const { id } = useParams();

  useEffect(() => {
    getStores({ sort: "id" })
      .then(({ stores }) => setStores(stores))
      .catch(console.error);
  }, [id]);

  const tableData = useMemo(
    () =>
      stores.map((store) => ({
        id: store.id,
        name: store.name,
        location: store.location?.address,
        phone: store.phone,
        email: store.email,
      })),
    [stores]
  );

  //   const navigate = useNavigate();

  return (
    <PageContainer title="Stores">
      <TableCard rows={tableData} title="Stores" />
    </PageContainer>
  );
};

export default AdminStoresPage;
