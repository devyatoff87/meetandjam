import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Event } from "./event.entity";
import { EventParticipant } from "./participant.entity";
import { Role } from "../../types/roles";

@Entity("user")
export class User {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar", default: "user" })
  role!: Role;

  @Column({ type: "varchar", length: 255, unique: true })
  email!: string;

  @Column({ type: "varchar", length: 255 })
  passwordHash!: string;

  @Column({ type: "varchar", length: 255 })
  name!: string;

  @CreateDateColumn({ type: "timestamptz" })
  createdAt!: Date;

  @CreateDateColumn({ type: "timestamptz" })
  updatedAt!: Date;

  @OneToMany(() => Event, (event) => event.owner)
  events!: Event[];

  @OneToMany(() => EventParticipant, (participant) => participant.user)
  eventParticipations!: EventParticipant[];
}
