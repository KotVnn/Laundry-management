import User from '@/models/user.model';
import '@/models/role.model';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import '@/lib/init';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = await User.findOne(
      {
        $or: [{ username: body.username }, { email: body.username }],
      },
      { _id: 0, username: 1, email: 1, role: 1, password: 1 }
    ).populate('role', { level: 1, title: 1, _id: 0 });
    const isValid = await data.validPassword(body.password);
    if (!data || !isValid) {
      return new Response(JSON.stringify({ error: 'Invalid username or password' }), {
        status: 401,
      });
    } else {
      const JWT_SECRET = process.env.JWT_SECRET!;
      const token = jwt.sign({ ...data._doc, password: undefined }, JWT_SECRET, {
        expiresIn: '30d',
      });
      const cc = await cookies();
      cc.set('accessToken', token, {
        httpOnly: true,
        secure: true,
        path: '/',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 30,
      });
      return new Response(JSON.stringify(data), {
        status: 200,
      });
    }
  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
    });
  }
}
