export interface todos {
  data: todo[];
}

export interface todo {
  id: number;
  isCompleted: boolean;
  images: { id: number; imageName: string }[];
  name: string;
  description: string;
}

export interface NewData {
  name: string;
  id: number;
  description: string;
}

export type category = Omit<NewData, "description">;

export interface categories {
  data: category[];
}
