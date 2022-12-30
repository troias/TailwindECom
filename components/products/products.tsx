import Image from 'next/image'
/*
  This example requires some changes to your config:
  
  ```
  // tailwind.config.js
  module.exports = {
    // ...
    plugins: [
      // ...
      require('@tailwindcss/aspect-ratio'),
    ],
  }
  ```
*/
// const products = [
//     {
//         id: 1,
//         name: 'Basic Tee',
//         href: '#',
//         imageSrc: 'https://tailwindui.com/img/ecommerce-images/product-page-01-related-product-01.jpg',
//         imageAlt: "Front of men's Basic Tee in black.",
//         price: '$35',
//         color: 'Black',
//     },
//     {
//         id: 2,
//         name: 'Basic Tee',
//         href: '#',
//         imageSrc: 'https://tailwindui.com/img/ecommerce-images/product-page-01-related-product-02.jpg',
//         imageAlt: "Front of mens Basic Tee in heather gray.",
//         price: '$35',
//         color: 'Heather Gray',
//     },
//     {
//         id: 3,
//         name: 'Basic Tee',
//         href: '#',
//         imageSrc: 'https://tailwindui.com/img/ecommerce-images/product-page-01-related-product-03.jpg',
//         imageAlt: " Back of mens Basic Tee in heather gray.",
//         price: '$35',
//         color: 'Heather Gray',
//     },
//     {
//         id: 4,
//         name: 'Basic Tee',
//         href: '#',
//         imageSrc: 'https://tailwindui.com/img/ecommerce-images/product-page-01-related-product-04.jpg',
//         imageAlt: "Front of mens Basic Tee in white.",
//         price: '$35',
//         color: 'White',
//     },

// More products...
// ]

export default function Products(
    { products }: {
        products: any
    }
) {

    console.log('PRODUCTS121', products)
    return (
        <div className="bg-white">
            <div className="mx-auto max-w-2xl py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
                <h2 className="text-2xl font-bold tracking-tight text-gray-900">Customers also purchased</h2>

                <Image src={products
                    .map((product: any) => product.imgSrc)
                    .filter((imgSrc: any) => imgSrc)
                    .map((imgSrc: any) => imgSrc)
                    .join(',')} alt="Picture of the author" width={250} height={250} />


                <div className="mt-6 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
                    {products.map((product) => (
                        <div key={product.id} className="group relative">
                            <div className="min-h-80 aspect-w-2 aspect-h-2 w-full overflow-hidden rounded-md bg-gray-200 group-hover:opacity-75 lg:aspect-none lg:h-80">

                            </div>
                            <div className="mt-4 flex justify-between">
                                <div>
                                    <h3 className="text-sm text-gray-700">
                                        <a href={product.href}>
                                            <span aria-hidden="true" className="absolute inset-0" />
                                            {product.name}
                                        </a>
                                    </h3>
                                    <p className="mt-1 text-sm text-gray-500">{product.color}</p>
                                </div>
                                <p className="text-sm font-medium text-gray-900">{product.price}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
