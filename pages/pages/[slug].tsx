import React from "react";
import { getNavigation, getPageData } from "../../utils/api";

type Props = {};

const Page = (props: Props) => {
  return <div>[slug]</div>;
};

export default Page;

export const getStaticPaths = async () => {
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

export const getStaticProps = async ({
  params,
}: {
  params: { slug: string };
}) => {
  const navigation = await getNavigation();
  const slug = params.slug;

  console.log("slug", slug);

  return {
    props: {
      navigation,
      slug,
    },
  };
};
