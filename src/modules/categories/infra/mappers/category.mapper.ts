import { Injectable } from '@nestjs/common';
import { Category } from '../../domain/entities/category.entity';

@Injectable()
export class CategoryMapper {
  static toController(category: Category) {
    return category.toJSON('SNAKE_CASE');
  }
}
