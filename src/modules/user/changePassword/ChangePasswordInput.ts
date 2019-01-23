// Imports
import { Field, InputType } from "type-graphql";

// Custom Validator
import { PasswordInput } from "../../../shared/PasswordInput";

@InputType()
export class ChangePasswordInput extends PasswordInput {
  @Field()
  public token: string;
}
