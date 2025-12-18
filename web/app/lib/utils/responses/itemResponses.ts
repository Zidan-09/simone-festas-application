export enum ItemResponses {
  ITEM_CREATED = "item_created",
  ITEM_CREATED_ERROR = "item_created_error",

  ITEM_FOUND = "item_found",
  ITEM_NOT_FOUND = "item_not_found",
  ITEMS_FOUND = "items_found",
  ITEMS_NOT_FOUND = "items_not_found",

  ITEM_UPDATED = "item_updated",
  ITEM_UPDATED_ERROR = "item_updated_error",

  ITEM_DELETED = "item_deleted",
  ITEM_DELETED_ERROR = "item_deleted_error",

  ITEM_STOCK_AVAILABLE = "item_stock_available",
  ITEM_STOCK_UNAVAILABLE = "item_stock_unavailable",
  ITEM_STOCK_INSUFFICIENT = "item_stock_insufficient",
  ITEM_STOCK_UPDATED = "item_stock_updated",
  ITEM_STOCK_UPDATE_ERROR = "item_stock_update_error",

  ITEM_VARIANT_REQUIRED = "item_variant_required",
  ITEM_VARIANT_ALREADY_EXISTS = "item_variant_already_exists",
  ITEM_INVALID_TYPE = "item_invalid_type",
  ITEM_INVALID_PRICE = "item_invalid_price",

  ITEM_OPERATION_NOT_ALLOWED = "item_operation_not_allowed",
  ITEM_INTERNAL_ERROR = "item_internal_error"
}
