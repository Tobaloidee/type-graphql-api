// Imports
import { Field, ID, ObjectType, Root } from "type-graphql";
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@ObjectType()
@Entity()
export class User extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  public id: number;

  @Field()
  @Column()
  public firstName: string;

  @Field()
  @Column()
  public lastName: string;

  @Field()
  @Column("text", { unique: true })
  public email: string;

  @Column()
  public password: string;

  @Column("boolean", { default: false })
  public confirmed: boolean;

  @Field({ complexity: 3 })
  public name(@Root() parent: User): string {
    return `${parent.firstName} ${parent.lastName}`;
  }
}
