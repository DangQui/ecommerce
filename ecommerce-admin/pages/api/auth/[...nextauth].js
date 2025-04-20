import clientPromise from '@/lib/mongodb';
import { MongoDBAdapter } from '@auth/mongodb-adapter';
import NextAuth, { getServerSession } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { mongooseConnect } from '@/lib/mongoose';
import { Admin } from '@/models/Admin';

const adminEmails = ['dangdinhqui2001@gmail.com']; // Email gốc

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      authorization: {
        params: {
          prompt: 'select_account',
        },
      },
    }),
  ],
  adapter: MongoDBAdapter(clientPromise),
  callbacks: {
    session: async ({ session, token, user }) => {
      await mongooseConnect(); // Kết nối MongoDB

      // Kiểm tra nếu email là email gốc
      if (adminEmails.includes(session?.user?.email)) {
        session.user.isAdmin = true; // Đánh dấu là quản trị viên
        return session;
      }

      // Kiểm tra email trong collection Admin
      const admin = await Admin.findOne({ email: session?.user?.email });
      if (admin) {
        session.user.isAdmin = true; // Đánh dấu là quản trị viên
        return session;
      }

      // Nếu không phải quản trị viên
      session.user.isAdmin = false;
      return session;
    },
  },
};

export default NextAuth(authOptions);

export async function isAdminRequest(req, res) {
  await mongooseConnect(); // Kết nối MongoDB
  const session = await getServerSession(req, res, authOptions);

  // Kiểm tra nếu không có session hoặc không phải quản trị viên
  if (!session || !session.user.isAdmin) {
    res.status(401).json({ error: 'Bạn không có quyền truy cập' });
    throw new Error('Không phải quản trị viên');
  }
}