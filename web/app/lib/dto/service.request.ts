import { KitType } from "./event.request";

interface CreateService {
  name: string;
  icon: File;
  price: number;
  forKit?: KitType;
}

interface EditService {
  name: string;
  icon: File | string;
  price: number;
  forKit?: KitType;
}

export type { CreateService, EditService }