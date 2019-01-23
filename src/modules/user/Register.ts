// Imports
import bcrypt from "bcryptjs";
import { Arg, Mutation, Resolver } from "type-graphql";

// Entity
import { User } from "../../entity/User";

// Register Input
import { RegisterInput } from "./register/RegisterInput";

// Utils
import { CreateConfirmationUrl } from "../../utils/CreateConfirmationUrl";
import { SendEmail } from "../../utils/SendEmail";

@Resolver()
export class RegisterResolver {
  @Mutation(() => User)
  public async register(@Arg("data")
  {
    email,
    firstName,
    lastName,
    password
  }: RegisterInput): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      email,
      firstName,
      lastName,
      password: hashedPassword
    }).save();

    await SendEmail(email, await CreateConfirmationUrl(user.id));

    return user;
  }
}
