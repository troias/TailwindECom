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
  // console.log("getCategories", data);
  return data.collections.edges;
};

export const getNavigation = async () => {
  const gql = String.raw;
  const query = gql`
    query Categories {
      products(first: 5) {
        edges {
          node {
            id
            title
          }
        }
      }
    }
  `;

  const data = await graphqlstorefront(query);

  // console.log("getNavigation", data.products.edges);
};

//categories [
// id,
// name,
// featured: [
// {
// name,
// href,
// imageSrc,
// imageAlt
// }
// ],
// sections: [
// [{
//   id,
//   name,
//   items: [
//   {name,
// href}
// ]
// }]
// ],
// ],
// pages: [
// {name, href}
// ]
// }
