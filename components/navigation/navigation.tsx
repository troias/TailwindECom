import { Fragment, useState, useRef, useCallback, useEffect } from "react";

import { Dialog, Popover, Tab, Transition } from "@headlessui/react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";

import {
  Bars3Icon,
  MagnifyingGlassIcon,
  ShoppingBagIcon,
  UserIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import {
  ExtendedNavigation,
  dummySearchResultsData,
} from "./dummyNavigationData";
import CartModal from "../cart/cartModal";
import { searchMenuQuery } from "../../utils/api";
import { formatSectionName } from "../../utils/dataReformatting";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function Navigation({
  navigation,
}: {
  navigation: ExtendedNavigation;
}) {
  console.log("navigation", navigation);
  const [open, setOpen] = useState(false);

  const [cartModalOpen, setCartModalOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [searchResults, setSearchResults] = useState(dummySearchResultsData);
  const [searchModalHack, setSearchModalHack] = useState(false);

  const searchInputRef = useRef(null);

  const router = useRouter();

  const pageURL = router.pathname === "/pages/[slug]" ? "/pages" : "pages";

  const closeOnLinkChangeHandler = () => {
    const handleChange = () => {
      setOpen(false);
    };
    router.events.on("routeChangeStart", handleChange);
    return () => {
      router.events.off("routeChangeStart", handleChange);
    };
  };

  useEffect(() => {
    if (searchModalOpen) {
      function isDefined<T>(
        value: T
      ): value is Exclude<T, undefined | null | never> {
        return value !== undefined && value !== null;
      }

      if (searchModalOpen) {
        if (isDefined(searchInputRef.current)) {
          searchInputRef.current.focus();
        }
        setSearchModalHack(true);
      }
    }
  }, [searchModalOpen]);

  const performSearchQuery = useCallback(
    async (input: string) => {
      const data = await searchMenuQuery(input);
      setSearchResults(data);
    },
    [searchMenuQuery, setSearchResults]
  );

  const handleSearchInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchInput(e.target.value);
      performSearchQuery(e.target.value);
    },
    [performSearchQuery]
  );

  const searchModalHander = () => {
    setSearchModalOpen(!searchModalOpen);
  };

  const cartModalHander = () => {
    setCartModalOpen(!cartModalOpen);
  };

  return (
    <div>
      <div className="bg-white ">
        {/* Mobile menu */}
        <Transition.Root show={open} as={Fragment}>
          <Dialog
            as="div"
            className="relative z-40 lg:hidden"
            onClose={setOpen}
          >
            <Transition.Child
              as={Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black bg-opacity-25" />
            </Transition.Child>

            <div className="fixed inset-0 z-40 flex">
              <Transition.Child
                as={Fragment}
                enter="transition ease-in-out duration-300 transform"
                enterFrom="-translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="translate-x-0"
                leaveTo="-translate-x-full"
              >
                <Dialog.Panel className="relative flex w-full max-w-xs flex-col overflow-y-auto bg-white pb-12 shadow-xl">
                  <div className="flex px-4 pt-5 pb-2 ">
                    <button
                      type="button"
                      className="-m-2 inline-flex items-center justify-center rounded-md p-2 text-gray-400"
                      onClick={() => setOpen(false)}
                    >
                      <span className="sr-only">Close menu</span>
                      <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                    </button>
                  </div>

                  {/* Links */}
                  <Tab.Group as="div" className="mt-2">
                    <div className="border-b border-gray-200  ">
                      <Tab.List className="-mb-px flex space-x-8 px-4 ">
                        {navigation.categories.map((category) => (
                          <Tab
                            key={category.name}
                            className={({ selected }) =>
                              classNames(
                                selected
                                  ? "text-indigo-600 border-indigo-600"
                                  : "text-gray-900 border-transparent",
                                "flex-1 whitespace-nowrap border-b-2 py-4 px-1 text-base font-medium"
                              )
                            }
                          >
                            {category.name}
                          </Tab>
                        ))}
                      </Tab.List>
                    </div>
                    <Tab.Panels as={Fragment}>
                      {navigation.categories.map((category) => (
                        <Tab.Panel
                          key={category.name}
                          className="space-y-10 px-4 pt-10 pb-8 z-40 "
                        >
                          <div className="space-y-4">
                            {category.featured.map((item, itemIdx) => (
                              <Link
                                href={`/collections/${item.handle}`}
                                onClick={closeOnLinkChangeHandler}
                              >
                                <div
                                  key={itemIdx}
                                  className="group aspect-w-1 aspect-h-1 relative overflow-hidden rounded-md bg-gray-100  "
                                >
                                  <Image
                                    src={item.imageSrc}
                                    alt={item.imageAlt}
                                    className="object-cover object-center group-hover:opacity-75"
                                    width={200}
                                    height={200}
                                  />
                                  <div className="flex flex-col justify-end">
                                    <div className="bg-white bg-opacity-60 p-4 text-base sm:text-sm">
                                      <a
                                        href={item.href}
                                        className="font-medium text-gray-900"
                                      >
                                        <span
                                          className="absolute inset-0"
                                          aria-hidden="true"
                                        />
                                        {item.name}
                                      </a>
                                      <p
                                        aria-hidden="true"
                                        className="mt-0.5 text-gray-700 sm:mt-1"
                                      >
                                        Shop now
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </Link>
                            ))}
                          </div>

                          {category.sections.map((column, columnIdx) => (
                            <div key={columnIdx} className="space-y-10">
                              {column.map((section) => (
                                <Link
                                  href={{
                                    pathname: `/`,

                                    query: {
                                      category: category.name,
                                      section: section.name,
                                    },
                                  }}
                                  onClick={closeOnLinkChangeHandler}
                                >
                                  <div key={section.name}>
                                    <p
                                      id={`${category.id}-${section.id}-heading-mobile`}
                                      className="font-medium text-gray-900"
                                    >
                                      {section.name}
                                    </p>
                                    <ul
                                      role="list"
                                      aria-labelledby={`${category.id}-${section.id}-heading-mobile`}
                                      className="mt-6 flex flex-col space-y-6"
                                    >
                                      {section.items.map((item) => (
                                        <li
                                          key={item.name}
                                          className="flow-root"
                                        >
                                          <a
                                            href={item.href}
                                            className="-m-2 block p-2 text-gray-500"
                                          >
                                            {item.name}
                                          </a>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                </Link>
                              ))}
                            </div>
                          ))}
                        </Tab.Panel>
                      ))}
                    </Tab.Panels>
                  </Tab.Group>

                  <div className="space-y-6 border-t border-gray-200 py-6 px-4 ">
                    {navigation.pages.map((page) => (
                      <div key={page.name} className="flow-root">
                        <a
                          href={page.href}
                          className="-m-2 block p-2 font-medium text-gray-900"
                        >
                          {page.name}
                        </a>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-gray-200 py-6 px-4">
                    <a href="#" className="-m-2 flex items-center p-2">
                      <img
                        src="https://tailwindui.com/img/flags/flag-canada.svg"
                        alt=""
                        className="block h-auto w-5 flex-shrink-0"
                      />
                      <span className="ml-3 block text-base font-medium text-gray-900">
                        CAD
                      </span>
                      <span className="sr-only">, change currency</span>
                    </a>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition.Root>

        {/* Static navbar for desktop */}

        <header className="relative bg-white z-40">
          <nav
            aria-label="Top"
            className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
          >
            <div className="border-b border-gray-200">
              <div className="flex h-16 items-center justify-between">
                <div className="flex flex-1 items-center lg:hidden">
                  <button
                    type="button"
                    className="-ml-2 rounded-md bg-white p-2 text-gray-400"
                    onClick={() => setOpen(true)}
                  >
                    <span className="sr-only ">Open menu</span>
                    <Bars3Icon className="h-6 w-6" aria-hidden="true" />
                  </button>

                  {searchModalOpen ? (
                    <div className="flex items-center justify-center px-6">
                      <input
                        type="text"
                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm placeholder-gray-400"
                        placeholder="Search..."
                        ref={searchInputRef}
                        onChange={handleSearchInputChange}
                        value={searchInput}
                      />
                    </div>
                  ) : (
                    <button className="ml-6  p-2 text-gray-400 hover:text-gray-500">
                      <MagnifyingGlassIcon
                        className="h- w-6"
                        aria-hidden="true"
                        onClick={searchModalHander}
                      />
                    </button>
                  )}
                  <Popover.Group className="  ">
                    <div className="flex h-full space-x-8 justify-end">
                      <Popover key="" className="flex justify-center ">
                        {({ open }) => (
                          <>
                            <Popover.Button
                              className={classNames(
                                (open && !searchModalOpen) ||
                                  (!open && !searchModalOpen)
                                  ? "text-indigo-600"
                                  : "text-gray-700 hover:text-gray-800 hidden",
                                "relative z-10 text-sm font-medium transition-colors duration-200 ease-out"
                              )}
                              onClick={searchModalHander}
                            >
                              <a
                                href="#"
                                className="ml-6 hidden p-2 text-gray-400 hover:text-gray-500 lg:block"
                                onClick={searchModalHander}
                              >
                                <span className="sr-only flex justify-center items-center">
                                  Search
                                </span>
                              </a>

                              <span
                                className={classNames(
                                  open ? "bg-indigo-600" : "",
                                  "absolute inset-x-0 bottom-0 h-0.5 transition-colors duration-200 ease-out sm:mt-5 sm:translate-y-px sm:transform"
                                )}
                                aria-hidden="true"
                              />
                            </Popover.Button>

                            <Transition
                              as={Fragment}
                              enter="transition ease-out duration-200"
                              enterFrom="opacity-0"
                              enterTo="opacity-100"
                              leave="transition ease-in duration-150"
                              leaveFrom="opacity-100"
                              leaveTo="opacity-0"
                              show={searchModalOpen && searchModalHack}
                            >
                              <Popover.Panel className="absolute inset-x-0 top-full">
                                {/* Presentational element used to render the bottom shadow, if we put the shadow on the actual panel it pokes out the top, so we use this shorter element to hide the top of the shadow */}
                                <div
                                  className="absolute inset-0 top-1/2 shadow"
                                  aria-hidden="true"
                                />

                                {/* Panel contents */}
                                <div className="relative bg-white">
                                  <div className="mx-auto max-w-7xl px-8">
                                    <div className="pt-4 pb-2 flex justify-end">
                                      <XMarkIcon
                                        className="h-6 w-6"
                                        aria-hidden="true"
                                        onClick={searchModalHander}
                                      />
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8 py-8">
                                      {/* Loop through the search results and render each product */}

                                      {searchResults.results &&
                                        searchResults.results.map(
                                          (product, index) => (
                                            <div
                                              key={index}
                                              className="rounded-lg overflow-hidden bg-gray-100"
                                            >
                                              <Link
                                                href={`/products/${product.handle}`}
                                                id={product.id}
                                              >
                                                <Image
                                                  className="object-cover w-full h-48"
                                                  src={product.imageSrc}
                                                  alt={product.imageAlt}
                                                  width={200}
                                                  height={200}
                                                />
                                              </Link>
                                              <div className="p-4">
                                                <a
                                                  href={product.href}
                                                  className="block font-medium text-gray-900 mb-2"
                                                >
                                                  {product.name}
                                                </a>
                                                <div className="flex justify-between items-center">
                                                  <span className="text-gray-600">
                                                    {/* ${product.price} */}
                                                  </span>
                                                  {product.tags &&
                                                    product.tags.length > 0 && (
                                                      <div className="flex flex-wrap">
                                                        {product.tags.map(
                                                          (tag, index) => (
                                                            <span
                                                              key={index}
                                                              className="text-sm font-medium bg-gray-300 rounded-full px-2 py-1 mr-2 mb-2"
                                                            >
                                                              {tag}
                                                            </span>
                                                          )
                                                        )}
                                                      </div>
                                                    )}
                                                </div>
                                              </div>
                                            </div>
                                          )
                                        )}
                                    </div>
                                  </div>
                                </div>
                              </Popover.Panel>
                            </Transition>
                          </>
                        )}
                      </Popover>
                    </div>
                  </Popover.Group>
                </div>

                {/* Flyout menus */}
                <Popover.Group className="hidden lg:block lg:flex-1 lg:self-stretch">
                  <div className="flex h-full space-x-8">
                    {navigation.categories.map((category) => (
                      <Popover
                        key={category.name}
                        className="flex justify-center items-center"
                      >
                        {({ open, close }) => (
                          <>
                            <div className="relative flex ">
                              <Popover.Button
                                className={classNames(
                                  open
                                    ? "text-indigo-600 "
                                    : "text-gray-700 hover:text-gray-800",
                                  "relative z-10 flex items-center justify-center text-sm font-medium transition-colors duration-200 ease-out"
                                )}
                                onClick={() => {
                                  setSearchModalOpen(false);
                                }}
                              >
                                {category.name}
                                <span
                                  className={classNames(
                                    open && open ? "bg-indigo-600 " : "",
                                    "absolute inset-x-0 bottom-0 h-0.5 transition-colors duration-200 ease-out sm:mt-5 sm:translate-y-px sm:transform  "
                                  )}
                                  aria-hidden="true"
                                />
                              </Popover.Button>
                            </div>

                            <Transition
                              as={Fragment}
                              enter="transition ease-out duration-200"
                              enterFrom="opacity-0"
                              enterTo="opacity-100"
                              leave="transition ease-in duration-150"
                              leaveFrom="opacity-100"
                              leaveTo="opacity-0"
                              show={open}
                            >
                              <Popover.Panel className="absolute inset-x-0 top-full  ">
                                <div
                                  className="absolute inset-0 top-1/2   shadow "
                                  aria-hidden="true"
                                />

                                <div className="relative bg-white">
                                  <div className="mx-auto max-w-7xl px-8">
                                    <div className="flex pt-4 justify-end">
                                      <button
                                        type="button"
                                        className="-m-2 inline-flex items-center justify-center rounded-md pt-2 text-gray-400"
                                        onClick={() => setOpen(false)}
                                      >
                                        <span className="sr-only">
                                          Close menu
                                        </span>
                                        <XMarkIcon
                                          className="h-6 w-6"
                                          aria-hidden="true"
                                        />
                                      </button>
                                    </div>
                                    <div className="grid grid-cols-2 gap-y-10 gap-x-8 py-12">
                                      <div className="grid grid-cols-2 grid-rows-1 gap-8 text-sm">
                                        {category.featured.map(
                                          (item, itemIdx) => (
                                            <Link
                                              href={`/collections/${item.handle}`}
                                              onClick={() => {
                                                close();
                                              }}
                                            >
                                              <div
                                                key={item.name}
                                                className={classNames(
                                                  itemIdx === 0
                                                    ? "col-span-2 aspect-w-2 h-full"
                                                    : "h-full aspect-w-1",
                                                  "group relative aspect-w-1 aspect-h-1 rounded-md bg-gray-100 overflow-hidden"
                                                )}
                                              >
                                                <Image
                                                  src={item.imageSrc}
                                                  alt={item.imageAlt}
                                                  width={700}
                                                  height={700}
                                                  className="object-cover object-center group-hover:opacity-75"
                                                />
                                                <div className="flex flex-col justify-end">
                                                  <div className="bg-white bg-opacity-60 p-4 text-sm">
                                                    <Link
                                                      href={`/collections/${item.handle}`}
                                                      className="font-medium text-gray-900"
                                                    >
                                                      <span
                                                        className="absolute inset-0"
                                                        aria-hidden="true"
                                                      />
                                                      {item.name}
                                                    </Link>
                                                    <p
                                                      aria-hidden="true"
                                                      className="mt-0.5 text-gray-700 sm:mt-1"
                                                    >
                                                      Shop now
                                                    </p>
                                                  </div>
                                                </div>
                                              </div>
                                            </Link>
                                          )
                                        )}
                                      </div>
                                      <div className="grid grid-cols-3 gap-y-10 gap-x-8 text-sm text-gray-500">
                                        {category.sections.map(
                                          (column, columnIdx) => (
                                            <div
                                              key={columnIdx}
                                              className="space-y-10"
                                            >
                                              {column.map((section) => (
                                                <div key={section.name}>
                                                  <p
                                                    id={`${category.id}-${section.id}-heading`}
                                                    className="font-medium text-gray-900"
                                                  >
                                                    {formatSectionName(section)}
                                                  </p>
                                                  <ul
                                                    role="list"
                                                    aria-labelledby={`${category.id}-${section.id}-heading`}
                                                    className="mt-4 space-y-4"
                                                  >
                                                    {section.items.map(
                                                      (item) => (
                                                        <li
                                                          key={item.name}
                                                          className="flex"
                                                        >
                                                          <Link
                                                            href={`/collections/${item.name}`}
                                                            className="hover:text-gray-800"
                                                            onClick={() => {
                                                              close();
                                                            }}
                                                          >
                                                            {formatSectionName(
                                                              item
                                                            )}
                                                          </Link>
                                                        </li>
                                                      )
                                                    )}
                                                  </ul>
                                                </div>
                                              ))}
                                            </div>
                                          )
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </Popover.Panel>
                            </Transition>
                          </>
                        )}
                      </Popover>
                    ))}

                    {navigation.pages.map((page) => (
                      <Link
                        key={page.name}
                        href={{
                          pathname: `${pageURL}/${page.name}`.toLowerCase(),
                          // query: { id: item.id },
                        }}
                        className="flex items-center text-sm font-medium text-gray-700 hover:text-gray-800"
                      >
                        {page.name}
                      </Link>
                    ))}
                  </div>
                </Popover.Group>

                {/* Logo */}
                <a href="/" className="flex">
                  <span className="sr-only">Grey-Mon</span>
                  <img className="h-12 w-auto" src="/Logo.svg" alt="" />
                </a>

                <div className="flex flex-1 items-center justify-end">
                  {/* Search */}

                  <Popover.Group className="hidden lg:block lg:flex-1 lg:self-stretch ">
                    <div className="flex h-full space-x-8 justify-end">
                      <Popover key="" className="flex justify-center ">
                        {({ open }) => (
                          <>
                            {searchModalOpen && (
                              <input
                                type="text"
                                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm placeholder-gray-400"
                                placeholder="Search..."
                                ref={searchInputRef}
                                onChange={handleSearchInputChange}
                                value={searchInput}
                              />
                            )}

                            <Popover.Button
                              className={classNames(
                                (open && !searchModalOpen) ||
                                  (!open && !searchModalOpen)
                                  ? "text-indigo-600"
                                  : "text-gray-700 hover:text-gray-800 hidden",
                                "relative z-10 text-sm font-medium transition-colors duration-200 ease-out"
                              )}
                              onClick={searchModalHander}
                            >
                              <a
                                href="#"
                                className="ml-6 hidden p-2 text-gray-400 hover:text-gray-500 lg:block"
                                onClick={searchModalHander}
                              >
                                <span className="sr-only flex justify-center items-center">
                                  Search
                                </span>
                                <MagnifyingGlassIcon
                                  className="h-6 w-6"
                                  aria-hidden="true"
                                  onClick={searchModalHander}
                                />
                              </a>

                              <span
                                className={classNames(
                                  open ? "bg-indigo-600" : "",
                                  "absolute inset-x-0 bottom-0 h-0.5 transition-colors duration-200 ease-out sm:mt-5 sm:translate-y-px sm:transform"
                                )}
                                aria-hidden="true"
                              />
                            </Popover.Button>

                            <Transition
                              as={Fragment}
                              enter="transition ease-out duration-200"
                              enterFrom="opacity-0"
                              enterTo="opacity-100"
                              leave="transition ease-in duration-150"
                              leaveFrom="opacity-100"
                              leaveTo="opacity-0"
                              show={searchModalOpen && searchModalHack}
                            >
                              <Popover.Panel className="absolute inset-x-0 top-full">
                                {/* Presentational element used to render the bottom shadow, if we put the shadow on the actual panel it pokes out the top, so we use this shorter element to hide the top of the shadow */}
                                <div
                                  className="absolute inset-0 top-1/2 shadow"
                                  aria-hidden="true"
                                />

                                {/* Panel contents */}
                                <div className="relative bg-white">
                                  <div className="mx-auto max-w-7xl px-8">
                                    <div className="pt-4 pb-2 flex justify-end">
                                      <XMarkIcon
                                        className="h-6 w-6"
                                        aria-hidden="true"
                                        onClick={searchModalHander}
                                      />
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8 py-8">
                                      {/* Loop through the search results and render each product */}

                                      {searchResults.results &&
                                        searchResults.results.map(
                                          (product, index) => (
                                            <div
                                              key={index}
                                              className="rounded-lg overflow-hidden bg-gray-100"
                                            >
                                              <Link
                                                href={`/products/${product.handle}`}
                                                id={product.id}
                                              >
                                                <Image
                                                  className="object-cover w-full h-48"
                                                  src={product.imageSrc}
                                                  alt={product.imageAlt}
                                                  width={500}
                                                  height={500}
                                                />
                                              </Link>
                                              <div className="p-4">
                                                <a
                                                  href={product.href}
                                                  className="block font-medium text-gray-900 mb-2"
                                                >
                                                  {product.name}
                                                </a>
                                                <div className="flex justify-between items-center">
                                                  <span className="text-gray-600">
                                                    {/* ${product.price} */}
                                                  </span>
                                                  {product.tags.length > 0 && (
                                                    <div className="flex flex-wrap">
                                                      {product.tags.map(
                                                        (tag, index) => (
                                                          <span
                                                            key={index}
                                                            className="text-sm font-medium bg-gray-300 rounded-full px-2 py-1 mr-2 mb-2"
                                                          >
                                                            {tag}
                                                          </span>
                                                        )
                                                      )}
                                                    </div>
                                                  )}
                                                </div>
                                              </div>
                                            </div>
                                          )
                                        )}
                                    </div>
                                  </div>
                                </div>
                              </Popover.Panel>
                            </Transition>
                          </>
                        )}
                      </Popover>
                    </div>
                  </Popover.Group>

                  {/* Account */}
                  <div className="ml-4 flow-root lg:ml-6 bg-black"></div>
                  <a
                    href="#"
                    className="p-2 text-gray-400 hover:text-gray-500 lg:ml-4"
                  >
                    <span className="sr-only">Account</span>
                    <UserIcon className="h-6 w-6" aria-hidden="true" />
                  </a>

                  {/* Cart */}
                  <div className="ml-4 flow-root lg:ml-6">
                    <a href="#" className="group -m-2 flex items-center p-2">
                      <ShoppingBagIcon
                        className="h-6 w-6 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
                        aria-hidden="true"
                        onClick={cartModalHander}
                      />
                      <span className="ml-2 text-sm font-medium text-gray-700 group-hover:text-gray-800">
                        0
                      </span>
                      <span className="sr-only">items in cart, view bag</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </nav>
        </header>
      </div>
      <Transition
        appear
        show={cartModalOpen}
        as={Fragment}
        enter="transition ease-out duration-300"
        enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
        enterTo="opacity-100 translate-y-0 sm:scale-100"
        leave="transition ease-in duration-200"
      >
        <Dialog
          as="div"
          className="fixed inset-0 z-50 "
          onClose={cartModalHander}
        >
          <CartModal handler={cartModalHander} />
        </Dialog>
      </Transition>
    </div>
  );
}
