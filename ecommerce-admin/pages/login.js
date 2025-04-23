import { useEffect, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Layout from "@/components/Layout";

export default function LoginPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { error, callbackUrl } = router.query;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Nếu đã đăng nhập, chuyển hướng về trang chính
  useEffect(() => {
    if (status === "authenticated") {
      router.push(callbackUrl || "/");
    }
  }, [status, router, callbackUrl]);

  const handleCredentialsLogin = async (e) => {
    e.preventDefault();
    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
      callbackUrl: callbackUrl || "/",
    });

    if (res?.error) {
      alert(res.error); // Hiển thị lỗi nếu đăng nhập thất bại
    } else {
      router.push(res.url); // Chuyển hướng nếu đăng nhập thành công
    }
  };

  const handleGoogleLogin = async () => {
    await signIn("google", { callbackUrl: callbackUrl || "/" });
  };

  if (status === "loading") {
    return <div>Đang tải...</div>;
  }

  return (
    <Layout>
      <div className="max-w-md mx-auto mt-10">
        <h1 className="text-2xl font-bold mb-4">Đăng nhập</h1>

        {/* Hiển thị lỗi nếu có */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {error === "OAuthAccountNotLinked"
              ? "Tài khoản Google này không được liên kết với hệ thống. Vui lòng sử dụng email/mật khẩu để đăng nhập hoặc liên hệ admin."
              : "Đã có lỗi xảy ra: " + error}
          </div>
        )}

        {/* Form đăng nhập bằng email/mật khẩu */}
        <form onSubmit={handleCredentialsLogin} className="mb-4">
          <div className="mb-4">
            <label className="block mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-sm p-2"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1">Mật khẩu</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-sm p-2"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded-sm"
          >
            Đăng nhập
          </button>
        </form>

        {/* Nút đăng nhập bằng Google */}
        <button
          onClick={handleGoogleLogin}
          className="w-full bg-red-500 text-white py-2 rounded-sm"
        >
          Đăng nhập bằng Google
        </button>
      </div>
    </Layout>
  );
}