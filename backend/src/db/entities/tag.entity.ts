import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Event } from "./event.entity";

@Entity("tags")
export class Tag {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar", length: 100, unique: true })
  name!: string;

  @Column({ type: "varchar", length: 100, nullable: true })
  color?: string;

  @CreateDateColumn({ type: "timestamptz" })
  createdAt!: Date;

  @ManyToMany(() => Event, (event) => event.tags)
  events!: Event[];
}
