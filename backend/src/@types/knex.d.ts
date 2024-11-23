import { Knex } from "knex";

declare module 'knex/types/tables' {
  export interface Tables {
    rides: {
      id: number;
      date: Date;
      origin: string;
      destination: string;
      distance: number;
      duration: string;
      customer_id: string;
      driver_id: number;
      value: number;
    }
    drivers: {
      id: number;
      name: string;
      description: string;
      car: string;
      review: string;
      rate: number;
      min_distance: number;
    }
  }
}