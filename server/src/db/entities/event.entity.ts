import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  ManyToMany,
  JoinTable,
  PrimaryGeneratedColumn,
} from "typeorm";
import { EventParticipant } from "./participant.entity";
import { User } from "./user.entity";
import { Tag } from "./tag.entity";

@Entity("events")
export class Event {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar", length: 255 })
  title!: string;

  @Column({ type: "text" })
  description!: string;

  @Column({ type: "int" })
  capacity!: number;

  @Column({ type: "int" })
  entryPrice!: number;

  @Column({ type: "varchar", length: 255 })
  address!: string;

  @Column({ type: "timestamptz" })
  startedAt!: Date;

  @ManyToOne(() => User, (user) => user.events, { onDelete: "CASCADE" })
  owner!: User;

  @Column({ type: "uuid" })
  ownerId!: string;

  @OneToMany(() => EventParticipant, (participant) => participant.event)
  participants!: EventParticipant[];

  @ManyToMany(() => Tag, (tag) => tag.events)
  @JoinTable({
    name: "event_tags",
    joinColumn: { name: "eventId", referencedColumnName: "id" },
    inverseJoinColumn: { name: "tagId", referencedColumnName: "id" },
  })
  tags!: Tag[];

  @CreateDateColumn({ type: "timestamptz" })
  createdAt!: Date;

  @CreateDateColumn({ type: "timestamptz" })
  updatedAt!: Date;
}
