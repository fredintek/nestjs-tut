import { Posts } from 'src/posts/posts.entity';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Users {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 96,
    nullable: false,
  })
  firstname: string;

  @Column({
    type: 'varchar',
    length: 96,
    nullable: true,
  })
  lastname: string;

  @Column({
    type: 'varchar',
    length: 96,
    nullable: false,
    unique: true,
  })
  email: string;

  @Column({
    type: 'varchar',
    length: 96,
    nullable: true,
  })
  password?: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  googleId?: string;

  @OneToMany(() => Posts, (post) => post.author)
  posts: Posts[];

  // hooks
  @BeforeInsert()
  @BeforeUpdate()
  lowercaseEmail() {
    if (this.email) {
      this.email = this.email.toLowerCase();
    }
  }
}
