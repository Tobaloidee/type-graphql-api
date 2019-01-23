// Imports
import bcrypt from "bcryptjs";
import { Arg, Ctx, Mutation, Resolver } from "type-graphql";

// Entity
import { User } from "../../entity/User";

// Types
import { IContext } from "./../../types/Context";

@Resolver()
export class LoginResolver {
  @Mutation(() => User, { nullable: true })
  public async login(
    @Arg("email") email: string,
    @Arg("password") password: string,
    @Ctx() ctx: IContext
  ): Promise<User | null> {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return null;
    }

    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      return null;
    }

    if (!user.confirmed) {
      return null;
    }

    ctx.req.session!.userId = user.id;

    return user;
  }
}
