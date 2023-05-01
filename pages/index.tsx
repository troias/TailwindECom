import styles from "../styles/Home.module.css";

import PromoSection from "../components/promo-sections/promo-section1";

import Products from "../components/products/products";
import {
  getProducts,
  getNavigation,
  getHeroProducts,
  getFooterMenuData,
} from "../utils/api";
import { get } from "http";

export default function Home({
  products,
  heroData,
}: {
  products: any[];
  heroData: any[];
}) {
  // console.log("heroData", heroData);
  return (
    <div className={styles.container}>
      <PromoSection products={heroData} />
      <Products products={products} />
    </div>
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

  const footerData = await getFooterMenuData();

  console.log("footerData", footerData);

  function convertFooterDataToNavigation(footerData: {
    [x: string]: { title: string; items: { title: string }[] };
  }) {
    const navigation = {};

    // iterate over the menus in the footerData object
    Object.values(footerData).forEach((menu) => {
      const menuTitle = menu.title;

      // check if the navigation already has a category for this menu
      // if not, create a new category in the navigation object for this menu
      if (!navigation[menuTitle]) {
        navigation[menuTitle] = [];
      }

      // iterate over the menu items and add them to the category
      menu.items.forEach((item) => {
        navigation[menuTitle].push({ name: item.title });
      });
    });

    return navigation;
  }

  const footer = convertFooterDataToNavigation(footerData);

  console.log("data", footer);

  return {
    props: {
      products,
      navigation,
      heroData,
      footer,
    },
  };
};
