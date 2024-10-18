export interface User {
  _id: string;
  email: string;
  password: string;
  displayName: string;
  avatar: string | null;
  token: string;
  role: string;
  googleID?: string;
}

export interface RegisterMutation {
  email: string;
  password: string;
  displayName: string;
  avatar: string | null;
}

export interface LoginMutation {
  email: string;
  password: string;
}

export interface ValidationError {
  errors: {
    [key: string]: {
      name: string;
      message: string;
    };
  };
  message: string;
  name: string;
  _message: string;
}

export interface GlobalError {
  error: string;
}

export interface Ingredient {
  name: string;
  amount: string;
}

export interface Cocktail {
  _id: string;
  author: string;
  name: string;
  image: string;
  recipe: string;
  isPublished: boolean;
  ingredients: Ingredient[];
}

export interface CocktailMutation {
  name: string;
  image: File | null;
  recipe: string;
  ingredients: Ingredient[];
}