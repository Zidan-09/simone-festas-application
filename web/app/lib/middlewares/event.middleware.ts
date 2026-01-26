import { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { prisma } from "../prisma";
import type { EventItem } from "@prisma/client";
import { EventPayload } from "../utils/requests/event.request";
import { ItemResponses } from "../utils/responses/itemResponses";
import { ServerResponses } from "../utils/responses/serverResponses";
import { ServiceResponses } from "../utils/responses/serviceResponses.";
import config from "@/app/config-api.json";

export const EventMiddleware = {
  async validateCreateEvent(payload: EventPayload) {
    const { event, services, items } = payload;

    if (
      !event.address ||
      !event.date ||
      !event.total ||
      Number(event.total) <= 0 ||
      !event.paid ||
      Number(event.paid) <= 0 ||
      items.length <= 0
    ) throw {
      statusCode: 400,
      message: ServerResponses.INVALID_INPUT
    };

    if (services.length > 0) {
      for (const s of services) {
        const existsService = await prisma.service.findUnique({
          where: { id: s }
        });

        if (!existsService) {
          throw {
            statusCode: 404,
            message: ServiceResponses.SERVICE_NOT_FOUND
          };
        };
      };
    }

    for (const i of items) {
      const existsItem = await prisma.itemVariant.findUnique({
        where: { id: i.id }
      });

      if (!existsItem) throw {
        statusCode: 404,
        message: ItemResponses.ITEM_NOT_FOUND
      };

      const eventDate = new Date(event.date);
      const blockStart = new Date(eventDate);
      blockStart.setDate(blockStart.getDate() - config.item_block_days);

      const reservedItems: EventItem[] = await prisma.eventItem.findMany({
        where: {
          itemVariantId: i.id,
          returnedAt: null,
          event: {
            eventDate: {
              gte: blockStart,
              lte: eventDate
            },
          }
        }
      });

      const reservedQuantity = reservedItems.reduce(
        (sum, ei) => sum + ei.quantity,
        0
      );

      if (reservedQuantity + i.quantity > existsItem.quantity) {
        throw {
          statusCode: 400,
          message: ItemResponses.ITEM_STOCK_INSUFFICIENT
        };
      };
    };
  },
  
  async validateEditEvent(payload: EventPayload, token?: RequestCookie) {

  }
};