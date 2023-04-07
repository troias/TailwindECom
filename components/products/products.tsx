import { Product } from "@shopify/hydrogen/dist/esnext/storefront-api-types";
import Link from "next/link";
import Image from "next/image";
import { formatPrice } from "../../utils/utils";

export default function Products({ products }: { products: any }) {
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900 py-8">
          Customers also purchased
        </h2>

        {/* <Image src={products
                    .map((product: any) => product.imgSrc)
                    .filter((imgSrc: any) => imgSrc)
                    .map((imgSrc: any) => imgSrc)
                    .join(',')} alt="Picture of the author" width={250} height={250} /> */}

        <div className="mt-6 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
          {products.map((product: Product) => (
            <div key={product.id} className="group relative">
              <div className="  overflow-hidden rounded-md bg-gray-200 group-hover:opacity-75  ">
                <Image
                  src={product.imgSrc}
                  alt={product.name}
                  width={1000}
                  height={1000}
                  className="rounded-md "
                />
              </div>
              <div className="mt-4 flex justify-between">
                <div>
                  <h3 className="text-sm text-gray-700">
                    <Link href={`/products/${product.handle}`} id={product.id}>
                      <span aria-hidden="true" className="absolute inset-0" />
                      {product.name}
                    </Link>
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">{product.color}</p>
                </div>
                <p className="text-sm font-medium text-gray-900">
                  {formatPrice(product.price)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
