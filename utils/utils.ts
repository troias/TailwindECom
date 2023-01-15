export const formatPrice = (price: string) => {

    const convertStrToInt = parseInt(price.replace(/[^0-9]/g, ''))


    const formatCurr = Intl.NumberFormat("en-AU", {
        style: 'currency',
        currency: 'NZD',
        maximumFractionDigits: 2,
        minimumFractionDigits: 2,
        maximumSignificantDigits: 2,
        minimumSignificantDigits: 2,
        currencyDisplay: 'symbol',

    }).format(convertStrToInt)

    const addDollarSign = formatCurr.replace('NZD', '$')

    console.log("object", addDollarSign)

    return addDollarSign






}

