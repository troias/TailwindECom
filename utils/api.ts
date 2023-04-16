import type { ExtendedNavigation } from "./navigation/dummyNavigationData";

export const graphqlstorefront = async (query, variables = {}) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_STORE_DOMAIN}/api/2023-04/graphql.json`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token":
          process.env.NEXT_PUBLIC_STOREFRONT_API_TOKEN,
      },

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

export const getNavigation = async () => {
  const menuSectionReformatter = (menu) => {
    return {
      id: menu.id,
      name: menu.title || menu.handle,
      items: menu.items.map((item) => {
        return {
          name: item.title,
          href: item.url,
        };
      }),
    };
  };

  const gql = String.raw;

  const womenNavigationQuery = gql`
    query Navigation {
      collection(handle: "Women") {
        id
        title
      }
    }
  `;

  const womenNavigation = await graphqlstorefront(womenNavigationQuery);

  const featuredWomenQuery = gql`
    query FeaturedWomensCollections {
      collections(first: 10, query: "title:Women's Featured*") {
        edges {
          node {
            title
            image {
              url
              altText
            }
          }
        }
      }
    }
  `;

  const featuredWomenData = await graphqlstorefront(featuredWomenQuery);

  const featuredWomen = featuredWomenData.collections.edges.map((edge) => {
    const name = edge.node.title.replace(/^Women's Featured\s/, "");
    return {
      name,
      href: "#",
      imageSrc: edge.node.image.url,
      imageAlt: edge.node.image.altText,
    };
  });

  console.log("featuredWomen", featuredWomen);
  const womensSection1Req = gql`
    query MensSections {
      menu(handle: "womens-shoes-and-accessories") {
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

  const womensSection1 = await graphqlstorefront(womensSection1Req);

  const womensSections = [[menuSectionReformatter(womensSection1.menu)]];

  //Men's Section

  const menNavigationQuery = gql`
    query Navigation {
      collection(handle: "Men") {
        id
        title
      }
    }
  `;

  const menNavigation = await graphqlstorefront(menNavigationQuery);

  const featuredMenQuery = gql`
    query FeaturedMensCollections {
      collections(first: 10, query: "title:Men's Featured") {
        edges {
          node {
            title
            image {
              url
              altText
            }
          }
        }
      }
    }
  `;

  const featuredMens = await graphqlstorefront(featuredMenQuery);

  console.log(featuredMens);

  //Men's Section Menu

  const mensSection1Req = gql`
    query MensSections {
      menu(handle: "mens-shoes-accessories") {
        id
        handle
        items {
          title
          url
        }
      }
    }
  `;

  const mensSection1 = await graphqlstorefront(mensSection1Req);

  const mensSection2Req = gql`
    query MensBrandSection {
      menu(handle: "brands") {
        id
        handle

        items {
          title
          url
        }
      }
    }
  `;
  const mensSection2 = await graphqlstorefront(mensSection2Req);

  const mensFeatured = featuredMens.collections.edges.map((collection) => {
    return {
      name: collection.node.title,
      href: collection.node.onlineStoreUrl || "#",
      imageSrc: collection.node.image.url,
      imageAlt: collection.node.image.altText,
    };
  });

  const mensSections = [
    [
      menuSectionReformatter(mensSection1.menu),
      menuSectionReformatter(mensSection2.menu),
    ],
  ];

  const pagesQuery = gql`
    query Pages {
      pages(first: 2) {
        edges {
          node {
            title
          }
        }
      }
    }
  `;
  const pageData = await graphqlstorefront(pagesQuery);

  const pages = pageData.pages.edges.map((page) => {
    return {
      name: page.node.title,
      href: page.node.url || "#",
    };
  });

  const mensMenuObj = {
    id: "mens",
    name: menNavigation.collection.title,
    featured: mensFeatured,
    sections: mensSections,
  };

  const womensMenuObj = {
    id: "womens",
    name: womenNavigation.collection.title,
    featured: featuredWomen,
    sections: womensSections,
  };

  return {
    categories: [womensMenuObj, mensMenuObj],
    pages: pages,
  };
};
