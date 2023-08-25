import React, { useState, useEffect } from "react";
import { getNavigation } from "../../utils/api";
import Link from "next/link";
import { useRouter } from "next/router";
import { navigation } from "./index";

type Props = {};

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Account({}: Props) {
  const [current, setCurrent] = useState(navigation);
  const router = useRouter();

  console.log("router", router);

  const checkIfCurrent = (path) => {
    //loop through navigation and check if any of the hrefs match the current path

    const newCurrent = navigation.map((item) => {
      if (item.href === path) {
        return { ...item, current: true };
      } else {
        return { ...item, current: false };
      }
    });

    setCurrent(newCurrent);
  };

  useEffect(() => {
    checkIfCurrent(router.asPath);
  }, [router.asPath]);

  const link = (item) => {
    //if item href matches the current path dont render a link
    if (item.href === router.asPath) {
      return item.href;
    } else {
      return item.href;
    }
  };

  const currentTitle =
    current.filter((item) => item.current === true)[0]?.title || "Overview";

  return (
    <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
      <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6">
        <nav className="flex flex-1 flex-col-">
          <ul role="list" className="flex flex-1 flex-col gap-y-7 w-1/3">
            <li>
              <ul role="list" className="-mx-2 space-y-1">
                {current.map((item) => (
                  <li key={item.name}>
                    {!item.children ? (
                      <Link
                        href={link(item)}
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
              {" "}
              {currentTitle}
            </h1>
            <div className="flex flex-col gap-y-5">
              <h3
                className=" px-4 py-8 text-lg  text-gray-900 sm:text-xl
                            
              "
              ></h3>
              <div>
                <ul role="list" className="flex flex-1 flex-col gap-y-7"></ul>
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

export const getStaticPaths = async () => {
  const accountPaths = [
    {
      params: {
        slug: "order-history",
      },
    },
    {
      params: {
        slug: "delivery-addresses",
      },
    },
    {
      params: {
        slug: "my-details",
      },
    },
    {
      params: {
        slug: "help",
      },
    },
    {
      params: {
        slug: "signout",
      },
    },
  ];

  return {
    paths: accountPaths,
    fallback: false,
  };
};

// return {
