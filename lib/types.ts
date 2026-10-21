export type Gender = "L" | "P";

export type Participant = {
  id: number;
  nama: string;
  komisi: string;
  gender: Gender;
  umur: number;
};

export type Team = {
  id: number;
  name: string;
  members: Participant[];
};
