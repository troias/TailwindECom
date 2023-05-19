import {
  ArrowLongLeftIcon,
  ArrowLongRightIcon,
} from "@heroicons/react/20/solid";

import { useState } from "react";

export default function CenterPagination({
  totalPages: totalPages = () => 10,

  gotoPage: gotoPage = (page) => {},

  handleMoveLeft = () => {},
  handleMoveRight = () => {},
}) {
  const handlePageClick = (page) => {
    gotoPage(page);
    setCurrentPage(page);
  };

  const handleNextClick = (e) => {
    // e.preventDefault();
    handleMoveRight();
    setCurrentPage(() => {
      if (currentPage < totalPages()) {
        return currentPage + 1;
      } else {
        return currentPage;
      }
    });
  };

  const handlePreviousClick = (e) => {
    // e.preventDefault();
    handleMoveLeft();
    setCurrentPage(() => {
      if (currentPage > 1) {
        return currentPage - 1;
      } else {
        return currentPage;
      }
    });
  };

  const [currentPage, setCurrentPage] = useState(1);

  const renderPageLinks = (totalPages: number) => {
    const totalPagesInternal = totalPages || 10; // Total number of pages

    const pageLinks = [];

    // Add page links
    for (let page = 1; page <= totalPagesInternal; page++) {
      pageLinks.push(
        <a
          key={page}
          href="#"
          className={`inline-flex items-center border-t-2 ${
            currentPage === page
              ? "border-indigo-500 text-indigo-600"
              : "border-gray-300 hover:border-gray-300 text-gray-500 hover:text-gray-700"
          } px-4 pt-4 text-sm font-medium`}
          onClick={() => handlePageClick(page)}
        >
          {page}
        </a>
      );
    }

    return pageLinks;
  };

  return (
    <div className="px-8 border gray-200 rounded-lg">
      <div className="border-b border-gray-200 py-4" />
      <nav className="pb-4 flex items-center justify-between border-t border-gray-200 px-4 sm:px-0 ">
        <div className="-mt-px flex w-0 flex-1">
          <a
            href="#"
            className="inline-flex items-center border-t-2 border-transparent pr-1 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
            onClick={(e) => handlePreviousClick(e)}
          >
            <ArrowLongLeftIcon
              className="mr-3 h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
            Previous
          </a>
        </div>
        <div className="hidden md:-mt-px md:flex">
          {renderPageLinks(totalPages())}
        </div>
        <div className="-mt-px flex w-0 flex-1 justify-end">
          <a
            href="#"
            className="inline-flex items-center border-t-2 border-transparent pl-1 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
            onClick={(e) => handleNextClick(e)}
          >
            Next
            <ArrowLongRightIcon
              className="ml-3 h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
          </a>
        </div>
      </nav>
    </div>
  );
}
