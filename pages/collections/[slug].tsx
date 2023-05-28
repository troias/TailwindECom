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

import {
  Fragment,
  useState,
  useCallback,
  useReducer,
  useMemo,
  useEffect,
} from "react";
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

import { fetchCollectionPage } from "../../utils/api";
import { getVariantOptions } from "../../utils/dataReformatting";
import { de } from "date-fns/locale";
import { set } from "date-fns";

const sortOptions = [
  { name: "Most Popular", href: "#", checked: false },
  { name: "Best Rating", href: "#", checked: false },
  { name: "Newest", href: "#", checked: false },
  { name: "Price: Low to High", href: "#", checked: false },
  { name: "Price: High to Low", href: "#", checked: false },
];
const filters = [
  {
    id: "amountPerPage",
    name: "Amount Per Page",
    options: [
      { value: "6", label: "6", checked: false },
      { value: "12", label: "12", checked: false },
      { value: "24", label: "24", checked: false },
      { value: "48", label: "48", checked: false },
    ],
  },
  {
    id: "brand",
    name: "Brand",
    options: [
      { value: "clothing-company", label: "Clothing Company", checked: false },
      { value: "fashion-inc", label: "Fashion Inc.", checked: false },
      { value: "shoes-n-more", label: "Shoes 'n More", checked: false },
      { value: "supplies-n-stuff", label: "Supplies 'n Stuff", checked: false },
    ],
  },
  {
    id: "color",
    name: "Color",
    options: [
      { value: "white", label: "White", checked: false },
      { value: "black", label: "Black", checked: false },
      { value: "grey", label: "Grey", checked: false },
      { value: "blue", label: "Blue", checked: false },
      { value: "olive", label: "Olive", checked: false },
      { value: "tan", label: "Tan", checked: false },
    ],
  },
  {
    id: "sizes",
    name: "Sizes",
    options: [
      { value: "xs", label: "XS", checked: false },
      { value: "s", label: "S", checked: false },
      { value: "m", label: "M", checked: false },
      { value: "l", label: "L", checked: false },
      { value: "xl", label: "XL", checked: false },
      { value: "2xl", label: "2XL", checked: false },
    ],
  },
];

type PaginationData = {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  edges: any[];
  reformateedProducts: FormattedProduct[];
  totalCount: number;
};

type FormattedProduct = {
  id: string;
  name: string;
  href: string;
  price: string;
  description: string;
  vendor: string;
  variants: {
    id: string;
    options: { value: string; label: string }[];
  };

  imageSrc: string;
  imageAlt: string;
};

type UnformattedProduct = {
  node: {
    id: string;
    name: string;
    title: string;
    priceRange: { maxVariantPrice: { amount: string } };
    description: string;
    vendor: string;
    variants: {
      edges: { node: { selectedOptions: { name: string; value: string } } }[];
    };
    images: { edges: { node: { url: string; altText: string } }[] };
  };
};

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}

type Products22 = {
  first: any;
  next: any;
  previous: any;
  totalProductCount: any;
};

// Initial filterState

const initialState = {
  sort: sortOptions.map((option) => ({
    name: option.name,
    href: option.href,
    current: false,
  })),
  filters: filters.map((filter) => ({
    id: filter.id,
    name: filter.name,
    options: filter.options.map((option) => ({
      value: option.value,
      label: option.label,
      checked: false,
    })),
  })),
  filteredBrandOptions: [],
  filteredProducts: [],
  products: [],
};

// Reducer function to handle state updates
const reducer = (
  state = initialState,
  action: { type: string; payload: { optionValue: any; filterName: any } }
) => {
  switch (action.type) {
    case "SET_SORT":
      const { optionValue: sortOptionValue, filterName: sortFilterName } =
        action.payload;
      const updatedSort = state.sort.map((option) => {
        if (option.name === sortOptionValue) {
          return { ...option, current: true };
        } else {
          return { ...option, current: false };
        }
      });
      return { ...state, sort: updatedSort };

    //same as intial state but with variants from fetched data

    case "SET_FILTERS":
      //same as intial state but with variants from fetched data
      const filters = action.payload;
      // console.log("innerFilter", filters);
      return { ...state, filters: filters };

    //check if strucutre is the same as initial state

    case "TOGGLE_FILTER":
      const { filterName, optionValue } = action.payload;
      const updatedFiltersArr = state.filters.map((filter) => {
        if (filter.id === filterName) {
          const updatedOptions = filter.options.map((option) => {
            if (filter.id === "amountPerPage") {
              // Only allow one option to be checked
              if (option.value === optionValue) {
                return { ...option, checked: true };
              } else {
                return { ...option, checked: false };
              }
            } else {
              // Keep the same behavior for other filters
              if (option.value === optionValue) {
                return { ...option, checked: !option.checked };
              } else {
                return option;
              }
            }
          });
          return { ...filter, options: updatedOptions };
        } else {
          return filter;
        }
      });
      return { ...state, filters: updatedFiltersArr };
    case "SET_FILTERED_BRAND_OPTIONS":
      return { ...state, filteredBrandOptions: action.payload };
    case "SET_FILTERED_PRODUCTS":
      return { ...state, filteredProducts: action.payload };
    case "SET_PRODUCTS":
      return { ...state, products: action.payload };
    default:
      return state;
  }
};

export default function Example({
  products22,
  handle,
  cursor,
  amountPerPage,
  filter,
}: {
  products22: Products22;
  handle: String;
  cursor: String;
  amountPerPage: number;
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(amountPerPage);

  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const fetchFilters = async () => {
      //filter from fetched data //filters from initial state

      const filterOptions = [
        ...filters.filter((filter) => filter.id === "amountPerPage"),

        ...filter,
      ];

      //dispatch and update filter state

      dispatch({
        type: "SET_FILTERS",
        payload: filterOptions,
      });

      // console.log("filterOptions", filterOptions);
    };

    fetchFilters();
  }, []);

  const amountPerPageOptions = state.filters[0].options.filter(
    (option) => option.checked
  ) || [
    {
      value: amountPerPage,
      label: amountPerPage.toString(),
      checked: true,
    },
  ];

  const amountPerPagee =
    amountPerPageOptions.length > 0
      ? amountPerPageOptions[0].value
      : (amountPerPage as number);

  // if amount per page changes, update pageState

  useEffect(() => {
    const updateProductsOnAmountPerPageChange = async () => {
      const pageNumber = page;
      let currentAmountPerPage = Number(amountPerPagee);

      const fetchPage = async (page: number, amountPerPage: number) => {
        try {
          const pageData = await fetchCollectionPage(
            handle,
            currentAmountPerPage,
            page,
            cursor
          );
          return pageData;
        } catch (error) {
          // Handle the fetch error

          // Decrement currentAmountPerPage by 1
          currentAmountPerPage--;

          if (currentAmountPerPage > 0) {
            return fetchPage(page, currentAmountPerPage);
          } else {
            throw new Error("Fetch failed continuously."); // Throw an error if fetch fails continuously
          }
        }
      };

      const pageData = await fetchPage(pageNumber, currentAmountPerPage);

      const reformattedProducts = pageData.map(
        (product: UnformattedProduct) => {
          const variantOptions = getVariantOptions(product.node);
          return {
            id: product.node.id,
            name: product.node.title,
            href: "#",
            price: product.node.priceRange.maxVariantPrice.amount,
            description: product.node.description,
            vendor: product.node.vendor,

            imageSrc: product.node.images.edges[0].node.url,
            imageAlt: "",
          };
        }
      ) as FormattedProduct[];

      setProducts(reformattedProducts);
    };

    updateProductsOnAmountPerPageChange();
  }, [amountPerPagee]);

  const extractPaginationDataShopifyStoreFrontApi = (
    data: any
  ): PaginationData => {
    const hasNextPage = data.first.collection.products.pageInfo.hasNextPage;
    const hasPreviousPage =
      data.first.collection.products.pageInfo.hasPreviousPage;
    const edges = data.first.collection.products.edges;
    const totalCount = data.totalProductCount || 5;

    // console.log("edges", edges);

    const reformateedProducts = edges.map((product: UnformattedProduct) => {
      type Variant = {
        value: string;
        label: string;
      };

      type VariantsResponse = {
        variants: {
          edges: {
            node: {
              selectedOptions: {
                name: string;
                value: string;
              }[];
            };
          }[];
        };
      };

      const variantOptions = getVariantOptions(product.node);
      // console.log("variantOptionsInnerOptions", variantOptions);

      return {
        id: product.node.id,
        name: product.node.title,
        href: "#",
        price: product.node.priceRange.maxVariantPrice.amount,
        description: product.node.description,
        vendor: product.node.vendor,
        variants: variantOptions,
        imageSrc: product.node.images.edges[0].node.url,
        imageAlt: product.node.images.edges[0].node.altText,
      };
    }) as FormattedProduct[];

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

  // Filter Logic

  const getListOfCheckedVariantOptions = useCallback(() => {
    // get all variant options

    const variantOptions = state.filters.filter((filter) => {
      //everything that is not "amountPerPage" or "brand"
      return filter.id !== "amountPerPage" && filter.id !== "brand";
    });

    // go over variant options and return an array of checked options objects

    const checkedVariantOptions = variantOptions.map((variantOption) => {
      const checkedOptions = variantOption.options.filter(
        (option) => option.checked
      );

      const checkedOptionsObject = {
        id: variantOption.id,
        name: variantOption.name,
        options: checkedOptions,
      };

      //return array filled with objects

      return checkedOptionsObject;
    }, []);

    return checkedVariantOptions;
  }, [state.filters]);

  // Filter brand options

  const filterProducts = useCallback(
    (brandOptions) => {
      let checkedBrandOptions = [];
      try {
        checkedBrandOptions = brandOptions.options.filter(
          (option) => option.checked
        );
      } catch (error) {
        console.error("Error in brandOptions.options:", error);
        return []; // Return an empty array if brandOptions.options throws an error
      }

      console.log("checkedBrandOptions", checkedBrandOptions);

      // If no brand options are checked, return all products
      const filteredProducts = products.filter((product) => {
        const productBrand = product.vendor;
        const productBrandMatches = checkedBrandOptions.find(
          (option) => option.value === productBrand
        );
        return productBrandMatches;
      });

      // console.log("filteredProducts", filteredProducts);
      return filteredProducts;
    },
    [state.filteredBrandOptions, products]
  );

  const updateFilteredProducts = useCallback(
    (brandOptions) => {
      const filteredProducts = filterProducts(brandOptions);
      // console.log("updateFilteredProducts-filteredProducts", filteredProducts);
      return filteredProducts;
      // dispatch({ type: "SET_FILTERED_PRODUCTS", payload: filteredProducts });
    },
    [filterProducts]
  );

  console.log(" state.filteredProducts", state.filteredProducts);

  const getCheckedOptions = useCallback(() => {
    const brandFilter = state.filters.find((filter) => filter.id === "brand");

    if (!brandFilter) {
      return [];
    }

    return brandFilter.options.filter((option) => option.checked);
  }, [state.filters]);

  const getBrandOptions = useMemo(() => {
    const checkedOptions = getCheckedOptions();

    const brandFilter = state.filters.find((filter) => filter.id === "brand");

    if (!brandFilter) {
      return [];
    }

    return {
      id: brandFilter.id,
      name: brandFilter.name,
      options: checkedOptions,
    };
  }, [getCheckedOptions]);

  useEffect(() => {
    const brandOptions = getBrandOptions;
    // console.log("brandOptions", brandOptions);
    dispatch({ type: "SET_FILTERED_BRAND_OPTIONS", payload: brandOptions });
  }, [getBrandOptions]);

  useEffect(() => {
    const filteredProducts = updateFilteredProducts(state.filteredBrandOptions);
    console.log("filteredProducts", filteredProducts);
    dispatch({ type: "SET_FILTERED_PRODUCTS", payload: filteredProducts });

    console.log("state.filteredProducts", state);
  }, [state.filteredBrandOptions, updateFilteredProducts]);

  // Use the filteredProducts state in your component

  /// Pagination Logic

  const fetchNextPageData = useCallback(
    async (data: Products22) => {
      const fetchNextPage = async () => {
        const nextPage = await data.next;
        return nextPage;
      };

      const nextPage = await fetchNextPage();

      const reformattedProducts = nextPage.collection.products.edges.map(
        (product: UnformattedProduct) => {
          const variantOptions = getVariantOptions(product.node);

          return {
            id: product.node.id,
            name: product.node.title,
            href: "#",
            vendor: product.node.vendor,
            variants: variantOptions,

            price: product.node.priceRange.maxVariantPrice.amount,
            description: product.node.description,
            imageSrc: product.node.images.edges[0].node.url,
            imageAlt: "",
          } as FormattedProduct;
        }
      );

      setProducts(reformattedProducts);
    },
    [products]
  );

  const fetchPreviousPageData = useCallback(
    async (data: Products22) => {
      const fetchPreviousPage = async () => {
        const previousPage = await data.previous;
        return previousPage;
      };

      const previousPage = await fetchPreviousPage();

      const reformattedProducts = previousPage.collection.products.edges.map(
        (product: UnformattedProduct) => {
          const variantOptions = getVariantOptions(product.node);
          return {
            id: product.node.id,
            name: product.node.title,
            href: "#",
            price: product.node.priceRange.maxVariantPrice.amount,
            description: product.node.description,
            vendor: product.node.vendor,
            variants: variantOptions,

            imageSrc: product.node.images.edges[0].node.url,
            imageAlt: "",
          };
        }
      ) as FormattedProduct[];

      setProducts(reformattedProducts);

      // console.log("previousPage", previousPage);
    },
    [products]
  );

  //Pagination Logic

  const totalPages = () => {
    extractPaginationDataShopifyStoreFrontApi(products22);

    // six items per page

    const totalPages = Math.ceil(products22.totalProductCount / amountPerPagee);

    return totalPages;
  };

  const handleMoveRight = (e: React.MouseEvent<HTMLElement>) => {
    //on click of next button fetch next page
    fetchNextPageData(products22);
  };

  const handleMoveLeft = () => {
    fetchPreviousPageData(products22);
  };

  const gotoPage = async (page: number) => {
    //Get the page number from the input field

    const pageNumber = page;
    const fetchPage = async (page: number) => {
      const pageData = await fetchCollectionPage(
        handle,
        amountPerPage,
        page,
        cursor
      );
      return pageData;
    };

    const pageData = await fetchPage(pageNumber);

    const reformattedProducts = pageData.map((product: UnformattedProduct) => {
      const variantOptions = getVariantOptions(product.node);

      return {
        id: product.node.id,
        name: product.node.title,
        href: "#",
        price: product.node.priceRange.maxVariantPrice.amount,
        description: product.node.description,
        vendor: product.node.vendor,
        variants: variantOptions,
        imageSrc: product.node.images.edges[0].node.url,
        imageAlt: "",
      };
    }) as FormattedProduct[];

    //set products for page
    setProducts(reformattedProducts);

    //set page number
    setPage(pageNumber);
  };

  //Filter Logic

  // Initial state for the filter options

  // Handler for setting the sort option
  const setSortOption = (option) => {
    dispatch({ type: "SET_SORT", payload: option });
  };

  // Handler for toggling filter options
  const toggleFilterOption = (optionValue, filterName) => {
    dispatch({ type: "TOGGLE_FILTER", payload: { optionValue, filterName } });
  };

  // Filter handler function passed to the onClick event
  const filterHandler = (optionValue, filterName) => (e) => {
    e.preventDefault();
    toggleFilterOption(optionValue, filterName);
  };

  // const { sort, filters } = state;

  const productsToRender = state.filteredProducts.length
    ? state.filteredProducts
    : products;

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
                    {/* Sort Menu */}
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

                  {/* Filters Button */}
                  <button
                    type="button"
                    className="inline-block text-sm font-medium text-gray-700 hover:text-gray-900 sm:hidden"
                    onClick={() => setMobileFiltersOpen(true)}
                  >
                    Filters
                  </button>

                  <Popover.Group className="hidden sm:flex sm:items-baseline sm:space-x-8">
                    {/* Filter Popover Group */}
                    {state.filters.map((section, sectionIdx) => (
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
                                    checked={option.checked}
                                    type="checkbox"
                                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                    onClick={() =>
                                      dispatch({
                                        type: "TOGGLE_FILTER",
                                        payload: {
                                          optionValue: option.value,
                                          filterName: section.id,
                                        },
                                      })
                                    }
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
                  {productsToRender.map((product) => (
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

              {/* <section
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
              </section> */}

              <section
                aria-labelledby="more-products-heading"
                className="mt-16 pb-24"
              >
                <h2 id="more-products-heading" className="sr-only">
                  More products
                </h2>

                <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8"></div>
              </section>
            </div>
          </main>
        </div>
      </div>
      <CenterPagination
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

  // console.log("slug", slug);

  const products = await getCollectionPageDataByHandle(slug && slug);

  // console.log("variants", products.variants);
  // console.log("brands", products.brands);

  const filter = [...products.variants, ...products.brands];

  // console.log("filter", filter);

  //brand = vendor
  //color = variant option 1
  //size = variant option 2

  const cursor = products.first.collection.products.edges[0].cursor;

  const amountPerPage = 6;

  return {
    props: {
      handle: slug && slug,
      cursor,
      amountPerPage,
      navigation,
      products22: products,
      filter,
    },
  };
};

// const filters = [
//   {
//     id: "amountPerPage",
//     name: "Amount Per Page",
//     options: [
//       { value: "6", label: "6", checked: false },
//       { value: "12", label: "12", checked: false },
//       { value: "24", label: "24", checked: false },
//       { value: "48", label: "48", checked: false },
//     ],
//   },
//   {
//     id: "brand",
//     name: "Brand",
//     options: [
//       { value: "clothing-company", label: "Clothing Company", checked: false },
//       { value: "fashion-inc", label: "Fashion Inc.", checked: false },
//       { value: "shoes-n-more", label: "Shoes 'n More", checked: false },
//       { value: "supplies-n-stuff", label: "Supplies 'n Stuff", checked: false },
//     ],
//   },
//   {
//     id: "color",
//     name: "Color",
//     options: [
//       { value: "white", label: "White", checked: false },
//       { value: "black", label: "Black", checked: false },
//       { value: "grey", label: "Grey", checked: false },
//       { value: "blue", label: "Blue", checked: false },
//       { value: "olive", label: "Olive", checked: false },
//       { value: "tan", label: "Tan", checked: false },
//     ],
//   },
//   {
//     id: "sizes",
//     name: "Sizes",
//     options: [
//       { value: "xs", label: "XS", checked: false },
//       { value: "s", label: "S", checked: false },
//       { value: "m", label: "M", checked: false },
//       { value: "l", label: "L", checked: false },
//       { value: "xl", label: "XL", checked: false },
//       { value: "2xl", label: "2XL", checked: false },
//     ],
//   },
// ];
