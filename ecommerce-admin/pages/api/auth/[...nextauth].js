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
    async signIn({ user, account, profile }) {
      // Kết nối MongoDB để kiểm tra bảng admins
      await mongooseConnect();

      // Kiểm tra xem email có trong bảng admins không
      const admin = await Admin.findOne({ email: user.email });

      // Nếu email không tồn tại trong bảng admins và cũng không phải tài khoản gốc
      if (!admin && !adminEmails.includes(user.email)) {
        throw new Error('Không có quyền đăng nhập.');
      }

      // Nếu email có trong bảng admins hoặc là tài khoản gốc, cho phép đăng nhập
      return true;
    },
    async session({ session, token, user }) {
      await mongooseConnect();
      if (adminEmails.includes(session?.user?.email)) {
        session.user.isAdmin = true;
        return session;
      }
      const admin = await Admin.findOne({ email: session?.user?.email });
      if (admin) {
        session.user.isAdmin = true;
        return session;
      }
      session.user.isAdmin = false;
      return session;
    },
  },
};

export default NextAuth(authOptions);

export async function isAdminRequest(req, res) {
  await mongooseConnect();
  const session = await getServerSession(req, res, authOptions);
  if (!session || !session.user.isAdmin) {
    res.status(401).json({ error: 'Bạn không có quyền truy cập' });
    throw new Error('Không phải quản trị viên');
  }
}