import { FC, useEffect, useMemo, useState } from "react";
import PageContainer from "../../../components/PageContainer/PageContainer";
import TableCard from "../../../components/CoolTable/TableCard";
import { Order } from "../../../api/order/placeOrder";
import { getAdminOrders } from "../../../api/order/seller/getStoreOrders";
import dayjs from "dayjs";

const AdminOrdersPage: FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    getAdminOrders({ include: "buyer.user", sort: "-createdAt" })
      .then(setOrders)
      .catch(console.error);
  }, []);

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

  return (
    <PageContainer title="Orders">
      <TableCard rows={tableData} title="Orders" />
    </PageContainer>
  );
};

export default AdminOrdersPage;
