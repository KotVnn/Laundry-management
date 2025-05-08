// lib/auth.ts
import jwt from 'jsonwebtoken';
import {IUser} from "@/interfaces/user.interface";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function verifyToken(token: string): Promise<IUser | null> {
	try {
		return jwt.verify(token, JWT_SECRET) as IUser;
	} catch (err) {
		console.error("Token không hợp lệ:", err);
		return null;
	}
}
