import { Prisma, Service, Theme, EventStatus } from "@prisma/client";
import { Decimal, JsonValue } from "@prisma/client/runtime/client";
import { ReserveType } from "../requests/event.request";
import { ItemFormated } from "../item/format";

function formatItem(
  item: Prisma.ItemVariantGetPayload<{
    include: {
      item: true
    }
  }>,
  quantity: number
) {
  return {
    id: item.itemId,
    name: item.item.name,
    description: item.item.description,
    type: item.item.type,
    price: Number(item.item.price),
    vid: item.id,
    variant: item.variant ?? "",
    image: item.image ?? "",
    quantity,
    keywords: item.keyWords
  }
}

type EventWithServicesAndReserve = Prisma.EventGetPayload<{
  include: {
    service: true;
    items: {
      include: {
        itemVariant: {
          include: {
            item: true
          }
        }
      }
    };
    kits: {
      include: {
        tables: {
          include: {
            item: true
          }
        };
        theme: true;
        items: {
          include: {
            itemVariant: {
              include: {
                item: true
              }
            };
          }
        }
      }
    };
    tables: {
      include: {
        color: {
          include: {
            item: true
          }
        };
      }
    };
  };
}>

type Kit = {
  kitType: string;
  tables: ItemFormated;
  theme: Theme;
  items: ItemFormated[];
}

type Table = {
  colorTone: ItemFormated;
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
  reserve: ItemFormated[] | Kit | Table;
};

export async function formatEvent(event: EventWithServicesAndReserve): Promise<Formated>;
export async function formatEvent(events: EventWithServicesAndReserve[]): Promise<Formated[]>;
export async function formatEvent(
  events: EventWithServicesAndReserve | EventWithServicesAndReserve[]
) {
  const formatOne = (event: EventWithServicesAndReserve): Formated => {
    let reserve: Formated["reserve"];

    switch (event.reserveType) {
      case "ITEMS":
        reserve = event.items.map(i =>
          formatItem(i.itemVariant, i.quantity)
        );
        break;

      case "KIT":
        const kit = event.kits[0];

        reserve = {
          kitType: kit.kitType,
          tables: formatItem(kit.tables, 1),
          theme: kit.theme,
          items: kit.items.map(i => 
            formatItem(i.itemVariant, i.quantity)
          )
        };
        break;

      case "TABLE":
        const table = event.tables[0];

        reserve = {
          colorTone: formatItem(table.color, 1),
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