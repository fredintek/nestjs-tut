import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import {
  postTypeEnum,
  statusEnum,
} from './dtos/requests/create-posts-requests';
import { MetaOptions } from 'src/meta-options/metaOptions.entity';

@Entity()
export class Posts {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 512,
    nullable: false,
  })
  title: string;

  @Column({
    type: 'enum',
    enum: postTypeEnum,
    default: postTypeEnum.POST,
    nullable: false,
    comment: 'post, page, story, series',
  })
  postType: postTypeEnum;

  @Column({
    type: 'varchar',
    length: 256,
    nullable: false,
    unique: true,
  })
  slug: string;

  @Column({
    type: 'enum',
    enum: statusEnum,
    default: statusEnum.DRAFT,
    nullable: false,
    comment: 'draft, published, scheduled, review',
  })
  status: statusEnum;

  @Column({
    type: 'text',
    nullable: true,
    comment: 'This is the content of the blog post',
  })
  content: string;

  @Column({
    type: 'text',
    nullable: true,
    comment: 'This is the schema of the blog post',
  })
  schema: string;

  @Column({
    type: 'varchar',
    length: 1024,
    nullable: true,
    comment: 'This is the featured image url of the blog post',
  })
  featuredImageUrl: string;

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  publishOn: Date;

  @OneToOne(() => MetaOptions)
  @JoinColumn()
  metaOptions: MetaOptions;

  // TODO: WORK ON THESE AS RELATIONSHIPS
  // @Column()
  // tags: string[];

  // @Column()
  // metaOptions: MetaOptionsType[];
}
