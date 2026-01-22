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
  date: Date;
  address: Address;
  total: Decimal;
  paid: Decimal;
}

type Service = {

};

type Item = {

};

type EventCreate = {
  event: Event;
  service: Service;
  item: Item;
};

export type { EventCreate, Address }