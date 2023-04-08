import styles from "../styles/Home.module.css";

import PromoSection from "../components/promo-sections/promo-section1";

import Products from "../components/products/products";
import { graphqlstorefront } from "../utils/api";

export default function Home({ products }: { products: any[] }) {
  // console.log('products', products)

  return (
    <div className={styles.container}>
      <PromoSection />
      <Products products={products} />
    </div>
  );
}

export const getStaticProps = async () => {
  const getProducts = async () => {
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

  const data = await getProducts();

  console.log("data", data);

  const products = data.map((product: any) => {
    const node = product.node;
    return {
      id: node.id,
      name: node.title,
      handle: node.handle,
      tags: node.tags,
      price: node.priceRange.minVariantPrice.amount,
      imgSrc: node.images.edges[0].node.transformedSrc,
      href: "#", //change
      imgAlt: node.title,
      color: node.tags[0] || "black",
    };
  });

  // console.log("data", products);

  return {
    props: {
      products: products,
    },
  };
};
