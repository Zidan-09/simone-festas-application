export enum UserResponses {
  USER_CREATED = "user_created",
  USER_CREATED_ERROR = "user_created_error",
  USER_ALREADY_EXISTS = "user_already_exists",

  USER_FOUND = "user_found",
  USER_NOT_FOUND = "user_not_found",
  USERS_FOUND = "users_found",
  USERS_NOT_FOUND = "users_not_found",

  USER_UPDATED = "user_updated",
  USER_UPDATED_ERROR = "user_updated_error",

  USER_DELETED = "user_deleted",
  USER_DELETED_ERROR = "user_deleted_error",

  USER_LOGIN_SUCCESS = "user_login_success",
  USER_LOGIN_ERROR = "user_login_error",
  USER_INVALID_CREDENTIALS = "user_invalid_credentials",

  USER_UNAUTHORIZED = "user_unauthorized",
  USER_FORBIDDEN = "user_forbidden",

  USER_INVALID_EMAIL = "user_invalid_email",
  USER_INVALID_PASSWORD = "user_invalid_password",
  USER_PASSWORD_TOO_WEAK = "user_password_too_weak",

  USER_TOKEN_INVALID = "user_token_invalid",
  USER_TOKEN_EXPIRED = "user_token_expired",

  USER_OPERATION_NOT_ALLOWED = "user_operation_not_allowed",
  USER_INTERNAL_ERROR = "user_internal_error"
}
