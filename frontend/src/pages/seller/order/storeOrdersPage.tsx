import { FC, useEffect, useMemo, useState } from "react";
import PageContainer from "../../../components/PageContainer/PageContainer";
import TableCard from "../../../components/CoolTable/TableCard";
import { Order } from "../../../api/order/placeOrder";
import { useNavigate, useParams } from "react-router-dom";
import { getStoreOrders } from "../../../api/order/seller/getStoreOrders";
import dayjs from "dayjs";

const StoreOrdersPage: FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);

  const { id } = useParams();

  useEffect(() => {
    if (!id) return;
    getStoreOrders(id, { include: "buyer.user", sort: "-createdAt" })
      .then(setOrders)
      .catch(console.error);
  }, [id]);

  const tableData = useMemo(
    () =>
      orders.map((order) => ({
        id: order.id,
        buyer: order.buyer?.user?.name,
        total: order.priceTotal,
        status: order.status,
        createdAt: dayjs(order.createdAt).format("DD/MM/YYYY hh:mm a"),
      })),
    [orders]
  );

  const navigate = useNavigate();

  return (
    <PageContainer title="Orders">
      <TableCard
        rows={tableData}
        title="Orders"
        onRecordClick={(record) => {
          navigate(`/seller/stores/${id}/orders/${record.id}`);
        }}
      />
    </PageContainer>
  );
};

export default StoreOrdersPage;