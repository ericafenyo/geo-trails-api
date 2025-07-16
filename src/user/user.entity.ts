

import { Gender } from "./user.types";

export class User {
  // @PrimaryGeneratedColumn()
  id: number;

  // @Generated("uuid")
  // @Column({ unique: true })
  uuid: string;

  // @Column({ unique: true })
  email: string;

  // @Column({ default: "" })
  username: string;

  // @Column({ enum: [Gender.MALE, Gender.FEMALE, Gender.UNSPECIFIED], default: Gender.UNSPECIFIED })
  gender: string;

  // @Column({ name: "avatar_path", default: "" })
  avatarPath: string;

  // @Column({ default: false })
  activated: boolean;

  // @Column({ name: "activation_code", nullable: true })
  activationCode: string;

  // @Column({ name: "activated_at", nullable: true })
  activatedAt: Date;

  // @Column({ name: "password_reset_code", nullable: true })
  passwordResetCode: string;

  // @Column({ name: "last_login", nullable: true })
  lastLogin: Date;

  // @Column({ name: "current_login", nullable: true })
  currentLogin: Date;

  // @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  // @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;
}
