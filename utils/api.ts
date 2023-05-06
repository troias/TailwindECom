type Query = string;

type Variables = {
  [key: string]: string;
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

  const womensNavigationHandle = "Women";
  const featuredWomenQueryHandle = "title:Women's Featured*" as string;
  const womensSection1handle = "womens-shoes-and-accessories";
  const womensSection2Handle = "brands";
  const womensSection3Handle = "womens-collection";
  const womensSection4Handle = "womens-collection";
  const womensSection5Handle = "womens-accessories";

  // Mens Navigation Data

  const mensNavigationHandle = "Men";
  const mensFeaturedHandle = "Men's Featured";
  const mensSection1Handle = "mens-shoes-accessories";
  const mensSection2Handle = "brands";
  const mensSection3Handle = "mens-collections";

  // Mens Navigation Data Reformatter Function to be used in the navigation component on the front end.

  const menuSectionReformatter = (menu: {
    id: any;
    title: any;
    handle: any;
    items: any[];
  }) => {
    return {
      id: menu.id,
      name: menu.title || menu.handle,
      handle: menu.handle,
      items: menu.items.map((item) => {
        return {
          name: item.title,
          href: item.url,
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
          }
        }
      }
    }
  `;

  const pageData = await graphqlstorefront(pagesQuery);

  // Pages Array for Menu

  const pages = pageData.pages.edges.map(
    (page: { node: { title: any; url: any; handle: string } }) => {
      return {
        name: page.node.title,
        href: page.node.url || "#",
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
        }
      }
      menu1: menu(handle: $menu1Handle) {
        title
        items {
          title
        }
      }
      menu2: menu(handle: $menu2Handle) {
        title
        items {
          title
        }
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
