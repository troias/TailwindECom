export const formatPrice = (price: string) => {
  const convertStrToInt = parseInt(price.replace(/[^0-9]/g, ""));

  const formatCurr = Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "NZD",
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
    maximumSignificantDigits: 2,
    minimumSignificantDigits: 2,
    currencyDisplay: "symbol",
  }).format(convertStrToInt);

  const addDollarSign = formatCurr.replace("NZD", "$");

  return addDollarSign;
};

export function convertFooterDataToNavigation(
  footerData: {
    [x: string]: {
      title: string;
      items: { title: string }[];
      href?: string;
    };
  },
  socialMedia: {
    [x: string]: {
      name: string;
      href: string;
    }[];
  }[]
) {
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
      navigation[menuTitle].push({
        name: item.title || "Item",
        href: item.href || "#",
      });
    });
  });

  // add the social media and legal categories to the footer navigation
  Object.values(socialMedia).forEach((menu) => {
    const menuTitle = menu[0].name || "Social Media";

    // check if the navigation already has a category for this menu
    // if not, create a new category in the navigation object for this menu
    if (!navigation[menuTitle]) {
      navigation[menuTitle] = [];
    }

    // iterate over the menu items and add them to the category
    menu.forEach((item) => {
      navigation[menuTitle].push({
        name: item.name,
        href: item.href || "#",
      });
    });
  });

  return navigation;
}

export const addSocialIconsToFooter = (
  footer: {
    [x: string]: [
      {
        title?: string;
        items: [
          {
            title?: string;
            href?: string;
          }
        ];
      }
    ];
  },
  social: {
    [x: string]: [
      {
        name: string;
        href: string;
        icon: (props: { fill: string; viewBox: string }) => JSX.Element;
      }
    ];
  }
) => {
  const footerObj: {
    [key: string]: {
      name: string;
      href: string;
      icon?: (props: { fill: string; viewBox: string }) => JSX.Element;
    }[];
  } = { ...footer, ...social };

  //remove quotemarks from keys

  function makeIterableObject(obj) {
    const iterableObj = [];
    for (const key in obj) {
      if (Object.hasOwnProperty.call(obj, key)) {
        iterableObj.push({
          key: key.trim(),
          value: obj[key],
        });
      }
    }
    return iterableObj;
  }

  const iterableObj = makeIterableObject(footerObj);

  return iterableObj;
};

//String functions

export function capitalizeFirstLetter(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

//date functions

export const displayCurrentYear = new Date().getFullYear();

//check if array is populated
export const checkArrPopulated = (footerData: any[]) => {
  return footerData.length > 0 ? true : false;
};
