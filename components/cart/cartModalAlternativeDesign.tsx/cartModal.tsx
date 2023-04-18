import React, { useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { XMarkIcon } from "@heroicons/react/20/solid";

type Props = {};

export default function cartModal({}: Props) {
  const [cartModalOpen, setCartModalOpen] = useState(false);

  const cartModalHander = () => {
    setCartModalOpen(!cartModalOpen);
  };

  return (
    <Transition appear show={cartModalOpen} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-50 overflow-y-auto"
        onClose={cartModalHander}
      >
        <div className="min-h-screen text-center">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75" />
          </Transition.Child>

          <span
            className="inline-block h-screen align-middle"
            aria-hidden="true"
          >
            &#8203;
          </span>

          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
              <Dialog.Title
                as="h3"
                className="text-lg font-medium leading-6 text-gray-900"
              >
                Cart
              </Dialog.Title>
              <div className="mt-2">
                <div className="flex justify-between">
                  <div className="flex">
                    <img
                      src="https://tailwindui.com/img/ecommerce-images/shopping-cart-page-04-product-01.jpg"
                      alt="Salmon orange fabric pouch with match zipper, gray zipper pull, and adjustable hip belt."
                      className="w-20 h-20 rounded-md object-center object-cover"
                    />
                    <div className="ml-4">
                      <div className="text-sm">
                        <a href="#" className="font-medium text-gray-900">
                          Hipster Pouch
                        </a>
                      </div>
                      <div className="flex">
                        <p className="text-sm font-medium text-gray-900">1 ×</p>
                        <p className="ml-2 text-sm text-gray-500">$32.00</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <button
                      type="button"
                      className="text-gray-400 hover:text-gray-500"
                    >
                      <span className="sr-only">Remove</span>
                      <XMarkIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <button
                  type="button"
                  className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500"
                  onClick={cartModalHander}
                >
                  Checkout
                </button>
                <button
                  type="button"
                  className="inline-flex justify-center ml-4 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-transparent rounded-md hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500"
                  onClick={cartModalHander}
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}
