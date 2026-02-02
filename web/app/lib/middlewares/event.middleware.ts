import { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { prisma } from "../prisma";
import { EventStatus, type EventItem, type ItemVariant } from "@prisma/client";
import { EventPayload, KitType } from "../utils/requests/event.request";
import { ItemResponses } from "../utils/responses/itemResponses";
import { ServerResponses } from "../utils/responses/serverResponses";
import { ServiceResponses } from "../utils/responses/serviceResponses.";
import { getTokenContent } from "../utils/user/getTokenContent";
import { UserResponses } from "../utils/responses/userResponses";
import { EventResponses } from "../utils/responses/event.responses";
import { ReserveType } from "../utils/requests/event.request";
import config from "@/app/config-api.json";
import { AppError } from "../withError";

export const EventMiddleware = {
  async validateCreateEvent(payload: EventPayload, reserveType?: ReserveType) {
    const { event, services } = payload;

    if (
      !reserveType ||
      !event.address ||
      !event.eventDate ||
      !event.totalPrice ||
      Number(event.totalPrice) <= 0 ||
      !event.totalPaid ||
      Number(event.totalPaid) <= 0
    ) throw new AppError(400, ServerResponses.INVALID_INPUT);

    if (services.length > 0) {
      for (const s of services) {
        const existsService = await prisma.service.findUnique({
          where: { id: s }
        });

        if (!existsService) throw new AppError(404, ServiceResponses.SERVICE_NOT_FOUND);
      };
    }
  },

  async validateEventConfirm(eventId: string) {
    const event = await prisma.event.findUnique({
      where: { id: eventId }
    });

    if (!event) throw new AppError(404, EventResponses.EVENT_NOT_FOUND);

    if (event.status !== EventStatus.PENDING) throw new AppError(400, EventResponses.EVENT_OPERATION_NOT_ALLOWED);
  },
  
  async validateEditEvent(payload: EventPayload, token: RequestCookie) {
    const ownerId = getTokenContent(token.value);
    const { event, services } = payload;

    if (
      !event.address ||
      !event.eventDate ||
      !event.totalPrice ||
      Number(event.totalPrice) <= 0 ||
      !event.totalPaid ||
      Number(event.totalPaid) <= 0
    ) throw new AppError(400, ServerResponses.INVALID_INPUT);

    if (services.length > 0) {
      for (const s of services) {
        const existsService = await prisma.service.findUnique({
          where: { id: s }
        });

        if (!existsService) throw new AppError(404, ServiceResponses.SERVICE_NOT_FOUND);
      };
    }

    if (!event.id) throw new AppError(400, ServerResponses.INVALID_INPUT);

    if (event.ownerId !== ownerId) throw new AppError(400, UserResponses.USER_OPERATION_NOT_ALLOWED);
  },

  async validateItemReserve(items: ItemVariant[], eventISODate: Date) {
    for (const i of items) {
      const existsItem = await prisma.itemVariant.findUnique({
        where: { id: i.id }
      });

      if (!existsItem) throw new AppError(404, ItemResponses.ITEM_NOT_FOUND);

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
        throw new AppError(400, ItemResponses.ITEM_STOCK_INSUFFICIENT);
      };
    };
  },

  async validateKitReserve(kitType: KitType, tables: string, theme: string, eventISODate: Date) {
    console.log(kitType, tables, theme, eventISODate);
  },

  async validateTableReserve(colorTone: string, numberOfPeople: number) {
    console.log(colorTone, numberOfPeople);
  }
};