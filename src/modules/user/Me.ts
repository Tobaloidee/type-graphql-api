// Imports
import { Ctx, Query, Resolver } from "type-graphql";

// Entity
import { User } from "../../entity/User";

// Types
import { IContext } from "../../types/Context";

@Resolver()
export class MeResolver {
  @Query(() => User, { complexity: 5, nullable: true })
  public async me(@Ctx() ctx: IContext): Promise<User | undefined> {
    if (!ctx.req.session!.userId) {
      return undefined;
    }

    return User.findOne(ctx.req.session!.userId);
  }
}
