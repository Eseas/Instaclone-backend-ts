import client from "../../client";
import { protectedResolver } from "../users.utils";

export default {
    Mutation: {
        unfollowUser: protectedResolver(
            async(_, {username}, {loggedInUser}) => {
                // user가 존재하는지 확인
                const ok = await client.user.findUnique({where: {username}});
                if(!ok) {
                    return {
                        ok:false,
                        error:"Can't unfollow user.",
                    }
                }
                // 본인의 following에서 상대 user를 제거.
                await client.user.update({
                    where:{
                        id:loggedInUser.id,
                    },
                    data: {
                        following: {
                            disconnect: {
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