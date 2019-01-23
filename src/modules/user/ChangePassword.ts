// Imports
import { hash } from "bcryptjs";
import { Arg, Ctx, Mutation, Resolver } from "type-graphql";

// Constants
import { FORGOT_PASSWORD_PREFIX } from "../../constants/RedisPrefixes";

// Entity
import { User } from "../../entity/User";

// Input Types
import { ChangePasswordInput } from "./changePassword/ChangePasswordInput";

// Utils
import { redis } from "../../redis";

// Types
import { IContext } from "../../types/Context";

@Resolver()
export class ChangePasswordResolver {
  @Mutation(() => User, { nullable: true })
  public async changePassword(
    @Arg("data")
    { password, token }: ChangePasswordInput,
    @Ctx() ctx: IContext
  ): Promise<User | null> {
    const userId = await redis.get(FORGOT_PASSWORD_PREFIX + token);

    if (!userId) {
      return null;
    }

    const user = await User.findOne(userId);

    if (!user) {
      return null;
    }

    await redis.del(FORGOT_PASSWORD_PREFIX + token);

    user.password = await hash(password, 12);

    await user.save();

    ctx.req.session!.userId = user.id;

    return user;
  }
}
