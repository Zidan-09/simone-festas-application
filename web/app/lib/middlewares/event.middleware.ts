import { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { prisma } from "../prisma";
import { EventStatus, type EventItem, type ItemVariant, type EventKitItem, EventTable } from "@prisma/client";
import { EventPayload, ItemInput, KitType } from "../utils/requests/event.request";
import { ItemResponses } from "../utils/responses/itemResponses";
import { ServerResponses } from "../utils/responses/serverResponses";
import { ServiceResponses } from "../utils/responses/serviceResponses.";
import { getTokenContent } from "../utils/user/getTokenContent";
import { UserResponses } from "../utils/responses/userResponses";
import { EventResponses } from "../utils/responses/event.responses";
import { AppError } from "../withError";
import { normalizeItems } from "../utils/event/normalizeItems";
import config from "@/app/config-api.json";
import { KitTypeEnum } from "../utils/event/kitType";

export const EventMiddleware = {
  async validateCreateEvent(payload: EventPayload) {
    const { event, service, eventType } = payload;

    if (
      !eventType ||
      !event.eventDate
    ) throw new AppError(400, ServerResponses.INVALID_INPUT);

    if (service) {
      const existsService = await prisma.service.findUnique({
        where: { id: service }
      });

      if (!existsService) throw new AppError(404, ServiceResponses.SERVICE_NOT_FOUND);
    }
  },

  async validateEventConfirm(eventId: string) {
    const event = await prisma.event.findUnique({
      where: { id: eventId }
    });

    if (!event) throw new AppError(404, EventResponses.EVENT_NOT_FOUND);

    if (event.status !== EventStatus.PENDING) throw new AppError(400, EventResponses.EVENT_OPERATION_NOT_ALLOWED);
  },

  async validateAssembleEventKit(eventId: string, items: ItemInput[]) {
    if (
      !eventId ||
      items.length === 0
    ) throw new AppError(400, ServerResponses.INVALID_INPUT);

    const event = await prisma.event.findUnique({
      where: { id: eventId }
    });

    if (!event) throw new AppError(404, EventResponses.EVENT_NOT_FOUND);

    if (event.reserveType !== "KIT") throw new AppError(400, ServerResponses.INVALID_INPUT);

    if (items.some(i => !i.quantity || i.quantity <= 0)) throw new AppError(400, ServerResponses.INVALID_INPUT);

    const uniqueIds = new Set(items.map(i => i.id));

    if (uniqueIds.size !== items.length) throw new AppError(400, ServerResponses.INVALID_INPUT);
  
    const itemsOnDb = await prisma.itemVariant.count({
      where: {
        id: { in: [...uniqueIds] }
      }
    });

    if (itemsOnDb !== uniqueIds.size) throw new AppError(400, ServerResponses.INVALID_INPUT);
  },
  
  async validateEditEvent(payload: EventPayload, token: RequestCookie) {
    const ownerId = getTokenContent(token.value);
    const { event, service } = payload;

    if (
      !event.address ||
      !event.eventDate ||
      !event.totalPaid ||
      event.totalPaid <= 0
    ) throw new AppError(400, ServerResponses.INVALID_INPUT);

    if (service) {
      const existsService = await prisma.service.findUnique({
        where: { id: service }
      });

      if (!existsService) throw new AppError(404, ServiceResponses.SERVICE_NOT_FOUND);
    }

    if (!event.id) throw new AppError(400, ServerResponses.INVALID_INPUT);

    if (event.ownerId !== ownerId) throw new AppError(400, UserResponses.USER_OPERATION_NOT_ALLOWED);
  },

  async validateItemReserve(items: ItemInput[], eventISODate: string) {
    if (
      items.length <= 0 ||
      !eventISODate
    ) throw new AppError(400, ServerResponses.INVALID_INPUT);

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

      if (reservedQuantity + (i.quantity ?? 1) > existsItem.quantity) {
        throw new AppError(400, ItemResponses.ITEM_STOCK_INSUFFICIENT);
      };
    };
  },

  async validateKitReserve(kitType: KitType, tables: string, theme: string, eventISODate: string) {
    if (
      !tables ||
      !theme ||
      !eventISODate ||
      !kitType
    ) throw new AppError(400, ServerResponses.INVALID_INPUT);

    const table = await prisma.itemVariant.findUnique({
      where: {
        id: tables
      },
      include: {
        item: true
      }
    });

    if (!table) throw new AppError(404, ItemResponses.ITEM_NOT_FOUND);

    if (!Object.values(KitTypeEnum).includes(kitType as KitTypeEnum)) throw new AppError(400, ServerResponses.INVALID_INPUT);

    const eventDate = new Date(eventISODate);
    const blockStart = new Date(eventDate);
    blockStart.setDate(blockStart.getDate() - config.item_block_days);

    const existingKit = await prisma.eventKit.findFirst({
      where: {
        themeId: theme,
        event: {
          status: {
            not: EventStatus.CANCELED
          },
          eventDate: {
            gte: blockStart,
            lte: eventDate
          }
        }
      }
    });

    if (existingKit) throw new AppError(400, ItemResponses.ITEM_STOCK_UNAVAILABLE);
  },

  async validateTableReserve(colorTone: string, numberOfPeople: number) {
    if (
      !colorTone ||
      numberOfPeople < 10 ||
      numberOfPeople > 80
    ) throw new AppError(400, ServerResponses.INVALID_INPUT);

    const color = await prisma.itemVariant.findUnique({
      where: { id: colorTone }
    });

    if (!color) throw new AppError(404, ItemResponses.ITEM_NOT_FOUND);
  },

  async validateStockAvailability(itemList: ItemInput[], eventISODate: string) {
    const demand = itemList.map(normalizeItems);

    const eventDate = new Date(eventISODate);
    const blockStart = new Date(eventDate);
    blockStart.setDate(blockStart.getDate() - config.item_block_days);

    
  }
};