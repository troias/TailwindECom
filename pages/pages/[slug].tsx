import React, { useEffect, useState, useMemo } from "react";
import { getNavigation } from "../../utils/api";
import { useRouter } from "next/router";
import { usePages } from "../../utils/customHooks/usePages";

type Props = {};

const Page = (props: Props) => {
  const [pageData, setPageData] = useState({});

  //checkPageData is populated

  pageData.page;

  const router = useRouter();

  // get slug from router query
  const { slug } = router.query;

  const data = usePages(slug as string);

  //if PageData is populated set pageData and wrap in memo

  useMemo(() => {
    if (data) {
      setPageData(data);
    }
  }, [data]);

  // console.log("pageData", data);

  return (
    <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
      {pageData.page && (
        <>
          <h1 className="text-2xl font-extrabold text-gray-900 sm:text-4xl py-8">
            {pageData.page.title}
          </h1>
          <div
            dangerouslySetInnerHTML={{ __html: pageData.page.body }}
            className="prose"
          />
        </>
      )}
    </div>
  );
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
