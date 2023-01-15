export const formatPrice = (price: number) => {


    const formatCurr = Intl.NumberFormat("en-AU", {
        style: 'currency',
        currency: 'NZD',
        maximumFractionDigits: 2,
        minimumFractionDigits: 2,
        maximumSignificantDigits: 2,
        minimumSignificantDigits: 2,
        currencyDisplay: 'symbol',

    }).format(price)

    const addDollarSign = formatCurr.replace('NZD', '$')

    return addDollarSign






}

