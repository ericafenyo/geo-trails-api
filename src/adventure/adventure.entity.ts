import { Location } from "./location.entity";
import { Distance, Energy, Speed } from "./adventure.types";


export class Adventure {
  // @PrimaryGeneratedColumn()
  id: number;

  // @Column({ unique: true })
  uuid: string;

  // @Column({ default: "" })
  title: string;

  // @Column({ default: "" })
  description: string;

  // @Column({type: "simple-json"})
  energy: Energy;

  // @Column({ type: "simple-json" })
  distance: Distance;

  // @Column()
  duration: number;

  // @Column({ name: "start_time" })
  startTime: Date;

  // @Column({ name: "end_time" })
  endTime: Date;

  // @Column({type: "simple-json"})
  speed: Speed;

  // @Column()
  polyline: string;

  // @OneToMany(() => Location, location => location.adventure)
  locations: Location[];

  // @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  // @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;
}
