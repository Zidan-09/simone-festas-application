import { Prisma, Service, ItemVariant, Theme, EventStatus } from "@prisma/client";
import { Decimal, JsonValue } from "@prisma/client/runtime/client";
import { ReserveType } from "../requests/event.request";

type EventWithServicesAndReserve = Prisma.EventGetPayload<{
  include: {
    service: true;
    items: {
      include: {
        itemVariant: true
      }
    };
    kits: {
      include: {
        tables: true;
        theme: true;
        items: {
          include: {
            itemVariant: true;
          }
        }
      }
    };
    tables: {
      include: {
        color: true;
      }
    };
  };
}>

type Kit = {
  kitType: string;
  tables: ItemVariant;
  theme: Theme;
  items: ItemVariant[];
}

type Table = {
  colorTone: ItemVariant;
  numberOfPeople: number;
}

type Formated = {
  id: string;
  ownerId: string;
  eventDate: Date | null;
  status: EventStatus;
  address: JsonValue | null;
  totalPrice: Decimal;
  totalPaid: Decimal;
  reserveType: ReserveType;
  createdAt: Date | null;
  service: Service | null;
  reserve: ItemVariant[] | Kit | Table;
};

export function formatEvent(event: EventWithServicesAndReserve): Formated;
export function formatEvent(events: EventWithServicesAndReserve[]): Formated[];
export function formatEvent(
  events: EventWithServicesAndReserve | EventWithServicesAndReserve[]
) {
  const formatOne = (event: EventWithServicesAndReserve): Formated => {
    let reserve: Formated["reserve"];

    switch (event.reserveType) {
      case "ITEMS":
        reserve = event.items.map(i => ({
          ...i.itemVariant,
          quantity: i.quantity,
        }));
        break;

      case "KIT":
        const kit = event.kits[0];

        reserve = {
          kitType: kit.kitType,
          tables: kit.tables,
          theme: kit.theme,
          items: kit.items.map(i => ({
            ...i.itemVariant,
            quantity: i.quantity,
          }))
        };
        break;

      case "TABLE":
        const table = event.tables[0];

        reserve = {
          colorTone: table.color,
          numberOfPeople: table.numberOfPeople,
        };
        break;

      default:
        reserve = [];
    }

    return {
      ...event,
      reserveType: event.reserveType as ReserveType,
      service: event.service,
      reserve,
    };
  };

  return Array.isArray(events)
    ? events.map(formatOne)
    : formatOne(events);
}