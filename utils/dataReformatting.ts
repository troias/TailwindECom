export const getVariantOptions = (
  variantsResponse: VariantsResponse
): Array<{ [key: string]: Variant[] }> => {
  const { edges } = variantsResponse.variants;

  const variantsMap: { [key: string]: Variant[] } = {};

  edges.forEach((edge) => {
    const { selectedOptions } = edge.node;

    selectedOptions.forEach((option) => {
      const { name, value } = option;
      if (!variantsMap[name]) {
        variantsMap[name] = [];
      }
      const label = `${name}: ${value}`;
      variantsMap[name].push({ value, label });
    });
  });

  return Object.entries(variantsMap).map(([name, options]) => ({
    id: name,
    [name]: name,
    options,
  }));
};

export function formatDate(dateString) {
  const date = new Date(dateString);

  // Get the month, day, and year from the date object
  const month = date.getMonth() + 1; // Months are zero-based, so adding 1
  const day = date.getDate();
  const year = date.getFullYear();

  // Format the date as mm/dd/yyyy
  const formattedDate = `${month.toString().padStart(2, "0")}/${day
    .toString()
    .padStart(2, "0")}/${year}`;

  return formattedDate;
}

// Example usage:
// const createdAt = product.node.createdAt;
// const formattedDate = formatDate(createdAt);
// console.log("date", formattedDate);
