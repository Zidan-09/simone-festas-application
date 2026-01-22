import { Decimal } from "@prisma/client/runtime/client";

interface CreateService {
  name: string;
  price: Decimal;
}

interface EditService {
  name: string,
  price: Decimal
}

export type { CreateService, EditService }