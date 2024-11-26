import apiClient from "../../../utils/apiClient";

export const reviewOrder = async (
  orderId: number,
  productId: number,
  rating: number,
  comment: string
) => {
  const { data } = await apiClient.post("/buyer/order/" + orderId + "/review", {
    productId,
    rating,
    comment,
  });
  return data;
};
