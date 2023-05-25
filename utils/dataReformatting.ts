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
    [name]: options,
  }));
};
