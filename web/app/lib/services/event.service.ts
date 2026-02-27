import { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { prisma } from "../prisma";
import { EventPayload, ItemInput } from "../utils/requests/event.request";
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

      const user = await prisma.user.findUnique({
        where: { id: ownerId }
      });

      if (!user) throw new AppError(404, UserResponses.USER_NOT_FOUND);

      return await prisma.$transaction(async (tx) => {
        const total = await getTotal(tx, payload);

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
            itemVariant: {
              include: {
                item: true
              }
            }
          }
        },
        kits: {
          include: {
            tables: {
              include: {
                item: true
              }
            },
            theme: true,
            items: {
              include: {
                itemVariant: {
                  include: {
                    item: true
                  }
                }
              }
            }
          }
        },
        tables: {
          include: {
            color: {
              include: {
                item: true
              }
            }
          }
        }
      }
    });

    if (!event) throw new AppError(404, EventResponses.EVENT_NOT_FOUND);

    return await formatEvent(event);
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
            itemVariant: {
              include: {
                item: true
              }
            }
          }
        },
        kits: {
          include: {
            tables: {
              include: {
                item: true
              }
            },
            theme: true,
            items: {
              include: {
                itemVariant: {
                  include: {
                    item: true
                  }
                }
              }
            }
          }
        },
        tables: {
          include: {
            color: {
              include: {
                item: true
              }
            }
          }
        }
      }
    });

    return await formatEvent(events);
  },

  async getAll() {
    const events = await prisma.event.findMany({
      include: {
        service: true,
        items: {
          include: {
            itemVariant: {
              include: {
                item: true
              }
            }
          }
        },
        kits: {
          include: {
            tables: {
              include: {
                item: true
              }
            },
            theme: true,
            items: {
              include: {
                itemVariant: {
                  include: {
                    item: true
                  }
                }
              }
            }
          }
        },
        tables: {
          include: {
            color: {
              include: {
                item: true
              }
            }
          }
        }
      }
    });
    
    return await formatEvent(events);
  },

  async assembleEventKit(eventId: string, items: ItemInput[]) {
    const eventKit = await prisma.eventKit.findUnique({
      where: { eventId }
    });

    if (!eventKit) throw new AppError(404, EventResponses.EVENT_NOT_FOUND);

    const itemsOnDb = await prisma.eventKitItem.findMany({
      where: {
        eventKitId: eventKit.id
      }
    });

    const idsOnDb = new Set(
      itemsOnDb.map(item => item.itemVariantId)
    );

    const idsOnItems = new Set(
      items.map(item => item.id)
    );

    const itemsToAdd = items.filter(
      item => !idsOnDb.has(item.id)
    );

    const itemsToDel = itemsOnDb.filter(
      item => !idsOnItems.has(item.itemVariantId)
    );

    let updated = false;

    return await prisma.$transaction(async (tx) => {
      if (itemsToDel.length > 0) {
        await tx.eventKitItem.deleteMany({
          where: {
            id: { in: itemsToDel.map(i => i.id) }
          }
        });

        updated = true;
      }

      if (itemsToAdd.length > 0) {
        await tx.eventKitItem.createMany({
          data: itemsToAdd.map(i => ({
            eventKitId: eventKit.id,
            itemVariantId: i.id,
            quantity: i.quantity ?? 1
          })),
          skipDuplicates: true
        });

        updated = true;
      }

      return {
        itemsUpdated: updated
      }
    });
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
          !currentEvent.totalPaid.equals(event.totalPaid)
        ) {
          await tx.event.update({
            where: { id: currentEvent.id },
            data: {
              eventDate: event.eventDate,
              serviceId: service,
              address: JSON.stringify(event.address),
              totalPaid: event.totalPaid
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