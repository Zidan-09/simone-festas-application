import { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { prisma } from "../prisma";
import { editItems } from "../utils/event/edit/editItems";
import { editServices } from "../utils/event/edit/editServices";
import { EventPayload } from "../utils/requests/event.request";
import { EventResponses } from "../utils/responses/event.responses";
import { ServerResponses } from "../utils/responses/serverResponses";
import { getTokenContent } from "../utils/user/getTokenContent";

export const EventService = {
  async create(payload: EventPayload, token: RequestCookie) {
    try {
      const ownerId = getTokenContent(token.value);

      return await prisma.$transaction(async (tx) => {
        const event = await tx.event.create({
          data: {
            ownerId,
            eventDate: payload.event.date,
            address: payload.event.address,
            totalPaid: payload.event.paid,
            totalPrice: payload.event.total
          }
        });

        const services = await Promise.all(
          payload.service.map(async (service) => {
            return await tx.eventService.create({
              data: {
                serviceId: service.id,
                eventId: event.id
              }
            });
          })
        );

        const items = await Promise.all(
          payload.item.map(async (item) => {
            return await tx.eventItem.create({
              data: {
                itemVariantId: item.id,
                eventId: event.id,
                quantity: item.quantity
              }
            });
          })
        );

        return {
          event,
          services,
          items
        };
      });

    } catch (err: any) {
      if (err?.statusCode) throw err;

      throw {
        statusCode: 400,
        message: EventResponses.EVENT_CREATED_ERROR
      };
    }
  },

  async get(id: string) {
    const event = await prisma.event.findUnique({
      where: {
        id
      },
      include: {
        services: true,
        items: true
      }
    });

    if (!event) throw {
      statusCode: 404,
      message: EventResponses.EVENT_NOT_FOUND
    };

    return event;
  },

  async getMine(token: RequestCookie) {
    const ownerId = getTokenContent(token.value);

    return await prisma.event.findMany({
      where: {
        ownerId
      },
      include: {
        items: true,
        services: true
      }
    });
  },

  async getAll() {
    return await prisma.event.findMany({
      include: {
        services: true,
        items: true
      }
    });
  },

  async edit(payload: EventPayload) {
    try {
      return await prisma.$transaction(async (tx) => {
        const { event, service, item } = payload;

        const eventId = event.id;

        if (!eventId) throw {
          statusCode: 400,
          message: ServerResponses.INVALID_INPUT
        };

        const currentEvent = await tx.event.findUnique({
          where: { id: eventId }
        });

        if (!currentEvent) throw {
          statusCode: 404,
          message: EventResponses.EVENT_NOT_FOUND
        };

        let eventUpdated = false;
        let servicesUpdated = false;
        let itemsUpdated = false;

        if (
          currentEvent.eventDate!.getTime() !== new Date(event.date).getTime() ||
          currentEvent.address !== event.address ||
          !currentEvent.totalPaid.equals(event.paid) ||
          !currentEvent.totalPrice.equals(event.total)
        ) {
          await tx.event.update({
            where: { id: currentEvent.id },
            data: {
              eventDate: event.date,
              address: event.address,
              totalPaid: event.paid,
              totalPrice: event.total
            }
          });

          eventUpdated = true;
        };

        servicesUpdated = await editServices(tx, service, eventId);
        itemsUpdated = await editItems(tx, item, eventId);

        return {
          eventUpdated: eventUpdated,
          servicesUpdated: servicesUpdated,
          itemsUpdated: itemsUpdated
        };
      });

    } catch (err: any) {
      if (err?.statusCode) throw err;

      throw {
        statusCode: 400,
        message: EventResponses.EVENT_UPDATED_ERROR
      };
    }
  },

  async delete(id: string) {
    try {
      const event = await prisma.event.findUnique({
        where: { id },
      });

      if (!event) throw {
        statusCode: 404,
        message: EventResponses.EVENT_NOT_FOUND
      };

      return await prisma.event.delete({ where: { id } });

    } catch (err: any) {
      if (err?.statusCode) throw err;

      throw {
        statusCode: 400,
        message: EventResponses.EVENT_DELETED_ERROR
      };
    }
  }
}