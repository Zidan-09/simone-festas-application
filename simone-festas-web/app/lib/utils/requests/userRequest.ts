interface Register {
  name: string;
  username: string;
  address: string;
  contact: string;
  cpf: string;
  email: string;
  password: string;
}

interface Login {
  login: string;
  password: string;
}

export type { Register, Login }