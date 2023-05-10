import {
  getNavigation,
  graphqlstorefront,
  getCollectionPageDataByHandle,
} from "../../utils/api";
import CenterPagination from "../../components/pagination/center-pagination";
import {
  GetStaticPaths,
  GetStaticProps,
  GetStaticPropsContext,
} from "next/types";

type Props = {};

import { Fragment, useState, useCallback, useEffect } from "react";
import {
  Dialog,
  Disclosure,
  Menu,
  Popover,
  Tab,
  Transition,
} from "@headlessui/react";
import {
  Bars3Icon,
  MagnifyingGlassIcon,
  QuestionMarkCircleIcon,
  ShoppingBagIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { ChevronDownIcon } from "@heroicons/react/20/solid";

const sortOptions = [
  { name: "Most Popular", href: "#" },
  { name: "Best Rating", href: "#" },
  { name: "Newest", href: "#" },
  { name: "Price: Low to High", href: "#" },
  { name: "Price: High to Low", href: "#" },
];
const filters = [
  {
    id: "category",
    name: "Category",
    options: [
      { value: "tees", label: "Tees" },
      { value: "crewnecks", label: "Crewnecks" },
      { value: "hats", label: "Hats" },
      { value: "bundles", label: "Bundles" },
      { value: "carry", label: "Carry" },
      { value: "objects", label: "Objects" },
    ],
  },
  {
    id: "brand",
    name: "Brand",
    options: [
      { value: "clothing-company", label: "Clothing Company" },
      { value: "fashion-inc", label: "Fashion Inc." },
      { value: "shoes-n-more", label: "Shoes 'n More" },
      { value: "supplies-n-stuff", label: "Supplies 'n Stuff" },
    ],
  },
  {
    id: "color",
    name: "Color",
    options: [
      { value: "white", label: "White" },
      { value: "black", label: "Black" },
      { value: "grey", label: "Grey" },
      { value: "blue", label: "Blue" },
      { value: "olive", label: "Olive" },
      { value: "tan", label: "Tan" },
    ],
  },
  {
    id: "sizes",
    name: "Sizes",
    options: [
      { value: "xs", label: "XS" },
      { value: "s", label: "S" },
      { value: "m", label: "M" },
      { value: "l", label: "L" },
      { value: "xl", label: "XL" },
      { value: "2xl", label: "2XL" },
    ],
  },
];

const products1 = [
  {
    id: 1,
    name: "Focus Paper Refill",
    href: "#",
    price: "$13",
    description: "3 sizes available",
    imageSrc:
      "https://tailwindui.com/img/ecommerce-images/category-page-01-image-card-01.jpg",
    imageAlt:
      "Person using a pen to cross a task off a productivity paper card.",
  },
  {
    id: 2,
    name: "Focus Card Holder",
    href: "#",
    price: "$64",
    description: "Walnut",
    imageSrc:
      "https://tailwindui.com/img/ecommerce-images/category-page-01-image-card-02.jpg",
    imageAlt: "Paper card sitting upright in walnut card holder on desk.",
  },
  {
    id: 3,
    name: "Focus Carry Pouch",
    href: "#",
    price: "$32",
    description: "Heather Gray",
    imageSrc:
      "https://tailwindui.com/img/ecommerce-images/category-page-01-image-card-03.jpg",
    imageAlt:
      "Textured gray felt pouch for paper cards with snap button flap and elastic pen holder loop.",
  },
  // More products...
];
const products2 = [
  {
    id: 7,
    name: "Electric Kettle",
    href: "#",
    price: "$149",
    description: "Black",
    imageSrc:
      "https://tailwindui.com/img/ecommerce-images/category-page-01-image-card-07.jpg",
    imageAlt:
      "Close up of long kettle spout pouring boiling water into pour-over coffee mug with frothy coffee.",
  },
  {
    id: 8,
    name: "Leather Workspace Pad",
    href: "#",
    price: "$165",
    description: "Black",
    imageSrc:
      "https://tailwindui.com/img/ecommerce-images/category-page-01-image-card-08.jpg",
    imageAlt:
      "Extra large black leather workspace pad on desk with computer, wooden shelf, desk organizer, and computer peripherals.",
  },
  {
    id: 9,
    name: "Leather Long Wallet",
    href: "#",
    price: "$118",
    description: "Natural",
    imageSrc:
      "https://tailwindui.com/img/ecommerce-images/category-page-01-image-card-09.jpg",
    imageAlt:
      "Leather long wallet held open with hand-stitched card dividers, full-length bill pocket, and simple tab closure.",
  },
  // More products...
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Example({ products11, products22 }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const [data, setData] = useState(null);

  //extractPaginationDataShopifyStoreFrontApi(products22);

  const extractPaginationDataShopifyStoreFrontApi = (data) => {
    const hasNextPage = data.first.collection.products.pageInfo.hasNextPage;
    const hasPreviousPage =
      data.first.collection.products.pageInfo.hasPreviousPage;

    const edges = data.first.collection.products.edges;

    const totalCount = data.totalProductCount || 5;

    console.log("totalCount", totalCount);

    const reformateedProducts = edges.map((product) => {
      return {
        id: product.node.id,
        name: product.node.title,
        href: "#",
        price: product.node.priceRange.maxVariantPrice.amount,
        description: product.node.description,
        imageSrc: product.node.images.edges[0].node.url,
        imageAlt: product.node.images.edges[0].node.altText,
      };
    });

    // reformatt products data

    return {
      hasNextPage,
      hasPreviousPage,
      edges,
      reformateedProducts,
      totalCount,
    };
  };

  const productsData = extractPaginationDataShopifyStoreFrontApi(products22);

  const [products, setProducts] = useState(
    productsData.reformateedProducts || []
  );

  console.log("products22data", products);

  const fetchNextPageData = useCallback(
    async (data) => {
      const fetchNextPage = async () => {
        const nextPage = await data.next;
        return nextPage;
      };

      const nextPage = await fetchNextPage();

      const reformattedProducts = nextPage.collection.products.edges.map(
        (product) => {
          return {
            id: product.node.id,
            name: product.node.title,
            href: "#",
            price: product.node.priceRange.maxVariantPrice.amount,
            description: product.node.description,
            imageSrc: product.node.images.edges[0].node.url,
            imageAlt: "",
          };
        }
      );

      setProducts(reformattedProducts);
    },
    [products]
  );

  const fetchPreviousPageData = useCallback(
    async (data) => {
      const fetchPreviousPage = async () => {
        const previousPage = await data.previous;
        return previousPage;
      };

      const previousPage = await fetchPreviousPage();

      const reformattedProducts = previousPage.collection.products.edges.map(
        (product) => {
          return {
            id: product.node.id,
            name: product.node.title,
            href: "#",
            price: product.node.priceRange.maxVariantPrice.amount,
            description: product.node.description,
            imageSrc: product.node.images.edges[0].node.url,
            imageAlt: "",
          };
        }
      );

      setProducts(reformattedProducts);

      console.log("previousPage", previousPage);
    },
    [products]
  );

  // const productObjReformatted = products.map((product) => {
  //   return {
  //     id: product.node.id,
  //     name: product.node.title,
  //     href: "#",
  //     price: product.node.priceRange.maxVariantPrice.amount,
  //     description: product.node.description,
  //     imageSrc: product.node.images.edges[0].node.url,
  //   };
  // });

  //if product

  // console.log("products22", productObjReformatted);

  //Pagination Logic

  const currentPage = () => {};

  const totalPages = () => {
    extractPaginationDataShopifyStoreFrontApi(products22);

    //totalPages: Math.ceil(data.first.collection.products.edges.length / 10),

    const totalPages = Math.ceil(
      products22.first.collection.products.edges.length / 10
    );

    console.log("totalPages1", totalPages);
  };

  const handleMoveRight = () => {
    //on click of next button fetch next page
    fetchNextPageData(products22);
  };

  const handleMoveLeft = () => {
    fetchPreviousPageData(products22);
  };

  const gotoPage = () => {
    console.log("gotoPage", gotoPage);
  };

  // console.log(
  //   "paginationData",
  //   extractPaginationDataShopifyStoreFrontApi(products22)
  // );

  return (
    <div className="bg-white">
      <div className="bg-gray-50">
        <div>
          {/* Mobile filter dialog */}
          <Transition.Root show={mobileFiltersOpen} as={Fragment}>
            <Dialog
              as="div"
              className="relative z-40 sm:hidden"
              onClose={setMobileFiltersOpen}
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
                  enterFrom="translate-x-full"
                  enterTo="translate-x-0"
                  leave="transition ease-in-out duration-300 transform"
                  leaveFrom="translate-x-0"
                  leaveTo="translate-x-full"
                >
                  <Dialog.Panel className="relative ml-auto flex h-full w-full max-w-xs flex-col overflow-y-auto bg-white py-4 pb-6 shadow-xl">
                    <div className="flex items-center justify-between px-4">
                      <h2 className="text-lg font-medium text-gray-900">
                        Filters
                      </h2>
                      <button
                        type="button"
                        className="-mr-2 flex h-10 w-10 items-center justify-center rounded-md bg-white p-2 text-gray-400 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        onClick={() => setMobileFiltersOpen(false)}
                      >
                        <span className="sr-only">Close menu</span>
                        <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                      </button>
                    </div>

                    {/* Filters */}
                    <form className="mt-4">
                      {filters.map((section) => (
                        <Disclosure
                          as="div"
                          key={section.name}
                          className="border-t border-gray-200 px-4 py-6"
                        >
                          {({ open }) => (
                            <>
                              <h3 className="-mx-2 -my-3 flow-root">
                                <Disclosure.Button className="flex w-full items-center justify-between bg-white px-2 py-3 text-sm text-gray-400">
                                  <span className="font-medium text-gray-900">
                                    {section.name}
                                  </span>
                                  <span className="ml-6 flex items-center">
                                    <ChevronDownIcon
                                      className={classNames(
                                        open ? "-rotate-180" : "rotate-0",
                                        "h-5 w-5 transform"
                                      )}
                                      aria-hidden="true"
                                    />
                                  </span>
                                </Disclosure.Button>
                              </h3>
                              <Disclosure.Panel className="pt-6">
                                <div className="space-y-6">
                                  {section.options.map((option, optionIdx) => (
                                    <div
                                      key={option.value}
                                      className="flex items-center"
                                    >
                                      <input
                                        id={`filter-mobile-${section.id}-${optionIdx}`}
                                        name={`${section.id}[]`}
                                        defaultValue={option.value}
                                        type="checkbox"
                                        defaultChecked={option.checked}
                                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                      />
                                      <label
                                        htmlFor={`filter-mobile-${section.id}-${optionIdx}`}
                                        className="ml-3 text-sm text-gray-500"
                                      >
                                        {option.label}
                                      </label>
                                    </div>
                                  ))}
                                </div>
                              </Disclosure.Panel>
                            </>
                          )}
                        </Disclosure>
                      ))}
                    </form>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </Dialog>
          </Transition.Root>

          <main>
            <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:max-w-7xl lg:px-8">
              <div className="py-24 text-center">
                <h1 className="text-4xl font-bold tracking-tight text-gray-900">
                  New Arrivals
                </h1>
                <p className="mx-auto mt-4 max-w-3xl text-base text-gray-500">
                  Thoughtfully designed objects for the workspace, home, and
                  travel.
                </p>
              </div>

              {/* Filters */}
              <section
                aria-labelledby="filter-heading"
                className="border-t border-gray-200 pt-6"
              >
                <h2 id="filter-heading" className="sr-only">
                  Product filters
                </h2>

                <div className="flex items-center justify-between">
                  <Menu as="div" className="relative inline-block text-left">
                    <div>
                      <Menu.Button className="group inline-flex justify-center text-sm font-medium text-gray-700 hover:text-gray-900">
                        Sort
                        <ChevronDownIcon
                          className="-mr-1 ml-1 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
                          aria-hidden="true"
                        />
                      </Menu.Button>
                    </div>

                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="absolute left-0 z-10 mt-2 w-40 origin-top-left rounded-md bg-white shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <div className="py-1">
                          {sortOptions.map((option) => (
                            <Menu.Item key={option}>
                              {({ active }) => (
                                <a
                                  href={option.href}
                                  className={classNames(
                                    active ? "bg-gray-100" : "",
                                    "block px-4 py-2 text-sm font-medium text-gray-900"
                                  )}
                                >
                                  {option.name}
                                </a>
                              )}
                            </Menu.Item>
                          ))}
                        </div>
                      </Menu.Items>
                    </Transition>
                  </Menu>

                  <button
                    type="button"
                    className="inline-block text-sm font-medium text-gray-700 hover:text-gray-900 sm:hidden"
                    onClick={() => setMobileFiltersOpen(true)}
                  >
                    Filters
                  </button>

                  <Popover.Group className="hidden sm:flex sm:items-baseline sm:space-x-8">
                    {filters.map((section, sectionIdx) => (
                      <Popover
                        as="div"
                        key={section.name}
                        id="menu"
                        className="relative inline-block text-left"
                      >
                        <div>
                          <Popover.Button className="group inline-flex items-center justify-center text-sm font-medium text-gray-700 hover:text-gray-900">
                            <span>{section.name}</span>
                            {sectionIdx === 0 ? (
                              <span className="ml-1.5 rounded bg-gray-200 px-1.5 py-0.5 text-xs font-semibold tabular-nums text-gray-700">
                                1
                              </span>
                            ) : null}
                            <ChevronDownIcon
                              className="-mr-1 ml-1 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
                              aria-hidden="true"
                            />
                          </Popover.Button>
                        </div>

                        <Transition
                          as={Fragment}
                          enter="transition ease-out duration-100"
                          enterFrom="transform opacity-0 scale-95"
                          enterTo="transform opacity-100 scale-100"
                          leave="transition ease-in duration-75"
                          leaveFrom="transform opacity-100 scale-100"
                          leaveTo="transform opacity-0 scale-95"
                        >
                          <Popover.Panel className="absolute right-0 z-10 mt-2 origin-top-right rounded-md bg-white p-4 shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none">
                            <form className="space-y-4">
                              {section.options.map((option, optionIdx) => (
                                <div
                                  key={option.value}
                                  className="flex items-center"
                                >
                                  <input
                                    id={`filter-${section.id}-${optionIdx}`}
                                    name={`${section.id}[]`}
                                    defaultValue={option.value}
                                    defaultChecked={option.checked}
                                    type="checkbox"
                                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                  />
                                  <label
                                    htmlFor={`filter-${section.id}-${optionIdx}`}
                                    className="ml-3 whitespace-nowrap pr-6 text-sm font-medium text-gray-900"
                                  >
                                    {option.label}
                                  </label>
                                </div>
                              ))}
                            </form>
                          </Popover.Panel>
                        </Transition>
                      </Popover>
                    ))}
                  </Popover.Group>
                </div>
              </section>

              {/* Product grid */}
              <section aria-labelledby="products-heading" className="mt-8">
                <h2 id="products-heading" className="sr-only">
                  Products
                </h2>

                <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
                  {products.map((product) => (
                    <a key={product.id} href={product.href} className="group">
                      <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg sm:aspect-h-3 sm:aspect-w-2">
                        <img
                          src={product.imageSrc}
                          alt={product.imageAlt}
                          className="h-full w-full object-cover object-center group-hover:opacity-75"
                        />
                      </div>
                      <div className="mt-4 flex items-center justify-between text-base font-medium text-gray-900">
                        <h3>{product.name}</h3>
                        <p>{product.price}</p>
                      </div>
                      <p className="mt-1 text-sm italic text-gray-500">
                        {product.description}
                      </p>
                    </a>
                  ))}
                </div>
              </section>

              <section
                aria-labelledby="featured-heading"
                className="relative mt-16 overflow-hidden rounded-lg lg:h-96"
              >
                <div className="absolute inset-0">
                  <img
                    src="https://tailwindui.com/img/ecommerce-images/category-page-01-featured-collection.jpg"
                    alt=""
                    className="h-full w-full object-cover object-center"
                  />
                </div>
                <div
                  aria-hidden="true"
                  className="relative h-96 w-full lg:hidden"
                />
                <div
                  aria-hidden="true"
                  className="relative h-32 w-full lg:hidden"
                />
                <div className="absolute inset-x-0 bottom-0 rounded-bl-lg rounded-br-lg bg-black bg-opacity-75 p-6 backdrop-blur backdrop-filter sm:flex sm:items-center sm:justify-between lg:inset-x-auto lg:inset-y-0 lg:w-96 lg:flex-col lg:items-start lg:rounded-br-none lg:rounded-tl-lg">
                  <div>
                    <h2
                      id="featured-heading"
                      className="text-xl font-bold text-white"
                    >
                      Workspace Collection
                    </h2>
                    <p className="mt-1 text-sm text-gray-300">
                      Upgrade your desk with objects that keep you organized and
                      clear-minded.
                    </p>
                  </div>
                  <a
                    href="#"
                    className="mt-6 flex flex-shrink-0 items-center justify-center rounded-md border border-white border-opacity-25 bg-white bg-opacity-0 px-4 py-3 text-base font-medium text-white hover:bg-opacity-10 sm:ml-8 sm:mt-0 lg:ml-0 lg:w-full"
                  >
                    View the collection
                  </a>
                </div>
              </section>

              <section
                aria-labelledby="more-products-heading"
                className="mt-16 pb-24"
              >
                <h2 id="more-products-heading" className="sr-only">
                  More products
                </h2>

                <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
                  {/* {products2.map((product) => (
                    <a key={product.id} href={product.href} className="group">
                      <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg sm:aspect-h-3 sm:aspect-w-2">
                        <img
                          src={product.imageSrc}
                          alt={product.imageAlt}
                          className="h-full w-full object-cover object-center group-hover:opacity-75"
                        />
                      </div>
                      <div className="mt-4 flex items-center justify-between text-base font-medium text-gray-900">
                        <h3>{product.name}</h3>
                        <p>{product.price}</p>
                      </div>
                      <p className="mt-1 text-sm italic text-gray-500">
                        {product.description}
                      </p>
                    </a>
                  ))} */}
                </div>
              </section>
            </div>
          </main>
        </div>
      </div>
      <CenterPagination
        currentPage={currentPage}
        totalPages={totalPages}
        handleMoveLeft={handleMoveLeft}
        handleMoveRight={handleMoveRight}
        gotoPage={gotoPage}
      />
    </div>
  );
}

const gql = String.raw;
export const getStaticPaths: GetStaticPaths = async () => {
  const producdsQuery = gql`
    query Products {
      products(first: 100) {
        edges {
          node {
            id
            handle
          }
        }
      }
    }
  `;
  const productPath = await graphqlstorefront(producdsQuery);

  const paths = productPath.products.edges.map((edge: any) => {
    return {
      params: {
        slug: edge.node.handle,
      },
    };
  });

  return {
    paths: paths,
    fallback: "blocking",
  };
};
export const getStaticProps: GetStaticProps = async (
  context: GetStaticPropsContext
) => {
  const navigation = await getNavigation();

  const slug = context.params.slug;

  console.log("slug", slug);

  const products = await getCollectionPageDataByHandle(slug && slug);

  console.log("products", products);

  return {
    props: {
      navigation,
      products22: products,
    },
  };
};
