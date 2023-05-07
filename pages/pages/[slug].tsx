import React from "react";
import { getNavigation, getPageData } from "../../utils/api";
import { useRouter } from "next/router";

type Props = {};

const Page = (props: Props) => {
  const router = useRouter();

  //get Query from router

  const { id } = router.query;

  console.log("slugRR", id);

  return <div>[slug]</div>;
};

export default Page;

export const getStaticPaths = async (ctx) => {
  //dummy data
  const paths = [
    { params: { slug: "about-us" } },
    { params: { slug: "contact" } },
    { params: { slug: "faq" } },
    { params: { slug: "search" } },
  ];

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps = async (ctx) => {
  const navigation = await getNavigation();
  // const slug = params.slug;

  return {
    props: {
      navigation,
    },
  };
};
