// Imports
import { IsEmail, Length } from "class-validator";
import { Field, InputType } from "type-graphql";

// Custom Validator
import { PasswordInput } from "../../../shared/PasswordInput";
import { IsEmailAlreadyExist } from "./isEmailAlreadyExist";

@InputType()
export class RegisterInput extends PasswordInput {
  @Field()
  @Length(1, 255, {
    message: "Le prénom doit faire entre 1 et 255 caractères."
  })
  public firstName: string;

  @Field()
  @Length(1, 255, {
    message: "Le nom de famille doit faire entre 1 et 255 caractères."
  })
  public lastName: string;

  @Field()
  @IsEmail()
  @IsEmailAlreadyExist({ message: "L'email est déjà utilisé." })
  public email: string;
}
