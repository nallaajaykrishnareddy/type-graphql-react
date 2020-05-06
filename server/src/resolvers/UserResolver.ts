import "dotenv/config";
import {
  Resolver,
  Query,
  Mutation,
  Arg,
  ObjectType,
  Field,
  Ctx,
  UseMiddleware,
  Int,
} from "type-graphql";
import { User } from "../entity/User";
import { hash, compare } from "bcryptjs";
import { MyContext } from "src/utils/MyContext";
import { createRefreshAccessToken, createAccessToken } from "../auth/auth";
import { isAuth } from "../utils/IsAuth";
import { sendRefreshToken } from "../utils/SendRefreshToken";
import { getConnection } from "typeorm";
import { verify } from "jsonwebtoken";

@ObjectType()
class LoginResponse {
  @Field()
  accessToken: string;
  @Field(() => User)
  user: User;
}

@Resolver()
export class UserResolver {
  @Query(() => String)
  hello() {
    return "Hi!";
  }

  @Query(() => String)
  @UseMiddleware(isAuth)
  bye(@Ctx() { payload }: MyContext) {
    return `your user id: ${payload!.userId}`;
  }

  @Query(() => [User])
  async users() {
    return await User.find();
  }

  @Query(() => User, { nullable: true })
  @UseMiddleware(isAuth)
  async me(@Ctx() context: MyContext) {
    const bearerToken = context.req.headers["authorization"];

    if (!bearerToken) {
      return null;
    }

    try {
      const token = bearerToken.split(" ")[1];
      const payload: any = verify(token, process.env.ACCESS_TOKEN_SECRET!);
      return await User.findOne(payload.userId);
    } catch (err) {
      console.error(err);
      return null;
    }
    return null;
  }

  @Mutation(() => Boolean)
  async logout(@Ctx() { res }: MyContext) {
    sendRefreshToken(res, "");
    return true;
  }

  @Mutation(() => Boolean)
  async revokeRefreshTokensForUser(@Arg("userId", () => Int) userId: number) {
    await getConnection()
      .getRepository(User)
      .increment({ id: userId }, "tokenVersion", 1);

    return true;
  }

  @Mutation(() => LoginResponse)
  async login(
    @Arg("email") email: string,
    @Arg("password") pasword: string,
    @Ctx() { res }: MyContext
  ): Promise<LoginResponse> {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      throw new Error("User not found");
    }

    const validPassword = await compare(pasword, user.password);

    if (!validPassword) {
      throw new Error("Not a valid password");
    }

    sendRefreshToken(res, createRefreshAccessToken(user));

    return {
      accessToken: createAccessToken(user),
      user,
    };
  }

  @Mutation(() => Boolean)
  async register(
    @Arg("email") email: string,
    @Arg("password") password: string
  ) {
    const hashedPassword = await hash(password, 12);

    try {
      await User.insert({
        email,
        password: hashedPassword,
      });
    } catch (err) {
      console.error(err);
      return false;
    }

    return true;
  }
}
