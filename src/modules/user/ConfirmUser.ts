// Imports
import { Arg, Mutation, Resolver } from "type-graphql";

// Constants
import { CONFIRM_USER_PREFIX } from "../../constants/RedisPrefixes";

// Entity
import { User } from "../../entity/User";

// Utils
import { redis } from "../../redis";

@Resolver()
export class ConfirmUserResolver {
  @Mutation(() => Boolean)
  public async confirmUser(@Arg("token") token: string): Promise<boolean> {
    const userId = await redis.get(CONFIRM_USER_PREFIX + token);

    if (!userId) {
      return false;
    }

    await User.update({ id: parseInt(userId, 10) }, { confirmed: true });
    await redis.del(CONFIRM_USER_PREFIX + token);

    return true;
  }
}
