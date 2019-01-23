// Imports
import { Arg, Mutation, Resolver } from "type-graphql";
import { v4 } from "uuid";

// Constants
import { FORGOT_PASSWORD_PREFIX } from "../../constants/RedisPrefixes";

// Entity
import { User } from "../../entity/User";

// Utils
import { redis } from "../../redis";
import { SendEmail } from "../../utils/SendEmail";

@Resolver()
export class ForgotPasswordResolver {
  @Mutation(() => Boolean)
  public async forgotPassword(@Arg("email") email: string): Promise<boolean> {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return true;
    }

    const token = v4();
    await redis.set(
      FORGOT_PASSWORD_PREFIX + token,
      user.id,
      "ex",
      60 * 60 * 24
    );

    await SendEmail(
      email,
      `http://localhost:3000/user/change-password/${token}`
    );

    return true;
  }
}
