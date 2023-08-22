import { useFooter } from "../../utils/customHooks/useFooter";

import {
  capitalizeFirstLetter,
  displayCurrentYear,
  checkArrPopulated,
} from "../../utils/utils";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  firstLetterUppercase,
  getPageFromUrl,
} from "../../utils/dataReformatting";
import {} from "../../utils/utils";

export default function Footer() {
  const footer = useFooter();

  console.log("footer", footer);

  const router = useRouter();

  //If on pages page dont add page to url

  const page = router.pathname === "/pages/[slug]" ? "/pages" : "pages";

  return (
    <footer className="bg-white" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>
      <div className="mx-auto max-w-7xl py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="grid grid-cols-2 gap-8 xl:col-span-2">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-base font-medium text-gray-900">
                  {checkArrPopulated(footer) &&
                    firstLetterUppercase(footer[0].value.title)}
                </h3>
                <ul role="list" className="mt-4 space-y-4">
                  {checkArrPopulated(footer) &&
                    footer[0].value.items.map((item) => (
                      <li key={item.title}>
                        <Link
                          href={{
                            pathname: `${page}/${getPageFromUrl(item.url)}`,
                            // query: { id: item.id },
                          }}
                          className="text-base text-gray-500 hover:text-gray-900"
                        >
                          {firstLetterUppercase(item.title)}
                        </Link>
                      </li>
                    ))}
                </ul>
              </div>
              <div className="mt-12 md:mt-0">
                <h3 className="text-base font-medium text-gray-900">
                  {checkArrPopulated(footer) &&
                    firstLetterUppercase(footer[1].value.title)}
                </h3>
                <ul role="list" className="mt-4 space-y-4">
                  {checkArrPopulated(footer) &&
                    footer[1].value.items.map((item) => (
                      <li key={item.name}>
                        <Link
                          href={{
                            pathname: `${page}/${getPageFromUrl(item.url)}`,
                            // query: { id: item.id },
                          }}
                          className="text-base text-gray-500 hover:text-gray-900"
                        >
                          {firstLetterUppercase(item.title)}
                        </Link>
                      </li>
                    ))}
                </ul>
              </div>
            </div>
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-base font-medium text-gray-900">
                  {checkArrPopulated(footer) &&
                    firstLetterUppercase(footer[2].value.title)}
                </h3>
                <ul role="list" className="mt-4 space-y-4">
                  {checkArrPopulated(footer) &&
                    footer[2].value.items.map((item) => (
                      <li key={item.name}>
                        <Link
                          href={{
                            pathname: `${page}/${getPageFromUrl(item.url)}`,
                            // query: { id: item.id },
                          }}
                          className="text-base text-gray-500 hover:text-gray-900"
                        >
                          {firstLetterUppercase(item.title)}
                        </Link>
                      </li>
                    ))}
                </ul>
              </div>
              <div className="mt-12 md:mt-0">
                {/* <h3 className="text-base font-medium text-gray-900">Legal</h3> */}
                <ul role="list" className="mt-4 space-y-4">
                  {/* {footer[4].value.items.map((item) => (
                    <li key={item.name}>
                      <a
                        href={item.href}
                        className="text-base text-gray-500 hover:text-gray-900"
                      >
                        {item.title}
                      </a>
                    </li>
                  ))} */}
                </ul>
              </div>
            </div>
          </div>
          {/* <div className="mt-8 xl:mt-0">
            <h3 className="text-base font-medium text-gray-900">
              Subscribe to our newsletter
            </h3>
            <p className="mt-4 text-base text-gray-500">
              The latest news, articles, and resources, sent to your inbox
              weekly.
            </p>
            <form className="mt-4 sm:flex sm:max-w-md">
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                type="email"
                name="email-address"
                id="email-address"
                autoComplete="email"
                required
                className="w-full min-w-0 appearance-none rounded-md border border-gray-300 bg-white py-2 px-4 text-base text-gray-900 placeholder-gray-500 shadow-sm focus:border-indigo-500 focus:placeholder-gray-400 focus:outline-none focus:ring-indigo-500"
                placeholder="Enter your email"
              />
              <div className="mt-3 rounded-md sm:mt-0 sm:ml-3 sm:flex-shrink-0">
                <button
                  type="submit"
                  className="flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-base font-medium text-white hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Subscribe
                </button>
              </div>
            </form>
          </div> */}
        </div>
        <div className="mt-8 border-t border-gray-200 pt-8 md:flex md:items-center md:justify-between">
          <div className="flex space-x-6 md:order-2">
            {checkArrPopulated(footer) &&
              footer[4].value.map((item) => (
                <Link
                  key={item.name}
                  href={`${page}/${item.name
                    .toLowerCase()
                    .replace(/\s+/g, "-")}`}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <span className="sr-only">{item.name}</span>
                  <item.icon className="h-6 w-6" aria-hidden="true" />
                </Link>
              ))}
          </div>
          <p className="mt-8 text-base text-gray-400 md:order-1 md:mt-0">
            &copy; {displayCurrentYear} &nbsp;
            {checkArrPopulated(footer) &&
              capitalizeFirstLetter(footer[3].value.name)}
            , Inc. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
