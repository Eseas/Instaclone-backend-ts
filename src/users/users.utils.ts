import Jwt, { JwtPayload } from "jsonwebtoken";
import client from "../client";

export const getUser = async(token) => {
    try {
        if(!token) {
            return null;
        }
        const { id } = (await Jwt.verify(
            token,
            process.env.SECRET_KEY as string,
          )) as JwtPayload;
        const user = await client.user.findUnique({where: {id}});
        if(user) {
            return user;
        } else {
            return null;
        }
    } catch (e) {
        console.log(e)
        return null;
    }
}

export function protectedResolver(ourResolver) {
    return function(root, args, context,info) {
        if(!context.loggedInUser) {
            return {
                ok:false,
                error:"Please login to perform this action.",
            };
        }
        return ourResolver(root, args, context, info);
    }
}