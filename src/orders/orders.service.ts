import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Repository } from 'typeorm';
import { CreateOrderInput, CreateOrderOutput } from './dtos/create-order.dto';
import { User } from '../users/entities/user.entity';
import { Restaurant } from '../restaurants/entities/restaurant.entity';
import { OrderItem } from './entities/order-item.entity';
import { Dish } from '../restaurants/entities/dish.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order) private readonly orders: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItems: Repository<OrderItem>,
    @InjectRepository(Restaurant)
    private readonly restaurants: Repository<Restaurant>,
    @InjectRepository(Dish)
    private readonly dishes: Repository<Dish>,
  ) {}

  async createOrder(
    customer: User,
    { restaurantId, items }: CreateOrderInput,
  ): Promise<CreateOrderOutput> {
    try {
      const restaurant = await this.restaurants.findOneOrFail(
        restaurantId,
      );
      if (!restaurant) {
        return {
          ok: false,
          error: 'Cannot find restaurant.',
        };
      }

      // const order = await this.orders.save(
      //   this.orders.create({
      //     customer,
      //     restaurant,
      //   }),
      // );
      for (const item of items) {
        const dish = await this.dishes.findOne(item.dishId);
        if (!dish) {
          //about
        }
        await this.orderItems.save(
          this.orderItems.create({
            dish,
            options: item.options,
          }),
        );
      }
      return {
        ok: true,
      };
    } catch (e) {
      console.log(e);
      return {
        ok: false,
        error: 'Order did not created!',
      };
    }
  }
}
