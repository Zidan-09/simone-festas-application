interface CreateService {
  name: string;
  icon: File;
  price: number;
}

interface EditService {
  name: string;
  icon: File | string;
  price: number;
}

export type { CreateService, EditService }