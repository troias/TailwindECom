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

  const menuSectionReformatter = (menu: {
    id: any;
    title: any;
    handle: any;
    items: any[];
  }) => {
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

  const featuredWomenQuery = gql`
    query FeaturedWomensCollections($title: String!) {
      collections(first: 10, query: $title) {
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

  const featuredWomenVars = {
    title: featuredWomenQueryHandle,
  };

  const featuredWomenData = await graphqlstorefront(
    featuredWomenQuery,
    featuredWomenVars
  );

  const featuredWomen = featuredWomenData.collections.edges.map(
    (edge: { node: { title: string; image: { url: any; altText: any } } }) => {
      const name = edge.node.title.replace(/^Women's Featured\s/, "");
      return {
        name,
        href: "#",
        imageSrc: edge.node.image.url,
        imageAlt: edge.node.image.altText,
      };
    }
  );

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

  const featuredMenQuery = gql`
    query FeaturedMensCollections($title: String!) {
      collections(first: 10, query: $title) {
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

  const mensFeaturedHandleVariable = {
    title: `title:${mensFeaturedHandle}`,
  };

  const featuredMenCollections = await graphqlstorefront(
    featuredMenQuery,
    mensFeaturedHandleVariable
  );

  const mensFeatured = featuredMenCollections.collections.edges.map(
    (collection: {
      node: {
        title: any;
        onlineStoreUrl: any;
        image: { url: any; altText: any };
      };
    }) => {
      return {
        name: collection.node.title.replace(/^Men's Featured\s/, ""),
        href: collection.node.onlineStoreUrl || "#",
        imageSrc: collection.node.image.url,
        imageAlt: collection.node.image.altText,
      };
    }
  );

  {
    /*Mens Section Menu*/
  }

  //Men's Section Menu

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

  const mensSections = [
    [
      menuSectionReformatter(mensSection1.menu),
      menuSectionReformatter(mensSection2.menu),
      menuSectionReformatter(mensSection3.menu),
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

  const pages = pageData.pages.edges.map(
    (page: { node: { title: any; url: any } }) => {
      return {
        name: page.node.title,
        href: page.node.url || "#",
      };
    }
  );

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
