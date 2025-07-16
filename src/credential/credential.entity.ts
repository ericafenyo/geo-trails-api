export class Credential {
  // @PrimaryGeneratedColumn()
  id: number;

  // @Column()
  password: string;

  // @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  // @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;

  // @OneToOne(() => User)
  // @JoinColumn({ name: "user_id" })
  // user: User;
}
