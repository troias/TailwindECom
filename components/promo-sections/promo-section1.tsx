import Link from "next/link";
import React from "react";
import Image from "next/image";
import { type } from "os";

type Props = {
  id: string;
  name: string;
  handle: string;
  products: {
    id: number;
    name: string;
    tags: string[];
    images: {
      id: number;
      src: string;
    }[];
  };

  title?: string;
  subHeading?: string;
};

type Product = {
  id: number;
  name: string;
  tags: string[];
  images: {
    id: number;
    src: string;
  }[];
};

export default function promoSection({ products, title, subHeading }: Props) {
  // A function to shuffle an array randomly
  function shuffleArray(array: any[], limit: number = 0) {
    let currentIndex = array.length,
      temporaryValue,
      randomIndex;

    // While there remain elements to shuffle
    while (0 !== currentIndex) {
      // Pick a remaining element
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      // Swap it with the current element
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    // Return the shuffled array
    if (limit > 0) {
      return array.slice(0, limit);
    }
    //remove duplicates

    const itemSet = new Set(array);
    return itemSet;
  }

  // Shuffle the products array so that the products displayed are random and not the same every time

  const productsData = products[0].products;

  console.log("productsData", productsData);

  const dummyData = {
    id: 1,
    title: "Summer styles are finally here",
    subHeading:
      "This year, our new summer collection will shelter you from the harsh elements of a world that doesn't care if you live or die.",
    buttonTitle: "Shop Collection",
    link: "/",
  };

  return (
    <div className="relative overflow-hidden bg-white">
      <div className="pt-16 pb-80 sm:pt-24 sm:pb-40 lg:pt-40 lg:pb-48">
        <div className="relative mx-auto max-w-7xl px-4 sm:static sm:px-6 lg:px-8">
          <div className="sm:max-w-lg">
            <h1 className="font text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              {dummyData.title}
            </h1>
            <p className="mt-4 text-xl text-gray-500">{dummyData.subHeading}</p>
          </div>
          <div>
            <div className="mt-10">
              {/* Decorative image grid */}
              <div
                aria-hidden="true"
                className="pointer-events-none lg:absolute lg:inset-y-0 lg:mx-auto lg:w-full lg:max-w-7xl"
              >
                <div className="absolute transform sm:left-1/2 sm:top-0 sm:translate-x-8 lg:left-1/2 lg:top-1/2 lg:-translate-y-1/2 lg:translate-x-8">
                  <div className="flex items-center space-x-6 lg:space-x-8">
                    <div className="grid flex-shrink-0 grid-cols-1 gap-y-6 lg:gap-y-8">
                      {/* two products  */}
                      {shuffleArray(productsData, 2).map((product: Product) => (
                        <div
                          className="h-64 w-44 overflow-hidden rounded-lg sm:opacity-0 lg:opacity-100"
                          key={product.id}
                        >
                          <Image
                            src={product.images[0].src}
                            alt=""
                            width={200}
                            height={200}
                            className="h-full w-full object-cover object-center"
                          />
                        </div>
                      ))}
                    </div>

                    <div className="grid flex-shrink-0 grid-cols-1 gap-y-6 lg:gap-y-8">
                      {/* three products  */}

                      {shuffleArray(productsData, 3).map((product: Product) => (
                        <div
                          className="h-64 w-44 overflow-hidden rounded-lg sm:opacity-0 lg:opacity-100"
                          key={product.id}
                        >
                          <Image
                            src={product.images[0].src}
                            alt=""
                            width={200}
                            height={200}
                            className="h-full w-full object-cover object-center"
                          />
                        </div>
                      ))}
                    </div>

                    <div className="grid flex-shrink-0 grid-cols-1 gap-y-6 lg:gap-y-8">
                      {/* two products  */}

                      {shuffleArray(productsData, 2).map((product: Product) => (
                        <div
                          className="h-64 w-44 overflow-hidden rounded-lg sm:opacity-0 lg:opacity-100"
                          key={product.id}
                        >
                          <Image
                            src={product.images[0].src}
                            alt=""
                            width={200}
                            height={200}
                            className="h-full w-full object-cover object-center"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <Link
                href={`/collections/${products[0].handle}`}
                className="inline-block rounded-md border border-transparent bg-indigo-600 py-3 px-8 text-center font-medium text-white hover:bg-indigo-700"
              >
                {dummyData.buttonTitle}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
