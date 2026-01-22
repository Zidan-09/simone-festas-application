export enum EventResponses {
  EVENT_CREATED = "event_created",
  EVENT_CREATED_ERROR = "event_created_error",
  EVENT_ALREADY_EXISTS = "event_already_exists",

  EVENT_FOUND = "event_found",
  EVENT_NOT_FOUND = "event_not_found",
  EVENTS_FOUND = "events_found",
  EVENTS_NOT_FOUND = "events_not_found",

  EVENT_UPDATED = "event_updated",
  EVENT_UPDATED_ERROR = "event_updated_error",

  EVENT_DELETED = "event_deleted",
  EVENT_DELETED_ERROR = "event_deleted_error",

  EVENT_OPERATION_NOT_ALLOWED = "event_operation_not_allowed",
  EVENT_INTERNAL_ERROR = "event_internal_error"
}