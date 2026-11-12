import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Event } from "./event.entity";
import { User } from "./user.entity";

@Entity("event_participants")
@Index("UQ_EVENT-PARTICIPANT_EVENT-USER", ["eventId", "userId"], {
  unique: true,
})
export class EventParticipant {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "uuid" })
  eventId!: string;

  @Column({ type: "uuid" })
  userId!: string;

  @ManyToOne(() => Event, (event) => event.participants, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "eventId" })
  event!: Event;

  @ManyToOne(() => User, (user) => user.eventParticipations, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "userId" })
  user!: User;

  @CreateDateColumn({ type: "timestamptz" })
  joinedAt!: Date;
}
