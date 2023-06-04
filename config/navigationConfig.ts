// The Navigation Config is used to set the navigation data for the site.
// The handle is the handle of the collection in Shopify. but in the menu as the title of the dropdown.
// The featured handle is the handle of the collection in Shopify. but in the menu as the featured collections show in left side of the dropdown.
// The section handle is the handle of the collection in Shopify. but in the menu as the section of the dropdown.

export const navigationData = {
  womensNavigationHandle:
    process.env.NEXT_PUBLIC_WOMENS_NAVIGATION_HANDLE || "Women",
  featuredWomenQueryHandle:
    process.env.NEXT_PUBLIC_FEATURED_WOMEN_QUERY_HANDLE ||
    "title:Women's Featured*",

  womensSectionHandlers: {
    womensSection1handle:
      process.env.NEXT_PUBLIC_WOMENS_SECTION_1_HANDLE ||
      "womens-shoes-and-accessories",
    womensSection2Handle:
      process.env.NEXT_PUBLIC_WOMENS_SECTION_2_HANDLE || "brands",
    womensSection3Handle:
      process.env.NEXT_PUBLIC_WOMENS_SECTION_3_HANDLE || "womens-collection",
    womensSection4Handle:
      process.env.NEXT_PUBLIC_WOMENS_SECTION_4_HANDLE || "womens-sale",
    womensSection5Handle:
      process.env.NEXT_PUBLIC_WOMENS_SECTION_5_HANDLE || "womens-accessories",
  },
};

export const mensNavigationData = {
  mensNavigationHandle: process.env.NEXT_PUBLIC_MENS_NAVIGATION_HANDLE || "Men",
  mensFeaturedHandle:
    process.env.NEXT_PUBLIC_MENS_FEATURED_HANDLE || "Men's Featured",
  mensSectionHandlers: {
    mensSection1Handle:
      process.env.NEXT_PUBLIC_MENS_SECTION_1_HANDLE || "mens-shoes-accessories",
    mensSection2Handle:
      process.env.NEXT_PUBLIC_MENS_SECTION_2_HANDLE || "brands",
    mensSection3Handle:
      process.env.NEXT_PUBLIC_MENS_SECTION_3_HANDLE || "mens-collections",
  },
};
