"use client";

import useSeller from "apps/seller-ui/src/hooks/useSeller";
import useSidebar from "apps/seller-ui/src/hooks/useSidebar";
import { usePathname } from "next/navigation";
import React, { useEffect } from "react";
import Box from "../box";
import { Sidebar } from "./sidebar.styles";
import Link from "next/link";
import Logo from "apps/seller-ui/src/assets/svgs/logo";
import Home from "apps/seller-ui/src/assets/icons/home";
import SidebarItem from "./sidebar.item";
import SidebarMenu from "./sidebar.menu";
import ListOrder from "apps/seller-ui/src/assets/icons/listOrder";
import Payment from "apps/seller-ui/src/assets/icons/payment";
import SquarePlus from "apps/seller-ui/src/assets/icons/squarePlus";
import PackageSearch from "apps/seller-ui/src/assets/icons/packageSearch";
import CalendarPlus from "apps/seller-ui/src/assets/icons/calendarPlus";
import BellPlus from "apps/seller-ui/src/assets/icons/bellPlus";
import Mail from "apps/seller-ui/src/assets/icons/mail";
import Settings from "apps/seller-ui/src/assets/icons/settings";
import Events from "apps/seller-ui/src/assets/icons/events";
import { LogOut, TicketPercent } from "lucide-react";

const SidebarWrapper = () => {
  const { activeSidebar, setActiveSidebar } = useSidebar();
  const pathName = usePathname();
  const { seller } = useSeller();

  useEffect(() => {
    setActiveSidebar(pathName);
  }, [pathName, setActiveSidebar]);

  const getIconColor = (route: string) =>
    activeSidebar === route ? "#0085ff" : "#969696";

  return (
    <Box
      css={{
        height: "100vh",
        zIndex: 200,
        position: "sticky",
        padding: "16px",
        top: "0",
        overflowY: "scroll",
        scrollbarWidth: "none",
      }}
      className="sidebar-wrapper"
    >
      <Sidebar.Header>
        <Box className="flex items-center justify-center m-auto">
          <Link
            href="/"
            className="flex items-center justify-center gap-1 hover:scale-105 transition-all duration-300 p-2 rounded-full"
          >
            <Logo />
            <Box>
              <h3 className="text-slate-100 text-xl font-Poppins font-semibold italic text-center">
                {seller?.shop?.name}
              </h3>
              <h5 className="text-slate-100 text-xs font-medium whitespace-nowrap overflow-hidden text-ellipsis">
                {seller?.shop?.address}
              </h5>
            </Box>
          </Link>
        </Box>
      </Sidebar.Header>
      <div className="block my-3 h-full">
        <Sidebar.Body className="body sidebar">
          <SidebarItem
            title="Dashboard"
            icon={<Home fill={getIconColor("/dashboard")} />}
            href="/dashboard"
            isActive={activeSidebar === "/dashboard"}
          />
          <div className="block my-2">
            <SidebarMenu title="Main Menu">
              <SidebarItem
                isActive={activeSidebar === "/dashboard/order"}
                title="Orders"
                href="/dashboard/order"
                icon={<ListOrder fill={getIconColor("/dashboard/order")} />}
              />
              <SidebarItem
                isActive={activeSidebar === "/dashboard/payments"}
                title="Payments"
                href="/dashboard/payments"
                icon={<Payment fill={getIconColor("/dashboard/payments")} />}
              />
            </SidebarMenu>
            <SidebarMenu title="Products">
              <SidebarItem
                isActive={activeSidebar === "/dashboard/create-product"}
                title="Create Products"
                href="/dashboard/create-product"
                icon={
                  <SquarePlus
                    fill={getIconColor("/dashboard/create-product")}
                  />
                }
              />
              <SidebarItem
                isActive={activeSidebar === "/dashboard/all-products"}
                title="All Products"
                href="/dashboard/all-products"
                icon={
                  <PackageSearch
                    fill={getIconColor("/dashboard/all-products")}
                  />
                }
              />
            </SidebarMenu>
            <SidebarMenu title="Events">
              <SidebarItem
                isActive={activeSidebar === "/dashboard/create-event"}
                title="Create Event"
                href="/dashboard/create-event"
                icon={
                  <CalendarPlus
                    fill={getIconColor("/dashboard/create-event")}
                  />
                }
              />
              <SidebarItem
                isActive={activeSidebar === "/dashboard/all-events"}
                title="All Events"
                href="/dashboard/all-events"
                icon={<Events fill={getIconColor("/dashboard/all-events")} />}
              />
            </SidebarMenu>
            <SidebarMenu title="Controllers">
              <SidebarItem
                isActive={activeSidebar === "/dashboard/inbox"}
                title="Inbox"
                href="/dashboard/inbox"
                icon={<Mail color={getIconColor("/dashboard/inbox")} />}
              />
              <SidebarItem
                isActive={activeSidebar === "/dashboard/settings"}
                title="Settings"
                href="/dashboard/settings"
                icon={<Settings color={getIconColor("/dashboard/settings")} />}
              />
              <SidebarItem
                isActive={activeSidebar === "/dashboard/notifications "}
                title="Notifications"
                href="/dashboard/notifications"
                icon={
                  <BellPlus color={getIconColor("/dashboard/notifications")} />
                }
              />
            </SidebarMenu>
            <SidebarMenu title="Extras">
              <SidebarItem
                isActive={activeSidebar === "/dashboard/discount-codes"}
                title="Discount Codes"
                href="/dashboard/discount-codes"
                icon={
                  <TicketPercent color={getIconColor("/dashboard/discount-codes")} />
                }
              />
              <SidebarItem
                isActive={activeSidebar === "/logout"}
                title="Logout"
                href="/logout"
                icon={<LogOut color={getIconColor("/logout")} />}
              />
            </SidebarMenu>
          </div>
        </Sidebar.Body>
      </div>
    </Box>
  );
};

export default SidebarWrapper;
