type ReserveType = "ITEMS" | "KIT" | "TABLE";

type Address = {
  cep: string;
  city: string;
  number: string;
  street: string;
  complement: string;
  neighborhood: string;
}

type ItemInput = {
  id: string;
  quantity?: number;
}

type Items = {
  eventType: "ITEMS";
  items: ItemInput[];
};

type KitType = "SIMPLE" | "CYLINDER";

type Kit = {
  eventType: "KIT";
  kitType: KitType;
  tables: string;
  theme: string;
}

type Table = {
  eventType: "TABLE";
  colorToneId: string;
  numberOfPeople: number;
};

type Event = {
  id?: string;
  ownerId?: string;
  eventDate: string;
  address: Address | null;
  service: string | null;
  reserveType: ReserveType;
  status?: string;
  totalPaid: number;
}

type EventPayloadBase = {
  event: Event;
  service?: string;
};

type ItemPayload = EventPayloadBase & Items;
type KitPayload = EventPayloadBase & Kit;
type TablePayload = EventPayloadBase & Table;

type EventPayload = ItemPayload | KitPayload | TablePayload;

export type { Address, ReserveType, EventPayload, KitType, ItemInput };