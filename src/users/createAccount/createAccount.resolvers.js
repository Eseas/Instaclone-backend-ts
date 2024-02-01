import client from "../../client";
import * as bcrypt from "bcrypt"

export default {
    Mutation : {
        createAccount: async (_, {
            firstName,
            lastName,
            username,
            email,
            password,
        }) => {
            try {
                // check if username or email are already on DB
            const existingUser = await client.user.findFirst({
                where: {
                    OR: [
                        {
                            username,
                        },
                        {
                            email,
                        },
                    ],
                },
            });
            if (existingUser) {
                throw new Error("This username or password is already taken.");
            }
            // hash password 
            // save and return the user
            const uglyPassword = await bcrypt.hash(password, 10);
            const ok = await client.user.create({data: {
                username,
                email,
                firstName,
                lastName,
                password: uglyPassword,
            }});
            if(ok) {
                return {
                    ok: true
                };
            }
            } catch (e) {
                return e;
            }
        },
    }
}