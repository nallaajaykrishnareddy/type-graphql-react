import { MiddlewareFn } from "type-graphql";
import { MyContext } from "./MyContext";
import { verify } from "jsonwebtoken";

export const isAuth: MiddlewareFn<MyContext> = ({ context }, next) => {
  const bearerToken = context.req.headers["authorization"];

  if (!bearerToken) {
    throw new Error("Your not authenticated");
  }

  try {
    const token = bearerToken.split(" ")[1];
    const payload = verify(token, process.env.ACCESS_TOKEN_SECRET!);
    context.payload = payload as any;
  } catch (err) {
    console.error(err);
    throw new Error("not authenticated");
  }

  return next();
};
