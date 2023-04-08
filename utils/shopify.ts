export const graphqlAdmin = async (query: string, variables = {}) => {
  console.log(
    `${process.env.NEXT_PUBLIC_STORE_DOMAIN}/admin/api/2023-04/graphql.json`
  );
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_STORE_DOMAIN}/admin/api/2023-04/graphql.json`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": process.env.NEXT_PUBLIC_ADMIN_API_TOKEN,
      },

      body: JSON.stringify({
        query,
        variables,
      }),
    }
  );

  if (res.status !== 200) {
    console.log("Failed to fetch API (admin) from Shopify", res);
    throw new Error(
      "Failed to fetch API (admin) from Shopify AP BECAUSE OF THIS ERROR: "
    );
  }

  const response = await res.json();

  // console.log("graphqlAdmin", response);

  return response.data || response.errors;
};

export const getCategories = async () => {
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

  const data = await graphqlAdmin(query);
  console.log("getCategoriesAdmin", data);
};
