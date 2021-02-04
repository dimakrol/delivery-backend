import { Field, InputType, ObjectType, PartialType } from '@nestjs/graphql';
import { CreateRestaurantInput } from './create-restaurant.dto';
import { CoreOutput } from '../../common/dtos/output.dto';

@InputType()
export class DeleteRestaurantInput {
  @Field(() => Number)
  id: number;
}

@ObjectType()
export class DeleteRestaurantOutput extends CoreOutput {}