import { ItemVariant, Event } from "@prisma/client";

type Address = {
  cep: string;
  city: string;
  number: string;
  street: string;
  complement: string;
  neighborhood: string;
}

type EventPayload = {
  event: Event;
  services: string[];
  items: ItemVariant[];
  themeId?: string;
};

export type { EventPayload, Address }