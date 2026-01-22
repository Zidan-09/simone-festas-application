import { ItemVariant, Service } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/client";

type Address = {
  cep: string;
  city: string;
  number: string;
  street: string;
  complement: string;
  neighborhood: string;
}

type Event = {
  id?: string;
  date: Date;
  address: Address;
  total: Decimal;
  paid: Decimal;
}

type EventPayload = {
  event: Event;
  service: Service[];
  item: ItemVariant[];
};

export type { EventPayload, Address }