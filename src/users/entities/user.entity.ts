import { BeforeInsert, BeforeUpdate, Column, Entity } from 'typeorm';
import { CoreEntity } from '../../common/entities/core.entity';
import {
  Field,
  InputType,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import * as bcrypt from 'bcrypt';
import { InternalServerErrorException } from '@nestjs/common';
import { IsBoolean, IsEmail, IsEnum, IsString } from 'class-validator';

export enum UserRole {
  Client,
  Owner,
  Delivery,
}

registerEnumType(UserRole, { name: 'UserRole' });

@InputType({ isAbstract: true })
@ObjectType()
@Entity()
export class User extends CoreEntity {
  @Column({ unique: true })
  @Field(() => String)
  @IsEmail()
  email: string;

  @Column({ select: false })
  @Field(() => String)
  @IsString()
  password: string;

  @Field(() => UserRole)
  @Column({
    type: 'enum',
    enum: UserRole,
  })
  @IsEnum(UserRole)
  role: UserRole;

  @Field(() => Boolean)
  @Column({ default: false })
  @IsBoolean()
  verified: boolean;

  @BeforeInsert()
  @BeforeUpdate()
  async hasPassword(): Promise<void> {
    if (!this.password) return;
    try {
      this.password = await bcrypt.hash(this.password, 10);
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException();
    }
  }

  async checkPassword(aPassword: string): Promise<boolean> {
    try {
      return await bcrypt.compare(aPassword, this.password);
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException();
    }
  }
}
