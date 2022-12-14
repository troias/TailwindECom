
export const graphqlstorefront = async (query, variables = {}) => {

    console.log('process.env.NEXT_PUBLIC_STORE_DOMAIN', process.env.NEXT_PUBLIC_STORE_DOMAIN)

    const res = await fetch(`${process.env.NEXT_PUBLIC_STORE_DOMAIN}/api/2022-10/graphql.json`, {

        method: 'POST',

        headers: {

            'Content-Type': 'application/json',
            'X-Shopify-Storefront-Access-Token': process.env.NEXT_PUBLIC_STOREFRONT_API_TOKEN,
        },

        body: JSON.stringify({

            query,
            variables

        })
    })

    const response = await res.json()

    console.log('response', response)

    return response.data || response.errors

}










