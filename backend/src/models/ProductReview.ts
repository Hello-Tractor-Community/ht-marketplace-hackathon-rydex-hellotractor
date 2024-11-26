import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  AfterCreate,
} from "sequelize-typescript";
import Product from "./Product";
import { Order } from "./Order";

@Table({
  timestamps: true,
  tableName: "product_reviews",
})
export class ProductReview extends Model {
  @ForeignKey(() => Product)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  productId!: number;

  @BelongsTo(() => Product)
  product!: Product;

  @ForeignKey(() => Order)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  orderId!: number;

  @BelongsTo(() => Order)
  order!: Order;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  rating!: number;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  comment?: string;

  @AfterCreate
  static async updateProductRatingAndReviewCount(review: ProductReview) {
    try {
      const product = await Product.findByPk(review.productId);
      if (product) {
        const reviews = await ProductReview.findAll({
          where: { productId: review.productId },
        });
        const reviewCount = reviews.length;
        const rating =
          reviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount;
        product.reviewCount = reviewCount;
        product.rating = rating;
        await product.save();

        const store = await product.$get("store");
        if (store) {
          const storeReviews = await ProductReview.findAll({
            include: [
              {
                model: Product,
                where: { storeId: store.id },
              },
            ],
          });
          const storeReviewCount = storeReviews.length;
          const storeRating =
            storeReviews.reduce((sum, r) => sum + r.rating, 0) /
            storeReviewCount;
          store.reviewCount = storeReviewCount;
          store.rating = storeRating;
          await store.save();
        }
      }
    } catch (error) {
      console.log("Error updating product rating and review count", error);
    }
  }
}
