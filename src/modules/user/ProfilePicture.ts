// Imports
import { createWriteStream } from "fs";
import { GraphQLUpload } from "graphql-upload";
import { join } from "path";
import { Arg, Mutation, Resolver } from "type-graphql";

// Types
import { IUpload } from "../../types/Upload";

@Resolver()
export class ProfilePictureResolver {
  @Mutation(() => Boolean)
  public async addProfilePicture(@Arg("picture", () => GraphQLUpload)
  {
    createReadStream,
    filename
  }: IUpload): Promise<boolean> {
    return new Promise(async (resolve, reject) =>
      createReadStream()
        .pipe(
          createWriteStream(join(__dirname, `../../../../images/${filename}`))
        )
        .on("finish", () => resolve(true))
        .on("error", () => reject(false))
    );
  }
}
