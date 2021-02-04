import {
  Field,
  InputType,
  ObjectType,
  PartialType,
} from '@nestjs/graphql';
import { CoreOutput } from '../../common/dtos/output.dto';
import { CreateRestaurantInput } from './create-restaurant.dto';

@InputType()
export class EditRestaurantInput extends PartialType(CreateRestaurantInput) {
  @Field(() => Number)
  id: string;
}

@ObjectType()
export class EditRestaurantOutput extends CoreOutput {}
