import { SellerReviewListEntity } from "./seller-review.types";

export const mapSellerReviewListItem = (review: SellerReviewListEntity) => ({
  reviewId: review._id.toString(),

  buyer: {
    name: review.buyer.fullName,
  },

  rating: review.rating,

  comment: review.comment ?? null,

  createdAt: review.createdAt,
});
