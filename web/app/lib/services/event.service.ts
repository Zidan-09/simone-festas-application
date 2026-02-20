import { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { prisma } from "../prisma";
import { EventPayload } from "../utils/requests/event.request";
import { EventResponses } from "../utils/responses/event.responses";
import { ServerResponses } from "../utils/responses/serverResponses";
import { getTokenContent } from "../utils/user/getTokenContent";
import { formatEvent } from "../utils/event/formatEvent";
import { EventStatus } from "@prisma/client";
import { UserResponses } from "../utils/responses/userResponses";
import { getTotal } from "../utils/event/getTotal";
import { AppError } from "../withError";
import { reserve } from "../utils/event/reserve";

export const EventService = {
  async create(payload: EventPayload, token: RequestCookie) {
    try {
      const { event, service } = payload;
      const ownerId = getTokenContent(token.value);

      return await prisma.$transaction(async (tx) => {
        const user = await tx.user.findUnique({
          where: { id: ownerId }
        });

        if (!user) throw new AppError(404, UserResponses.USER_NOT_FOUND);

        const total = payload.eventType === "ITEMS" ? await getTotal(tx, payload.items, service) : event.totalPrice;

        const eventOnDB = await tx.event.create({
          data: {
            ownerId,
            serviceId: service,
            eventDate: event.eventDate,
            reserveType: payload.eventType,
            status: EventStatus.PENDING,
            address: event.address ? JSON.stringify(event.address) : JSON.stringify(user.address),
            totalPaid: 0,
            totalPrice: total
          }
        });

        const reserveOnDB = await reserve(tx, payload, eventOnDB.id);

        return {
          eventOnDB,
          reserveOnDB
        };
      });

    } catch (err: unknown) {
      if (err instanceof AppError) throw err;

      throw new AppError(400, EventResponses.EVENT_CREATED_ERROR);
    }
  },

  async confirm(eventId: string) {
    try {
      return await prisma.$transaction(async (tx) => {
        const event = await tx.event.findUnique({
          where: {
            id: eventId
          }
        });

        if (!event) throw new AppError(404, EventResponses.EVENT_NOT_FOUND);

        return await prisma.event.update({
          where: {
            id: eventId
          },
          data: {
            status: EventStatus.CONFIRMED
          }
        });
      });

    } catch (err: unknown) {
      if (err instanceof AppError) throw err;

      throw new AppError(400, EventResponses.EVENT_CONFIRMED_ERROR);
    }
  },

  async get(id: string) {
    const event = await prisma.event.findUnique({
      where: {
        id
      },
      include: {
        service: true,
        items: {
          include: {
            itemVariant: true
          }
        },
        kits: {
          include: {
            tables: true,
            theme: true
          }
        },
        tables: {
          include: {
            color: true
          }
        }
      }
    });

    if (!event) throw new AppError(404, EventResponses.EVENT_NOT_FOUND);

    return formatEvent(event);
  },

  async getMine(token: RequestCookie) {
    const ownerId = getTokenContent(token.value);

    const events = await prisma.event.findMany({
      where: {
        ownerId
      },
      include: {
        service: true,
        items: {
          include: {
            itemVariant: true
          }
        },
        kits: {
          include: {
            tables: true,
            theme: true
          }
        },
        tables: {
          include: {
            color: true
          }
        }
      }
    });

    return formatEvent(events);
  },

  async getAll() {
    const events = await prisma.event.findMany({
      include: {
        service: true,
        items: {
          include: {
            itemVariant: true
          }
        },
        kits: {
          include: {
            tables: true,
            theme: true
          }
        },
        tables: {
          include: {
            color: true
          }
        }
      }
    });
    
    return formatEvent(events);
  },

  async edit(payload: EventPayload) {
    try {
      return await prisma.$transaction(async (tx) => {
        const { event, service } = payload;

        const eventId = event.id;

        if (!eventId) throw new AppError(400, ServerResponses.INVALID_INPUT);

        const currentEvent = await tx.event.findUnique({
          where: { id: eventId }
        });

        if (!currentEvent) throw new AppError(404, EventResponses.EVENT_NOT_FOUND);

        let eventUpdated = false;
        let reserveUpdated = false;

        if (
          currentEvent.eventDate!.getTime() !== new Date(event.eventDate).getTime() ||
          currentEvent.address !== event.address ||
          !currentEvent.totalPaid.equals(event.totalPaid) ||
          !currentEvent.totalPrice.equals(event.totalPrice)
        ) {
          await tx.event.update({
            where: { id: currentEvent.id },
            data: {
              eventDate: event.eventDate,
              serviceId: service,
              address: JSON.stringify(event.address),
              totalPaid: event.totalPaid,
              totalPrice: event.totalPrice
            }
          });

          eventUpdated = true;
          reserveUpdated = true;
        };

        
  

        return {
          eventUpdated: eventUpdated,
          reserveUpdated: reserveUpdated
        };
      });

    } catch (err: unknown) {
      if (err instanceof AppError) throw err;

      throw new AppError(400, EventResponses.EVENT_UPDATED_ERROR);
    }
  },

  async cancel(id: string) {
    try {
      const event = await prisma.event.findUnique({
        where: { id },
      });

      if (!event) throw new AppError(404, EventResponses.EVENT_NOT_FOUND);

      return await prisma.event.update({
        where: { id },
        data: {
          status: EventStatus.CANCELED
        }
      });

    } catch (err: unknown) {
      if (err instanceof AppError) throw err;

      throw new AppError(400, EventResponses.EVENT_DELETED_ERROR);
    }
  }
}