import { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { prisma } from "../prisma";
import { EventStatus, type EventItem, type ItemVariant } from "@prisma/client";
import { EventPayload } from "../utils/requests/event.request";
import { ItemResponses } from "../utils/responses/itemResponses";
import { ServerResponses } from "../utils/responses/serverResponses";
import { ServiceResponses } from "../utils/responses/serviceResponses.";
import config from "@/app/config-api.json";
import { getTokenContent } from "../utils/user/getTokenContent";
import { UserResponses } from "../utils/responses/userResponses";
import { EventResponses } from "../utils/responses/event.responses";

export const EventMiddleware = {
  async validateCreateEvent(payload: EventPayload) {
    const { event, services, items } = payload;

    if (
      !event.address ||
      !event.eventDate ||
      !event.totalPrice ||
      Number(event.totalPrice) <= 0 ||
      !event.totalPaid ||
      Number(event.totalPaid) <= 0 ||
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
  },

  async validateEventConfirm(eventId: string) {
    const event = await prisma.event.findUnique({
      where: { id: eventId }
    });

    if (!event) throw {
      statusCode: 404,
      message: EventResponses.EVENT_NOT_FOUND
    }

    if (event.status !== EventStatus.PENDING) throw {
      statusCode: 400,
      message: EventResponses.EVENT_OPERATION_NOT_ALLOWED
    }
  },
  
  async validateEditEvent(payload: EventPayload, token: RequestCookie) {
    const ownerId = getTokenContent(token.value);
    const { event, items, services } = payload;

    if (
      !event.address ||
      !event.eventDate ||
      !event.totalPrice ||
      Number(event.totalPrice) <= 0 ||
      !event.totalPaid ||
      Number(event.totalPaid) <= 0 ||
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

    if (!event.id) throw {
      statusCode: 400,
      message: ServerResponses.INVALID_INPUT
    }

    if (event.ownerId !== ownerId) throw {
      statusCode: 400,
      message: UserResponses.USER_OPERATION_NOT_ALLOWED
    }
  },

  async validateItemDate(items: ItemVariant[], eventISODate: Date) {
    for (const i of items) {
      const existsItem = await prisma.itemVariant.findUnique({
        where: { id: i.id }
      });

      if (!existsItem) throw {
        statusCode: 404,
        message: ItemResponses.ITEM_NOT_FOUND
      };

      const eventDate = new Date(eventISODate);
      const blockStart = new Date(eventDate);
      blockStart.setDate(blockStart.getDate() - config.item_block_days);

      const reservedItems: EventItem[] = await prisma.eventItem.findMany({
        where: {
          itemVariantId: i.id,
          returnedAt: null,
          event: {
            status: {
              not: EventStatus.CANCELED
            },
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
  }
};