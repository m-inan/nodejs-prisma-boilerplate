import { Response, Request } from 'express';
import { sign, verify } from 'jsonwebtoken';

import { prisma } from 'generated/prisma';

import { USER_REFRESH_SECRET, USER_JWT_SECRET } from 'config/constants';
import { IUser } from 'interfaces/model';

interface Payload {
	userId: string;
}

export async function refreshToken(req: Request, res: Response) {
	const token: string | null = req.cookies.jid;

	if (token) {
		try {
			const payload = <Payload>verify(token, USER_REFRESH_SECRET);

			const { userId } = payload;

			const user: IUser | null = await prisma.user({ id: userId });

			if (user) {
				// send refresh token client side origin
				sendRefreshToken(res, createRefreshToken(user));

				// pick only safe field
				const { id, name } = user;

				res.send({
					user: {
						id,
						name
					},
					success: true,
					accessToken: createAccessToken(user)
				});
			}
		} catch (error) {
			res.send({ success: false, error });
		}
	} else {
		res.send({ success: false });
	}
}

function createRefreshToken({ id: userId }: IUser) {
	return sign({ userId }, USER_REFRESH_SECRET, {
		expiresIn: '7d'
	});
}

export function sendRefreshToken(res: Response, token: string) {
	res.cookie('jid', token, {
		httpOnly: true
		// domain: 'http://[CLIENT URL].com'
	});
}

function createAccessToken({ id: userId }: IUser): string {
	return sign({ userId }, USER_JWT_SECRET, {
		expiresIn: '15m'
	});
}

export async function getUser(
	req: Request,
	res: Response
): Promise<IUser | null> {
	const authorization: string = req.headers['authorization'] || '';

	if (authorization) {
		try {
			const token = authorization.split(' ')[1];
			const payload = <Payload>verify(token, USER_JWT_SECRET);

			return await prisma.user({ id: payload.userId });
		} catch (err) {
			sendRefreshToken(res, '');
		}
	}

	return null;
}
