import styles from "../styles/Home.module.css";

import PromoSection from "../components/promo-sections/promo-section1";

import Products from "../components/products/products";
import { getProducts, getNavigation } from "../utils/api";
import { get } from "http";

export default function Home({ products }: { products: any[] }) {
  return (
    <div className={styles.container}>
      <PromoSection />
      <Products products={products} />
    </div>
  );
}

export const getStaticProps = async () => {
  const data = await getProducts();

  const navigation = await getNavigation();

  // console.log("data1", data1.categories[0].featured);

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
      navigation: navigation,
    },
  };
};
