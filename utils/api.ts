import { navigationData, mensNavigationData } from "../config/navigationConfig";

type Query = string;

type Variables = {
  [key: string]: any;
};

export const graphqlstorefront = async (
  query: Query,
  variables?: Variables
) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_STORE_DOMAIN}/api/2023-04/graphql.json`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token":
          process.env.NEXT_PUBLIC_STOREFRONT_API_TOKEN,
      } as any,

      body: JSON.stringify({
        query,
        variables,
      }),
    }
  );

  if (res.status !== 200) {
    throw new Error("Failed to fetch API");
  }

  const response = await res.json();

  return response.data || response.errors;
};

export const getProducts = async () => {
  const gql = String.raw;

  const query = gql`
    query Products {
      products(first: 6) {
        edges {
          node {
            id
            title
            handle
            tags

            priceRange {
              minVariantPrice {
                amount
              }
            }
            images(first: 1) {
              edges {
                node {
                  transformedSrc
                }
              }
            }
          }
        }
      }
    }
  `;

  const data = await graphqlstorefront(query);

  return data.products.edges;
};

export const getCategories = async () => {
  const query = `
    query {
      collections(first: 10) {
        edges {
          node {
            id
            title
            handle
            image {
              originalSrc
            }
          }
        }
      }
    }
  `;

  const data = await graphqlstorefront(query);

  return data.collections.edges;
};

// Navigation function to get the navigation data from the Shopify Storefront API and then reformatted to be used in the navigation component on the front end.

export const getNavigation = async () => {
  // Womens Navigation Data

  //

  const womensNavigationHandle = navigationData.womensNavigationHandle;
  const featuredWomenQueryHandle = navigationData.featuredWomenQueryHandle;
  const womensSection1handle =
    navigationData.womensSectionHandlers.womensSection1handle;
  const womensSection2Handle =
    navigationData.womensSectionHandlers.womensSection2Handle;
  const womensSection3Handle =
    navigationData.womensSectionHandlers.womensSection3Handle;
  const womensSection4Handle =
    navigationData.womensSectionHandlers.womensSection4Handle;
  const womensSection5Handle =
    navigationData.womensSectionHandlers.womensSection5Handle;

  // Mens Navigation Data

  const mensNavigationHandle = mensNavigationData.mensNavigationHandle;
  const mensFeaturedHandle = mensNavigationData.mensFeaturedHandle;
  const mensSection1Handle =
    mensNavigationData.mensSectionHandlers.mensSection1Handle;
  const mensSection2Handle =
    mensNavigationData.mensSectionHandlers.mensSection2Handle;
  const mensSection3Handle =
    mensNavigationData.mensSectionHandlers.mensSection3Handle;

  // Mens Navigation Data Reformatter Function to be used in the navigation component on the front end.

  const menuSectionReformatter = (menu: {
    id: any;
    title: any;
    handle: any;
    items: any[];
  }) => {
    const replaceWhiteSpace = (str: string) => {
      return str.replace(/%20|\s/g, "-").toLowerCase();
    };

    return {
      id: menu.id,
      name: replaceWhiteSpace(menu.title || menu.handle),
      handle: replaceWhiteSpace(menu.handle),
      items: menu.items.map((item) => {
        return {
          name: replaceWhiteSpace(item.title),
          href: replaceWhiteSpace(item.url),
        };
      }),
    };
  };

  const gql = String.raw;

  // Womens Navigation queries and variables for the navigation menu data to be returned from the Shopify Storefront API and then reformatted to be used in the navigation component on the front end.

  const womenNavigationQuery = gql`
    query Navigation($handle: String!) {
      collection(handle: $handle) {
        id
        title
      }
    }
  `;

  const womensNavVar = {
    handle: womensNavigationHandle,
  };

  const womenNavigation = await graphqlstorefront(
    womenNavigationQuery,
    womensNavVar
  );

  // Featured Womens Collection queries and variables for the navigation menu data to be returned from the Shopify Storefront API and then reformatted to be used in the navigation component on the front end.

  const featuredWomenQuery = gql`
    query FeaturedWomensCollections($title: String!) {
      collections(first: 10, query: $title) {
        edges {
          node {
            title
            handle
            image {
              url
              altText
            }
          }
        }
      }
    }
  `;

  const featuredWomenVars = {
    title: featuredWomenQueryHandle,
  };

  const featuredWomenData = await graphqlstorefront(
    featuredWomenQuery,
    featuredWomenVars
  );

  // Reformating featured womens data to be used in the navigation component on the front end.

  const featuredWomen = featuredWomenData.collections.edges.map(
    (edge: {
      node: {
        title: string;
        handle: String;
        image: { url: any; altText: any };
      };
    }) => {
      const name = edge.node.title.replace(/^Women's Featured\s/, "");
      return {
        name,
        handle: edge.node.handle,
        href: "#",
        imageSrc: edge.node.image.url,
        imageAlt: edge.node.image.altText,
      };
    }
  );

  // Womens Section queries and variables for the navigation menu data to be returned from the Shopify Storefront API and then reformatted to be used in the navigation component on the front end.

  const womensSection1Req = gql`
    query WomensShoesAndAccessories($handle: String!) {
      menu(handle: $handle) {
        id
        handle
        title
        items {
          title
          url
        }
      }
    }
  `;

  const womensSection1Vars = {
    handle: womensSection1handle,
  };

  const womensSection2Req = gql`
    query WomensBrandSection($handle: String!) {
      menu(handle: $handle) {
        id
        handle
        title
        items {
          title
          url
        }
      }
    }
  `;

  const womensSection2Vars = {
    handle: womensSection2Handle,
  };

  const womensSection3Req = gql`
    query WomensCollection($handle: String!) {
      menu(handle: $handle) {
        id
        handle
        title
        items {
          title
          url
        }
      }
    }
  `;

  const womensSection3Vars = {
    handle: womensSection3Handle,
  };

  const womensSection4Req = gql`
    query WomensClothing($handle: String!) {
      menu(handle: $handle) {
        id
        handle
        title
        items {
          title
          url
        }
      }
    }
  `;

  const womensSection4Vars = {
    handle: womensSection4Handle,
  };

  const womensSection5Req = gql`
    query WomensAccessories($handle: String!) {
      menu(handle: $handle) {
        id
        handle
        title
        items {
          title
          url
        }
      }
    }
  `;
  const womensSection5Vars = {
    handle: womensSection5Handle,
  };

  // Womens Section Data Fetching for the Navigation Component to use in the Header Component to render the Womens Navigation Section

  const womensSection1 = await graphqlstorefront(
    womensSection1Req,
    womensSection1Vars
  );
  const womensSection2 = await graphqlstorefront(
    womensSection2Req,
    womensSection2Vars
  );
  const womensSection3 = await graphqlstorefront(
    womensSection3Req,
    womensSection3Vars
  );
  const womensSection4 = await graphqlstorefront(
    womensSection4Req,
    womensSection4Vars
  );
  const womensSection5 = await graphqlstorefront(
    womensSection5Req,
    womensSection5Vars
  );

  // Womens Section Data Formatting for the Navigation Component to use in the Header Component

  const womensSections = [
    [
      menuSectionReformatter(womensSection1.menu),
      menuSectionReformatter(womensSection2.menu),
      menuSectionReformatter(womensSection3.menu),
      menuSectionReformatter(womensSection4.menu),
      menuSectionReformatter(womensSection5.menu),
    ],
  ];

  //Men's Section

  // Mens Navigation Query and Variables for the query below

  const menNavigationQuery = gql`
    query Navigation($handle: String!) {
      collection(handle: $handle) {
        id
        title
      }
    }
  `;

  const variables = {
    handle: mensNavigationHandle,
  };

  const menNavigation = await graphqlstorefront(menNavigationQuery, variables);

  // Featured Mens Collections Query and Variables for the query below

  const featuredMenQuery = gql`
    query FeaturedMensCollections($title: String!) {
      collections(first: 10, query: $title) {
        edges {
          node {
            title
            handle
            image {
              url
              altText
            }
          }
        }
      }
    }
  `;

  const mensFeaturedHandleVariable = {
    title: `title:${mensFeaturedHandle}`,
  };

  // Featured Mens Collections Array of Objects with title, image properties for each collection in the array of collections returned from the query above (featuredMenCollections)

  const featuredMenCollections = await graphqlstorefront(
    featuredMenQuery,
    mensFeaturedHandleVariable
  );

  // Mens Featured Collections Array of Objects with name, href, imageSrc, imageAlt properties for each collection in the array of collections returned from the query above (featuredMenCollections)

  const mensFeatured = featuredMenCollections.collections.edges.map(
    (collection: {
      node: {
        title: any;
        onlineStoreUrl: any;
        handle: any;
        image: { url: any; altText: any };
      };
    }) => {
      return {
        name: collection.node.title.replace(/^Men's Featured\s/, ""),
        handle: collection.node.handle,
        href: collection.node.onlineStoreUrl || "#",
        imageSrc: collection.node.image.url,
        imageAlt: collection.node.image.altText,
      };
    }
  );

  //Men's Section Menu

  //Mens Section 1

  const mensSection1Req = gql`
    query MensSections($handle: String!) {
      menu(handle: $handle) {
        id
        handle
        title
        items {
          title
          url
        }
      }
    }
  `;

  const mensSection1Variables = {
    handle: mensSection1Handle,
  };

  // Mens Section 2

  const mensSection2Req = gql`
    query MensBrandSection($handle: String!) {
      menu(handle: $handle) {
        id
        handle
        title
        items {
          title
          url
        }
      }
    }
  `;

  const mensSection2Variables = {
    handle: mensSection2Handle,
  };

  // Mens Section 3

  const mensSection3Req = gql`
    query MensCollection($handle: String!) {
      menu(handle: $handle) {
        id
        handle
        title
        items {
          title
          url
        }
      }
    }
  `;

  const mensSection3Variables = {
    handle: mensSection3Handle,
  };

  // MensSectionGraphQLRequests

  const mensSection1 = await graphqlstorefront(
    mensSection1Req,
    mensSection1Variables
  );
  const mensSection2 = await graphqlstorefront(
    mensSection2Req,
    mensSection2Variables
  );
  const mensSection3 = await graphqlstorefront(
    mensSection3Req,
    mensSection3Variables
  );

  // MensSectionArray for Menu

  const mensSections = [
    [
      menuSectionReformatter(mensSection1.menu),
      menuSectionReformatter(mensSection2.menu),
      menuSectionReformatter(mensSection3.menu),
    ],
  ];

  // Pages Query

  const pagesQuery = gql`
    query Pages {
      pages(first: 2) {
        edges {
          node {
            handle
            title
            onlineStoreUrl
          }
        }
      }
    }
  `;

  const pageData = await graphqlstorefront(pagesQuery);

  // Pages Array for Menu

  const pages = pageData.pages.edges.map(
    (page: {
      node: {
        onlineStoreUrl: string;
        title: any;
        url: any;
        handle: string;
      };
    }) => {
      return {
        name: page.node.title,
        href: page.node.url || "#",
        url: page.node.onlineStoreUrl || "#",
        handle: page.node.handle || "#",
      };
    }
  );

  // Mens Menu Object for Menu

  const mensMenuObj = {
    id: "mens",
    name: menNavigation.collection.title,
    featured: mensFeatured,
    sections: mensSections,
  };

  // Womens Menu Object

  const womensMenuObj = {
    id: "womens",
    name: womenNavigation.collection.title,
    featured: featuredWomen,
    sections: womensSections,
  };

  // Return Menu Object

  return {
    categories: [womensMenuObj, mensMenuObj],
    pages: pages,
  };
};

//Search Menu Object

export const searchMenuQuery = async (searchHandle: string) => {
  const gql = String.raw;

  const searchQuery = gql`
    query Products($query: String!) {
      products(first: 2, query: $query) {
        edges {
          node {
            id
            onlineStoreUrl
            title
            handle
            tags
            priceRange {
              minVariantPrice {
                amount
              }
            }
            images(first: 1) {
              edges {
                node {
                  transformedSrc
                }
              }
            }
          }
        }
      }
    }
  `;

  const searchVariables = {
    query: `title:${searchHandle}*`,
  };

  const searchResultsData = await graphqlstorefront(
    searchQuery,
    searchVariables
  );

  const searchResults = searchResultsData.products.edges.map(
    (product: {
      node: {
        id: any;
        onlineStoreUrl: any;
        title: any;
        handle: any;
        tags: any;
        priceRange: {
          minVariantPrice: { amount: any };
        };
        images: { edges: { node: { transformedSrc: any } }[] };
      };
    }) => {
      return {
        id: product.node.id,
        name: product.node.title,
        handle: product.node.handle,
        href: product.node.onlineStoreUrl || "#",
        imageSrc: product.node.images.edges[0].node.transformedSrc,
        imageAlt: product.node.title,
        price: product.node.priceRange.minVariantPrice.amount,
        tags: product.node.tags,
      };
    }
  );

  interface SearchMenuObj {
    id: string;
    name: string;
    results: {
      id: any;
      name: any;
      handle: any;
      href: any;
      imageSrc: any;
      imageAlt: any;
      price: any;
      tags: any;
    }[];
  }

  const searchMenuObj: SearchMenuObj = {
    id: "search",
    name: "Search",
    results: searchResults,
  };

  return searchMenuObj;
};

export const getHeroProducts = async (handle: string) => {
  const gql = String.raw;

  const heroDataHande = handle;

  const heroDataQuery = gql`
    query heroDataQueryCollections($title: String!) {
      collections(first: 1, query: $title) {
        edges {
          node {
            id
            title
            handle
            image {
              url
              altText
            }
            products(first: 10) {
              edges {
                node {
                  id
                  title
                  handle
                  tags
                  images(first: 1) {
                    edges {
                      node {
                        id
                        url
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  `;

  const heroDataVars = {
    title: heroDataHande,
  };

  const heroData = await graphqlstorefront(heroDataQuery, heroDataVars);

  const heroDataReformated = heroData.collections.edges.map((product: any) => {
    const node = product.node;
    return {
      id: node.id,
      name: node.title,
      handle: node.handle,
      image: node.image.url,
      products: node.products.edges.map((product: any) => {
        const node = product.node;
        return {
          id: node.id,
          name: node.title,
          handle: node.handle,
          tags: node.tags,
          images: node.images.edges.map((image: any) => {
            return {
              id: image.node.id,
              src: image.node.url,
            };
          }),
        };
      }),
    };
  });

  return heroDataReformated;
};

export const getFooterMenuData = async () => {
  const menuHandle = "footer";
  const menu1Handle = "support";
  const menu2Handle = "contact";

  const gql = String.raw;

  const footerMenuQuery = gql`
    query FooterMenu(
      $menuHandle: String!
      $menu1Handle: String!
      $menu2Handle: String!
    ) {
      menu(handle: $menuHandle) {
        title
        items {
          title
          id
          url
        }
      }
      menu1: menu(handle: $menu1Handle) {
        title
        items {
          title
          id
          url
        }
      }
      menu2: menu(handle: $menu2Handle) {
        title
        items {
          title
          id
          url
        }
      }
      shop {
        name
      }
    }
  `;

  const footerMenuVars = {
    menuHandle: menuHandle,
    menu1Handle: menu1Handle,
    menu2Handle: menu2Handle,
  };

  const footerMenuData = await graphqlstorefront(
    footerMenuQuery,
    footerMenuVars
  );

  return footerMenuData;
};

//Find Page from FooterMenu name

//Get Page Data

export const getPageDataByHandle = async (handle: string) => {
  const gql = String.raw;

  const pageDataQuery = gql`
    query PageData($handle: String!) {
      page(handle: $handle) {
        title
        body
      }
    }
  `;

  const pageDataVars = {
    handle: handle,
  };

  const pageData = await graphqlstorefront(pageDataQuery, pageDataVars);

  return pageData;
};

export const getAllPages = async () => {
  const gql = String.raw;

  const allPagesQuery = gql`
    query AllPages {
      pages(first: 10) {
        edges {
          node {
            id
            handle
            title
          }
        }
      }
    }
  `;

  const allPages = await graphqlstorefront(allPagesQuery);

  return allPages;
};

// Collection page query

export const getCollectionPageDataByHandle = async (
  handle: string,
  amount: number = 6 //default 10
) => {
  const gql = String.raw;

  const getTotalProductCount = async (handle: string) => {
    const gql = String.raw;

    const collectionPageDataQueryTotal = gql`
      query CollectionByHande($handle: String!) {
        collection(handle: $handle) {
          products(first: 250) {
            pageInfo {
              hasNextPage
              hasPreviousPage
            }
            edges {
              cursor
              node {
                id
                title
                priceRange {
                  maxVariantPrice {
                    amount
                  }
                }
                description

                images(first: 1) {
                  edges {
                    node {
                      url
                    }
                  }
                }
              }
            }
          }
        }
      }
    `;

    const collectionPageDataVarsTotal = {
      handle: handle,
    };

    const collectionPageDataTotal = await graphqlstorefront(
      collectionPageDataQueryTotal,
      collectionPageDataVarsTotal
    );

    const totalProductCount =
      //if collection does not exist return 0
      collectionPageDataTotal?.collection?.products?.edges?.length || 0;

    return totalProductCount;
  };

  const totalProductCount = (await getTotalProductCount(handle)) || 0;

  const getCollectionSubHeading = gql`
    query CollectionByHande($handle: String!) {
      collection(handle: $handle) {
        metafield(namespace: "custom", key: "subheadingtext") {
          namespace
          value
          key
        }
      }
    }
  `;

  const getCollectionSubHeadingVars = {
    handle: handle,
  };

  const collectionSubHeading = await graphqlstorefront(
    getCollectionSubHeading,
    getCollectionSubHeadingVars
  );

  const collectionPageDataQueryFirst = gql`
    query CollectionByHande($handle: String!, $amount: Int!) {
      collection(handle: $handle) {
        products(first: $amount) {
          pageInfo {
            hasNextPage
            hasPreviousPage
          }

          edges {
            cursor
            node {
              id
              title
              handle
              priceRange {
                maxVariantPrice {
                  amount
                }
              }
              description
              vendor
              createdAt
              metafield(namespace: "ratings", key: "ratings") {
                namespace
                value
              }

              variants(first: 5) {
                edges {
                  node {
                    selectedOptions {
                      name
                      value
                    }
                  }
                }
              }
              images(first: $amount) {
                edges {
                  node {
                    url
                  }
                }
              }
            }
          }
        }
      }
    }
  `;

  const collectionPageDataVarsFirst = {
    handle: handle,
    amount: amount,
  };

  const collectionPageDataFirst = await graphqlstorefront(
    collectionPageDataQueryFirst,
    collectionPageDataVarsFirst
  );

  //Get next products if there are any for pagination

  const collectionPageDataQueryNxt = gql`
    query CollectionByHande($handle: String!, $amount: Int!, $after: String!) {
      collection(handle: $handle) {
        products(first: $amount, after: $after) {
          pageInfo {
            hasNextPage
            hasPreviousPage
          }
          edges {
            cursor
            node {
              id
              title
              handle
              priceRange {
                maxVariantPrice {
                  amount
                }
              }
              description
              vendor
              createdAt
              metafield(namespace: "ratings", key: "ratings") {
                namespace

                value
              }
              variants(first: 5) {
                edges {
                  node {
                    selectedOptions {
                      name
                      value
                    }
                  }
                }
              }
              images(first: $amount) {
                edges {
                  node {
                    url
                  }
                }
              }
            }
          }
        }
      }
    }
  `;

  function getValidIndex(collectionData, amount) {
    let index = amount - 1;
    const edges = collectionData?.collection?.products?.edges;
    while (index >= edges?.length && index >= 0) {
      index--;
    }
    return index;
  }

  // Usage example

  const edgeIndex = getValidIndex(collectionPageDataFirst, amount);
  const cursor =
    edgeIndex >= 0
      ? collectionPageDataFirst?.collection?.products?.edges[edgeIndex].cursor
      : "";

  const collectionPageDataVarsNxt = {
    handle: handle,
    amount: amount,
    after: cursor || "",
  };

  const collectionPageDataNxt = await graphqlstorefront(
    collectionPageDataQueryNxt,
    collectionPageDataVarsNxt
  );

  //Get previous products if there are any for pagination

  const collectionPageDataQueryPrev = gql`
    query CollectionByHande($handle: String!, $amount: Int!, $before: String!) {
      collection(handle: $handle) {
        products(last: $amount, before: $before) {
          pageInfo {
            hasNextPage
            hasPreviousPage
          }
          edges {
            cursor
            node {
              id
              title
              handle
              priceRange {
                maxVariantPrice {
                  amount
                }
              }
              description
              vendor
              createdAt
              metafield(namespace: "ratings", key: "ratings") {
                namespace

                value
              }
              variants(first: 5) {
                edges {
                  node {
                    selectedOptions {
                      name
                      value
                    }
                  }
                }
              }
              images(first: $amount) {
                edges {
                  node {
                    url
                  }
                }
              }
            }
          }
        }
      }
    }
  `;
  const beforeCursor =
    collectionPageDataNxt &&
    collectionPageDataNxt.collection &&
    collectionPageDataNxt.collection.products &&
    collectionPageDataNxt.collection.products.edges &&
    collectionPageDataNxt.collection.products.edges.length > 0
      ? collectionPageDataNxt.collection.products.edges[0].cursor
      : "";

  const collectionPageDataVarsPrev = {
    handle: handle,
    amount: amount,
    before: beforeCursor,
  };

  const collectionPageDataPrev = await graphqlstorefront(
    collectionPageDataQueryPrev,
    collectionPageDataVarsPrev
  );

  // FilterLogic for brands/vendor

  const brands = collectionPageDataFirst?.collection?.products?.edges.map(
    (brand) => {
      //create set to remove duplicates

      const brandName = brand.node.vendor;

      return brandName;

      //loop through each product
    }
  );

  const brandsSet = new Set(brands);
  const setToArray = Array.from(brandsSet);

  const getBrandOptionThenBuildArrayToHouse = (brand: [string]) => {
    //go over variant array if variant name matches the option name then add the option to the options array

    // end structure

    // [  {
    //     id: "brand",
    //     name: "Brand",
    //     options: [
    //       { value: "clothing-company", label: "Clothing Company", checked: false },
    //       { value: "fashion-inc", label: "Fashion Inc.", checked: false },
    //       { value: "shoes-n-more", label: "Shoes 'n More", checked: false },
    //       { value: "supplies-n-stuff", label: "Supplies 'n Stuff", checked: false },
    //     ],
    //   },]

    // get Brand Array and build options array that includes only unique vales

    const optionsReformatted = brand.map((brand) => {
      return { value: brand, label: brand, checked: false };
    });

    const brandFilter = [
      {
        id: "brand",
        name: "Brand",
        options: optionsReformatted,
        checked: false,
      },
    ];

    return brandFilter;
  };

  const brandOptions = getBrandOptionThenBuildArrayToHouse(setToArray);

  //FilterLogic for variants

  //structure for eventual filter object

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

  //get Array of Arrays and construct the options for each unique variant

  const variants = collectionPageDataFirst?.collection?.products?.edges.flatMap(
    (product) => {
      const productVariants = product.node.variants.edges.map((variant) => {
        return variant.node.selectedOptions.map((option) => {
          return option.name;
        });

        //loop through each variant
      });

      //create set to remove duplicates
      const flattendedArr = productVariants.flat();

      return flattendedArr;
    }
  );

  // const variantSet = new Set(variants);
  // const variantsToArray = Array.from(variantSet);

  // creating the options array for each variant

  // function gets the unique values from an array then goes over each product gets the variant value and adds it to the options array for that variant

  // const filterVariantCreator = (variant) => {};

  // const optionsArray = variantsToArray.map((variant) => {
  //   return filterVariantCreator(variant);
  // });

  const arrWithSet = [...new Set(variants)];

  // build option array for each variant

  const options = collectionPageDataFirst?.collection?.products?.edges.flatMap(
    (product) => {
      const productOptions = product.node.variants.edges.map((variant) => {
        return variant.node.selectedOptions.map((option) => {
          return option;
        });
      });

      const flattendedArr = productOptions.flat();

      return flattendedArr;
    }
  );

  // const useuniqueVariantNameTobuildOptionArrayToGOInsideVariant = (
  //   variant
  // ) => {};

  const getVariantOptionThenBuildArrayToHouse = (
    variant: [string],
    options: [
      {
        name: string;
        value: string;
      }
    ]
  ) => {
    //go over variant array if variant name matches the option name then add the option to the options array

    const newVariantArr = variant.map((variant) => {
      //only get the options that match the variant name

      const optionsArray = options.filter((option) => {
        return option.name === variant;
      });

      // go over array and remove any duplicate values

      const uniqueOptionsArray = optionsArray.filter((option, index, self) => {
        return (
          index ===
          self.findIndex(
            (t) => t.value === option.value && t.name === option.name
          )
        );
      });

      const reformatToFinalShape = uniqueOptionsArray.map((option) => {
        return { value: option.value, label: option.value, checked: false };
      });

      return {
        id: variant,
        name: variant,
        options: reformatToFinalShape,
        checked: false,
      };
    });

    return newVariantArr;
  };

  const newArr = getVariantOptionThenBuildArrayToHouse(arrWithSet, options);

  return {
    first: collectionPageDataFirst,
    next: collectionPageDataNxt,
    previous: collectionPageDataPrev,
    totalProductCount: totalProductCount,
    brands: brandOptions,
    variants: newArr,
    collectionSubHeading: collectionSubHeading,
  };
};

export async function fetchCollectionByHandle(
  handle: String,
  amount: Number,
  cursor: String
) {
  const gql = String.raw;

  const query = gql`
    query CollectionByHandle(
      $handle: String!
      $amount: Int!
      $cursor: String!
    ) {
      collection(handle: $handle) {
        products(first: $amount, after: $cursor) {
          pageInfo {
            hasNextPage
            hasPreviousPage
          }
          edges {
            cursor
            node {
              id
              title
              priceRange {
                maxVariantPrice {
                  amount
                }
              }
              description
              vendor
              variants(first: 5) {
                edges {
                  node {
                    selectedOptions {
                      name
                      value
                    }
                  }
                }
              }
              images(first: $amount) {
                edges {
                  node {
                    url
                  }
                }
              }
            }
          }
        }
      }
    }
  `;

  const variables = {
    handle,
    amount,
    cursor,
  };

  const response = await graphqlstorefront(query, variables);

  return response;
}

export const fetchCollectionPage = async (
  handle: String,
  pageSize: number,
  targetPage: number,
  cursor: String
) => {
  let currentPage = 1;
  let allProducts = [];
  let hasNextPage = true;
  let afterCursor = cursor || null;

  while (hasNextPage && currentPage <= targetPage) {
    const response = await fetchCollectionByHandle(
      handle,
      pageSize,
      afterCursor
    );

    const { edges, pageInfo } = response.collection.products;

    if (currentPage === targetPage) {
      allProducts = edges;

      break;
    }

    hasNextPage = pageInfo.hasNextPage;
    afterCursor = edges[edges.length - 1].cursor;

    currentPage++;
  }

  return allProducts;
};

//collection filter logic

type Filters = [
  {
    id: string;
    name: string;
    options: [{ value: string; label: string; type: string }];
  }
];

type SortOptions = [
  {
    name: string;
    href: string;
  }
];
