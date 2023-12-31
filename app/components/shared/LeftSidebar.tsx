import { usePathname, useRouter } from "next/navigation";
import { customLogOut } from "@/lib/actions/user.actions";
import { sidebarLinks } from "@/constants";
import Image from "next/image";
import { message } from "antd";
import Link from "next/link";
import { useCookies } from "react-cookie";

const LeftSidebar = () => {
  const [cookies, setCookie] = useCookies();
  const router = useRouter();
  const pathname = usePathname();
  const userId = "jas7809342xsrf";

  const onLogout = async () => {
    customLogOut()
      .then(() => {
        setCookie("uid", "", {
          path: "/",
          maxAge: 259200,
        });
        router.replace("/sign-in");
      })
      .catch((error) => {
        message.error({
          content: error?.message || "Failure",
        });
      });
  };

  return (
    <section className={"custom-scrollbar left-sidebar"}>
      <div className={"flex w-full flex-1 flex-col gap-6 px-6"}>
        {sidebarLinks.map((link) => {
          const isActive =
            (pathname.includes(link.route) && link.route.length > 1) ||
            pathname === link.route;
          if (link.route === "/profile") link.route = `${link.route}/${userId}`;
          return (
            <Link
              href={link.route}
              key={link.label}
              className={`left-sidebar_link ${isActive && "bg-primary-500"}`}
            >
              <Image
                src={link.imgURL}
                alt={link.label}
                width={24}
                height={24}
              />
              <p className={"text-light-1 max-lg:hidden"}>{link.label}</p>
            </Link>
          );
        })}
      </div>

      <div className="mt-10 px-6">
        <div
          className="flex cursor-pointer gap-4 p-4 btn-logout"
          onClick={onLogout}
        >
          <Image src="/assets/logout.svg" alt="logout" width={24} height={24} />
          <p className="text-light-2 max-lg:hidden">Logout</p>
        </div>
      </div>
    </section>
  );
};

export default LeftSidebar;
