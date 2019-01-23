// Imports
import { Field, InputType } from "type-graphql";

@InputType()
export class PasswordInput {
  @Field()
  public password: string;
}
