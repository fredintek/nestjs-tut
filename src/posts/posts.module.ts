import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsService } from './providers/posts.service';
import { UsersModule } from 'src/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Posts } from './posts.entity';
import { MetaOptions } from 'src/meta-options/metaOptions.entity';

@Module({
  imports: [UsersModule, TypeOrmModule.forFeature([Posts, MetaOptions])],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
