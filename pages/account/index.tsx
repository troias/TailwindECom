import React from "react";
import { getNavigation } from "../../utils/api";
import { Disclosure } from "@headlessui/react";
import { ChevronRightIcon } from "@heroicons/react/20/solid";
import Link from "next/link";

type Props = {};

const navigation = [
  { name: "Overview", href: "#", current: true },
  { name: "Order history", href: "/order-history", current: false },
  { name: "Delivery addresses", href: "/delivery-addresses", current: false },

  { name: "My details", href: "/my-details", current: false },
  { name: "Help", href: "/help", current: false },
  { name: "Sign out", href: "account/signout", current: false },
];

const overview = [
  {
    name: "Addresses",
    href: "#",
    subheading: "Default delivery address",
    data: "31 Greensboro Street",
    current: true,
  },
  {
    name: "Details",
    href: "#",
    subheading: "Your details",
    data: "troyflavel@gmail.com",
    current: false,
  },
  {
    name: "Get help",
    href: "#",
    subheading: "Default delivery address",
    children: [
      { name: "Delivery", href: "#" },
      { name: "Contact Us", href: "#" },
    ],
    current: false,
  },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function index({}: Props) {
  return (
    <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
      <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6">
        <nav className="flex flex-1 flex-col-">
          <ul role="list" className="flex flex-1 flex-col gap-y-7 w-1/3">
            <li>
              <ul role="list" className="-mx-2 space-y-1">
                {navigation.map((item) => (
                  <li key={item.name}>
                    {!item.children ? (
                      <Link
                        href={item.href}
                        className={classNames(
                          item.current ? "bg-gray-50" : "hover:bg-gray-50",
                          "block rounded-md py-2 pr-2 pl-10 text-sm leading-6 font-semibold text-gray-700"
                        )}
                      >
                        {item.name}
                      </Link>
                    ) : null}
                  </li>
                ))}
              </ul>
            </li>
          </ul>
          <div className="w-2/3 h-96 border-x-1 border-gray-100">
            <h1 className="text-base bg-gray-100  font-semibold text-gray-900 sm:text-xl py-8 pl-8">
              Account Page Overview
            </h1>
            <div className="flex flex-col gap-y-5">
              <h3
                className=" px-4 py-8 text-lg  text-gray-900 sm:text-xl

              "
              >
                Welcome to your account overview, a snapshot of your account and
                recent activities. Click for a more detailed view of your
                account information.
              </h3>
              <div>
                <ul role="list" className="flex flex-1 flex-col gap-y-7">
                  {overview.map((item) => (
                    <li key={item.name} className="grid ">
                      {!item.children ? (
                        <div className="grid gap-4  border-2 rounded-xl border-gray-200 px-4 py-4">
                          <div className="flex justify-between">
                            <h4 className="text-lg"> {item.name}</h4>
                            <Link
                              className="text-base hover:text-gray-700 text-blue-500 mb-1 border-b-2 border-blue-500"
                              href={item.href}
                            >
                              View
                            </Link>
                          </div>
                          <div className="grid gap-4">
                            <h4 className="text-lg font-semibold">
                              {item.subheading}
                            </h4>
                            <p className="text-base">{item.data}</p>
                          </div>
                        </div>
                      ) : (
                        <div className="grid gap-4  border-2 rounded-xl border-gray-200 px-4 py-4">
                          <div className="flex justify-between">
                            <h4 className="text-lg"> {item.name}</h4>
                          </div>
                          <div className="grid gap-2">
                            <ul role="list" className="flex flex-col gap-y-2">
                              {item.children.map((child) => (
                                <li key={child.name}>
                                  <div className="flex justify-between">
                                    <h4 className="text-lg hover:text-gray-700 text-blue-500 mb-1 border-b-2 border-blue-500">
                                      {child.name}
                                    </h4>
                                  </div>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </nav>
      </div>
    </div>
  );
}

export const getStaticProps = async (ctx) => {
  //get navigation

  const navigation = await getNavigation();

  // console.log("navigation", navigation);

  return {
    props: {
      navigation,
    },
  };
};
