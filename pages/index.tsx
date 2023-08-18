import styles from "../styles/Home.module.css";
import PromoSection from "../components/promo-sections/promo-section1";
import Products from "../components/products/products";
import { getProducts, getNavigation, getHeroProducts } from "../utils/api";
import Layout from "../components/Layout/layout";

export default function Home({
  products,
  heroData,
}: {
  products: any[];
  heroData: any[];
}) {
  return (
    <Layout>
      <PromoSection products={heroData} />
      <Products products={products} />
    </Layout>
  );
}

export const getStaticProps = async () => {
  const data = await getProducts();
  const navigation = await getNavigation();
  const heroData = await getHeroProducts("Men's Featured Artwork Tees");
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

  // when page is loaded get the footer data from state add to static props

  return {
    props: {
      products,
      navigation,
      heroData,
    },
  };
};
