// Imports
import { Ctx, Mutation, Resolver } from "type-graphql";

// Utils
import { Logger } from "../../utils/Logger";

// Types
import { IContext } from "../../types/Context";

@Resolver()
export class LogoutResolver {
  @Mutation(() => Boolean)
  public async logout(@Ctx() ctx: IContext): Promise<boolean> {
    return new Promise((res, rej) =>
      ctx.req.session!.destroy(err => {
        if (err) {
          Logger.error(err);
          return rej(false);
        }

        ctx.res.clearCookie("qid");

        return res(true);
      })
    );
  }
}
