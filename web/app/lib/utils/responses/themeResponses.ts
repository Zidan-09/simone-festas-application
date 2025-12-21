export enum ThemeResponses {
  THEME_CREATED = "theme_created",
  THEME_CREATED_ERROR = "theme_created_error",
  THEME_ALREADY_EXISTS = "theme_already_exists",

  THEME_FOUND = "theme_found",
  THEME_NOT_FOUND = "theme_not_found",
  THEMES_FOUND = "themes_found",
  THEMES_NOT_FOUND = "themes_not_found",

  THEME_UPDATED = "theme_updated",
  THEME_UPDATED_ERROR = "theme_updated_error",

  THEME_DELETED = "theme_deleted",
  THEME_DELETED_ERROR = "theme_deleted_error",

  THEME_IMAGE_ADDED = "theme_image_added",
  THEME_IMAGE_REMOVED = "theme_image_removed",
  THEME_IMAGE_ERROR = "theme_image_error",

  THEME_ITEM_ADDED = "theme_item_added",
  THEME_ITEM_REMOVED = "theme_item_removed",
  THEME_ITEM_ALREADY_EXISTS = "theme_item_already_exists",
  THEME_ITEM_REQUIRED = "theme_item_required",

  THEME_INVALID_NAME = "theme_invalid_name",
  THEME_INVALID_IMAGE = "theme_invalid_image",
  THEME_INVALID_TYPE = "theme_invalid_type",

  THEME_OPERATION_NOT_ALLOWED = "theme_operation_not_allowed",
  THEME_INTERNAL_ERROR = "theme_internal_error"
}