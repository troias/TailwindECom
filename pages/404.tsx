import { getNavigation } from "../utils/api";

export default function Custom404() {
  return (
    <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-extrabold text-gray-900 sm:text-4xl py-8">
        404 - Page Not Found
      </h1>
    </div>
  );
}

export const getStaticProps = async (ctx) => {
  const navigation = await getNavigation();
  // const slug = params.slug;

  return {
    props: {
      navigation,
    },
  };
};
