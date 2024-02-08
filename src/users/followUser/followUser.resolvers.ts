import client from "../../client";
import { protectedResolver } from "../users.utils";

export default {
    Mutation: {
        followUser: protectedResolver(
            async(_, {username}, {loggedInUser}) => {
                // user가 존재하는지 확인
                const ok = await client.user.findUnique({where: {username}});
                if(!ok) {
                    return {
                        ok:false,
                        error:"That user does not exist!",
                    }
                }
                // 본인의 followint에 상대 user를 추가.
                await client.user.update({
                    where:{
                        id:loggedInUser.id,
                    },
                    data: {
                        following: {
                            connect: {
                                username,
                            }
                        }
                    }
                })
                return {
                    ok: true,
                }
            }
        )
    }
}