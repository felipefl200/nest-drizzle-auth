import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query
} from '@nestjs/common'
import { CreatePostDto } from './dto/create-post.dto'
import { UpdatePostDto } from './dto/update-post.dto'
import { PostService } from './post.service'

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  create(@Body() createPostDto: CreatePostDto) {
    return this.postService.create(createPostDto)
  }

  @Get()
  findAll() {
    return this.postService.findAll()
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    const post = await this.postService.findOne(id)
    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`)
    }
    return post
  }

  @Patch(':id')
  async update(@Param('id') id: number, @Body() updatePostDto: UpdatePostDto) {
    const updatedPost = await this.postService.update(id, updatePostDto)

    if (!updatedPost) {
      throw new NotFoundException(`Post with ID ${id} not found`)
    }

    return updatedPost
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: number, @Query('hard') hard?: string) {
    const isHardDelete = hard === 'true'

    const result = isHardDelete ? await this.postService.hardRemove(id) : await this.postService.remove(id)

    if (!result) {
      throw new NotFoundException(`Post with ID ${id} not found`)
    }
    return result
  }
}
