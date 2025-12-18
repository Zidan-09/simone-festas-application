interface RegisterUser {
  username: string;
  cpf: string;
  address: string;
  contact: string;
  email: string;
  password: string;
}

interface LoginUser {
  login: string;
  password: string;
}

interface EditUser {
  id: string;
  username: string;
  address: string;
  contact: string;
  cpf: string;
  email: string;
  password: string;
}

export type { RegisterUser, LoginUser, EditUser }