import { Resolvers } from '../../types';
import bcrypt from 'bcrypt';
import { protectedResolver } from "../users.utils";
import client from '../../client';
import fs from 'fs';

export default {
    Upload: require('graphql-upload-ts').GraphQLUpload,
    Mutation: {
        editProfile: protectedResolver(
            async (
            _,
            { firstName, lastName, username, email, password: newPassword , bio, avatar },
            { loggedInUser },
            ) => {
                let avatarUrl = null;
                if (avatar) {
                    const { filename, createReadStream } = await avatar;
                    const newFileName = `${loggedInUser.id}_${Date.now()}_${filename}`;
                    const readStream = createReadStream();
                    const writeStream = fs.createWriteStream(
                        process.cwd() + '/src/uploads/' + newFileName,
                    );
                    readStream.pipe(writeStream);
                    avatarUrl = `http://localhost:4000/static/${newFileName}`;
                    console.log(avatar);
                }
                let uglyPassword = null;
                if (newPassword) {
                    uglyPassword = await bcrypt.hash(newPassword, 10);
                }
                const isUpdate = await client.user.update({
                    where: { id: loggedInUser.id },
                    data: {
                        firstName,
                        lastName,
                        username,
                        email,
                        bio,
                        ...(uglyPassword && { password: uglyPassword }),
                        ...(avatarUrl && { avatar : avatarUrl }),
                    },
                });
                //console.log(isUpdate);
                if (isUpdate) {
                    return {
                        ok: true,
                    };
                } else {
                    return {
                        ok: false,
                        error: '프로필을 업데이트 할 수 없습니다.',
                    };
                }
            },
        ),
    },
} as Resolvers;