export enum ThemeCategory {
  KIDS = 'KIDS',
  ADULTS = 'ADULTS',
  SPECIAL_EVENTS = 'SPECIAL_EVENTS',
  HOLIDAYS = 'HOLIDAYS'
};

export enum ItemType {
  CURTAIN = 'CURTAIN',
  PANEL = 'PANEL',
  DESSERT_STAND = 'DESSERT_STAND',
  TABLE = 'TABLE',
  RUG = 'RUG',
  EASEL = 'EASEL',
  TABLE_SETTING = 'TABLE_SETTING'
};

type ImageOfTheme = {
  id: string;
  themeId: string;
  url: string;
}

export type Theme = {
  name: string;
  id: string;
  mainImage: string;
  category: ThemeCategory;
  createdAt: Date | null;
  keyWords: string[];
  images: ImageOfTheme[];
}

export type Item = {
  type: ItemType;
  description: string;
  price: number;
  id: string;
  name: string;
  createdAt: Date | null;
  variants: Variant[];
}

export type Variant = {
  variant: string;
  image: string | File | null;
  quantity: number;
  id?: string;
  keyWords: string[];
  itemId?: string;
}

export type ItemFormated = {
  id: string;
  name: string;
  description: string;
  type: ItemType;
  price: number;
  vid: string;
  variant: string;
  image: string;
  quantity: number;
  keywords: string[];
}

export type ItemSearch = {
  keyWords: string[];
  item: {
      id: string;
      name: string;
      description: string;
      price: number;
      type: ItemType;
      createdAt: Date | null;
  };
  id: string;
  variant: string;
  itemId: string;
  image: string;
  quantity: number;
}

export type Address = {
  cep: string;
  city: string;
  number: string;
  street: string;
  complement: string;
  neighborhood: string;
}

export type EventStatus = "PENDING" | "CONFIRMED" | "IN_PROGRESS" | "COMPLETED" | "CANCELED" | "POSTPONED";
export type ReserveType = "ITEMS" | "KIT" | "TABLE";

export type Service = {
  id: string;
  name: string;
  price: number;
}

export type Kit = {
  kitType: string;
  tables: ItemFormated;
  theme: Theme;
  items: ItemFormated[];
}

export type Table = {
  colorTone: ItemFormated;
  numberOfPeople: number;
}

export type EventFormated = {
  id: string;
  ownerId: string;
  eventDate: string;
  status: EventStatus;
  address: Address;
  totalPrice: number;
  totalPaid: number;
  reserveType: ReserveType;
  createdAt: string;
  services: Service[];
  reserve: ItemFormated[] | Kit | Table;
};

type Event = {
  id: string;
  ownerId: string;
  eventDate: string;
  address: Address;
  totalPrice: number;
  totalPaid: number;
  status: EventStatus;
  reserveType: string;
  createdAt: string;
}

type EventBase = {
  event: Event;
  services: string[];
}

type EventItemData = {
  id: string;
  quantity: number;
}

export type EventItem = {
  eventType: "ITEMS";
  items: EventItemData[];
}

export type KitType = "SIMPLE" | "CYLINDER";

type EventKit = {
  eventType: "KIT";
  kitType: KitType;
  tables: string;
  theme: string;
}

type EventTable = {
  eventType: "TABLE";
  colorToneId: string;
  numberOfPeople: number;
}

type ItemPayload = EventBase & EventItem;
type KitPayload = EventBase & EventKit;
type TablePayload = EventBase & EventTable;

export type EventPayload = ItemPayload | KitPayload | TablePayload;