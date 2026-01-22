import { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { prisma } from "../prisma";
import { EventPayload } from "../utils/requests/event.request";
import { ItemResponses } from "../utils/responses/itemResponses";
import { ServerResponses } from "../utils/responses/serverResponses";
import { ServiceResponses } from "../utils/responses/serviceResponses.";
import { UserResponses } from "../utils/responses/userResponses";
import { getTokenContent } from "../utils/user/getTokenContent";
import config from "@/app/config-api.json";

export const EventMiddleware = {
  async validateCreateEvent(payload: EventPayload, token?: RequestCookie) {
    if (!token) throw {
      statusCode: 403,
      message: UserResponses.USER_OPERATION_NOT_ALLOWED
    };

    const ownerId = getTokenContent(token.value);

    const user = await prisma.user.findUnique({
      where: { id: ownerId }
    });

    if (!user) throw {
      statusCode: 404,
      message: UserResponses.USER_NOT_FOUND
    };

    const { event, service, item } = payload;

    if (
      !event.address ||
      !event.date ||
      !event.total ||
      !event.total.isPositive() ||
      !event.paid ||
      !event.paid.isPositive()
    ) throw {
      statusCode: 400,
      message: ServerResponses.INVALID_INPUT
    };

    for (const s of service) {
      const existsService = await prisma.service.findUnique({
        where: { id: s.id }
      });

      if (!existsService) {
        throw {
          statusCode: 400,
          message: ServiceResponses.SERVICE_NOT_FOUND
        };
      };
    };

    for (const i of item) {
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

      const reservedItems = await prisma.eventItem.findMany({
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
  }
};