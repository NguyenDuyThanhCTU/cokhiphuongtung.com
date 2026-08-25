export type ID = string;
export type ISODateString = string;
export type UrlString = string;

export type PublishStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

export type ActiveModule =
  | "CATALOG"
  | "LEAD_ORDER"
  | "CART_CHECKOUT"
  | "PAYMENT"
  | "INVENTORY_VARIANTS"
  | "BOOKING"
  | "SHIPPING"
  | "CUSTOMER_ACCOUNT"
  | "PROMOTION";

export type VerticalExtension =
  | "TOUR_EXTENSION"
  | "FNB_EXTENSION"
  | "LOGISTICS_EXTENSION"
  | "REAL_ESTATE_EXTENSION"
  | "COURSE_EXTENSION"
  | "HOTEL_EXTENSION";
