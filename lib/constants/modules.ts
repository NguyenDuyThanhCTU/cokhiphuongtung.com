import type { ActiveModule } from "@/lib/types/shared";

export const modules = {
  catalog: "CATALOG",
  leadOrder: "LEAD_ORDER",
  cartCheckout: "CART_CHECKOUT",
  payment: "PAYMENT",
  inventoryVariants: "INVENTORY_VARIANTS",
  booking: "BOOKING",
  shipping: "SHIPPING",
  customerAccount: "CUSTOMER_ACCOUNT",
  promotion: "PROMOTION",
} as const satisfies Record<string, ActiveModule>;
