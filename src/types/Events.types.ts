import { Model } from "sequelize";

export interface EventAttributes {
    id?:string
  title: string;
  description: string;
  location: string;
  startDate: Date;
  endDate: Date;
  organizerId: string;
  isPublished: boolean;
}


export interface EventsInstance extends Model<EventAttributes>, EventAttributes {}