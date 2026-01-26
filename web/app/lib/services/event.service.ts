import { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { prisma } from "../prisma";
import { editItems } from "../utils/event/edit/editItems";
import { editServices } from "../utils/event/edit/editServices";
import { EventPayload } from "../utils/requests/event.request";
import { EventResponses } from "../utils/responses/event.responses";
import { ServerResponses } from "../utils/responses/serverResponses";
import { getTokenContent } from "../utils/user/getTokenContent";
import { formatEvent } from "../utils/event/formatEvent";

export const EventService = {
  async create(payload: EventPayload, token: RequestCookie) {
    try {
      const { event, services, items } = payload;
      const ownerId = getTokenContent(token.value);

      return await prisma.$transaction(async (tx) => {
        const user = await tx.user.findUnique({
          where: { id: ownerId }
        });

        const eventOnDB = await tx.event.create({
          data: {
            ownerId,
            eventDate: event.date,
            address: event.userAddress ? user!.address! : event.address,
            totalPaid: event.paid,
            totalPrice: event.total
          }
        });

        const servicesOnDB = await Promise.all(
          services.map(async (service) => {
            return await tx.eventService.create({
              data: {
                serviceId: service,
                eventId: eventOnDB.id
              }
            });
          })
        );

        const itemsOnDB = await Promise.all(
          items.map(async (item) => {
            return await tx.eventItem.create({
              data: {
                itemVariantId: item.id,
                eventId: eventOnDB.id,
                quantity: item.quantity
              }
            });
          })
        );

        return {
          eventOnDB,
          servicesOnDB,
          itemsOnDB
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
        services: {
          include: {
            service: true
          }
        },
        items: {
          include: {
            itemVariant: true
          }
        }
      }
    });

    if (!event) throw {
      statusCode: 404,
      message: EventResponses.EVENT_NOT_FOUND
    };

    return formatEvent(event);
  },

  async getMine(token: RequestCookie) {
    const ownerId = getTokenContent(token.value);

    const events = await prisma.event.findMany({
      where: {
        ownerId
      },
      include: {
        items: {
          include: {
            itemVariant: true
          }
        },
        services: {
          include: {
            service: true
          }
        }
      }
    });

    return formatEvent(events);
  },

  async getAll() {
    const events = await prisma.event.findMany({
      include: {
        services: {
          include: {
            service: true
          }
        },
        items: {
          include: {
            itemVariant: true
          }
        }
      }
    });
    
    return formatEvent(events);
  },

  async edit(payload: EventPayload) {
    try {
      return await prisma.$transaction(async (tx) => {
        const { event, services, items } = payload;

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

        servicesUpdated = await editServices(tx, services, eventId);
        itemsUpdated = await editItems(tx, items, eventId);

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