import { Prisma, Service, ItemVariant } from "@prisma/client";
import { Decimal, JsonValue } from "@prisma/client/runtime/client";

type Formated = {
  id: string;
  ownerId: string;
  eventDate: Date | null;
  address: JsonValue | null;
  totalPrice: Decimal;
  totalPaid: Decimal;
  createdAt: Date | null;
  services: Service[];
  items: ItemVariant[];
};

type EventWithServicesAndItems = Prisma.EventGetPayload<{
  include: {
    services: {
      include: {
        service: true
      }
    };
    items: {
      include: {
        itemVariant: true
      }
    };
  }
}>

export function formatEvent(event: EventWithServicesAndItems): Formated;
export function formatEvent(events: EventWithServicesAndItems[]): Formated[];
export function formatEvent(
  events: EventWithServicesAndItems | EventWithServicesAndItems[]
) {
  const formatOne = (event: EventWithServicesAndItems): Formated => ({
    ...event,
    services: event.services.map(s => s.service),
    items: event.items.map(i => ({
      ...i.itemVariant,
      quantity: i.quantity,
    }))
  });

  return Array.isArray(events)
    ? events.map(formatOne)
    : formatOne(events);
}