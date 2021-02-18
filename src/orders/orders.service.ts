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
          return {
            ok: false,
            error: 'No dish found!',
          };
        }
        console.log(`Dish price: ${dish.price}`);
        for (const itemOption of item.options) {
          // console.log(itemOption);
          const dishOption = dish.options.find(
            (dishOption) => dishOption.name === itemOption.name,
          );
          if (dishOption) {
            if (dishOption.extra) {
              console.log(`usd + ${dishOption.extra}`);
            } else {
              const dishOptionChoice = dishOption.choices.find(
                (optionChoice) => optionChoice.name === itemOption.choice,
              );
              if (dishOptionChoice) {
                if (dishOptionChoice.extra) {
                  console.log(`usd + ${dishOptionChoice.extra}`);
                }
              }
            }
          }
          // console.log(itemOption.name, dishOption.name)
        }
        // const dishOption =
        // await this.orderItems.save(
        //   this.orderItems.create({
        //     dish,
        //     options: item.options,
        //   }),
        // );
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
