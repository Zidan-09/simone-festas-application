import { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { EventService } from "../services/event.service";
import { EventPayload } from "../utils/requests/event.request";
import { EventResponses } from "../utils/responses/event.responses";
import { ApiResponse } from "../utils/server/apiResponse";

export const EventController = {
  async create(payload: EventPayload, token: RequestCookie) {
    const result = await EventService.create(payload, token);

    return ApiResponse.success(result, EventResponses.EVENT_CREATED, 201);
  },

  async get(id: string) {
    const result = await EventService.get(id);

    return ApiResponse.success(result, EventResponses.EVENT_FOUND);
  },

  async getMine(token: RequestCookie) {
    const result = await EventService.getMine(token);

    return ApiResponse.success(result, EventResponses.EVENTS_FOUND);
  },

  async getAll() {
    const result = await EventService.getAll();

    return ApiResponse.success(result, EventResponses.EVENTS_FOUND);
  },

  async edit(payload: EventPayload) {
    const result = await EventService.edit(payload);

    return ApiResponse.success(result, EventResponses.EVENT_UPDATED);
  },

  async delete(id: string) {
    const result = await EventService.delete(id);

    return ApiResponse.success(result, EventResponses.EVENT_DELETED);
  }
};