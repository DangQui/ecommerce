import { useSession, signIn, signOut } from "next-auth/react";
import Nav from "@/components/Nav";
import { useState } from "react";
import Logo from "./Logo";
import { useNotification } from "@/context/NotificationContext";

export default function Layout({ children }) {
  const [showNav, setShowNav] = useState(false);
  const { data: session } = useSession();
  const notificationContext = useNotification();
  const notification = notificationContext?.notification || null;

  if (!session) {
    return (
      <div className="bg-slate-50 w-screen h-screen flex items-center">
        <div className="text-center w-full">
          <button onClick={() => signIn("google")} className="bg-white p-2 px-4 rounded-lg">
            Đăng nhập với Google
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="block flex md:hidden items-center pl-4">
        <button onClick={() => setShowNav(true)}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="size-6"
          >
            <path
              fillRule="evenodd"
              d="M3 6.75A.75.75 0 0 1 3.75 6h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 6.75ZM3 12a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 12Zm0 5.25a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75a.75.75 0 0 1-.75-.75Z"
              clipRule="evenodd"
            />
          </svg>
        </button>
        <div className="flex grow justify-center mr-6 mt-4">
          <Logo />
        </div>
      </div>
      <div className="flex relative">
        <Nav show={showNav} onClose={() => setShowNav(false)} />
        {/* Overlay trên mobile */}
        {showNav && (
          <div
            className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setShowNav(false)}
          ></div>
        )}
        <div className="flex-grow rounded-lg p-4">
          {notification && (
            <div
              className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg text-white ${
                notification.type === "success" ? "bg-green-500" : "bg-red-500"
              }`}
            >
              {notification.message}
            </div>
          )}
          {children}
        </div>
      </div>
    </div>
  );
}