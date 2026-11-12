import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Event } from "./event.entity";
import { CategorySlug } from "../../types/categories";

@Entity("categories")
export class Category {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar", length: 100, unique: true })
  name!: string;

  @Column({ type: "varchar", length: 100, unique: true })
  slug!: CategorySlug;

  @Column({ type: "text", nullable: true })
  description?: string;

  @Column({ type: "varchar", nullable: true })
  icon?: string;

  @OneToMany(() => Event, (event) => event.category)
  events!: Event[];

  @CreateDateColumn({ type: "timestamptz" })
  createdAt!: Date;
}
