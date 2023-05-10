import {
  ArrowLongLeftIcon,
  ArrowLongRightIcon,
} from "@heroicons/react/20/solid";

import { useState } from "react";

export default function CenterPagination({
  currentPage,
  totalPages,

  gotoPage,

  handleMoveLeft,
  handleMoveRight,
}) {
  const handlePageClick = (page) => {
    gotoPage(page);
  };

  const handleNextClick = () => {
    handleMoveRight();
  };

  const handlePreviousClick = () => {
    handleMoveLeft();
  };

  // const [currentPage, setCurrentPage] = useState(2);
  // const [totalPages, setTotalPages] = useState(10);
  // const [pageNeighbours, setPageNeighbours] = useState(2);

  // const LEFT_PAGE = 'LEFT';
  // const RIGHT_PAGE = 'RIGHT';

  // const range = (from: number, to: number, step = 1) => {
  //     let i = from;
  //     const range: number[] = [];

  //     while (i <= to) {
  //         range.push(i);
  //         i += step;
  //     }

  //     return range;
  // }

  // const fetchPageNumbers = () => {
  //     const totalNumbers = (pageNeighbours * 2) + 3;
  //     const totalBlocks = totalNumbers + 2;

  //     if (totalPages > totalBlocks) {
  //         const startPage = Math.max(2, currentPage - pageNeighbours);
  //         const endPage = Math.min(totalPages - 1, currentPage + pageNeighbours);

  //         let pages: (number | string)[] = range(startPage, endPage);

  //         const hasLeftSpill = startPage > 2;
  //         const hasRightSpill = (totalPages - endPage) > 1;
  //         const spillOffset = totalNumbers - (pages.length + 1);

  //         switch (true) {
  //             case (hasLeftSpill && !hasRightSpill): {
  //                 const extraPages = range(startPage - spillOffset, startPage - 1);
  //                 pages = [LEFT_PAGE, ...extraPages, ...pages];
  //                 break;
  //             }

  //             case (!hasLeftSpill && hasRightSpill): {
  //                 const extraPages = range(endPage + 1, endPage + spillOffset);
  //                 pages = [...pages, ...extraPages, RIGHT_PAGE];
  //                 break;
  //             }

  //             case (hasLeftSpill && hasRightSpill):
  //             default: {
  //                 pages = [LEFT_PAGE, ...pages, RIGHT_PAGE];
  //                 break;
  //             }
  //         }

  //         return [1, ...pages, totalPages];
  //     }

  //     return range(1, totalPages);
  // }

  // const pages = fetchPageNumbers();

  // const gotoPage = (page: number) => {
  //     const currentPage = Math.max(0, Math.min(page, totalPages));
  //     setCurrentPage(currentPage);
  // }

  // const handleClick = (page: number | string) => {
  //     gotoPage(Number(page));
  // }

  // const handleMoveLeft = () => {
  //     gotoPage(currentPage - (pageNeighbours * 2) - 1);
  // }

  // const handleMoveRight = () => {
  //     gotoPage(currentPage + (pageNeighbours * 2) + 1);
  // }

  const renderPageLinks = () => {
    const totalPages = 10; // Total number of pages

    const pageLinks = [];

    // Add page links
    for (let page = 1; page <= totalPages; page++) {
      pageLinks.push(
        <a
          key={page}
          href="#"
          className={`inline-flex items-center border-t-2 ${
            currentPage === page
              ? "border-transparent text-gray-500"
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
            onClick={() => handlePreviousClick()}
          >
            <ArrowLongLeftIcon
              className="mr-3 h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
            Previous
          </a>
        </div>
        <div className="hidden md:-mt-px md:flex">
          {renderPageLinks()}
          {/* Current: "border-indigo-500 text-indigo-600", Default: "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300" */}
          {/* <a
            href="#"
            className="inline-flex items-center border-t-2 border-transparent px-4 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
            aria-current="page"
          >
            1
          </a>
          <a
            href="#"
            className="inline-flex items-center border-t-2 border-indigo-500 px-4 pt-4 text-sm font-medium text-indigo-600"
          >
            2
          </a>
          <a
            href="#"
            className="inline-flex items-center border-t-2 border-transparent px-4 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
          >
            3
          </a>
          <span className="inline-flex items-center border-t-2 border-transparent px-4 pt-4 text-sm font-medium text-gray-500">
            ...
          </span>
          <a
            href="#"
            className="inline-flex items-center border-t-2 border-transparent px-4 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
          >
            8
          </a>
          <a
            href="#"
            className="inline-flex items-center border-t-2 border-transparent px-4 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
          >
            9
          </a>
          <a
            href="#"
            className="inline-flex items-center border-t-2 border-transparent px-4 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
          >
            10
          </a> */}
        </div>
        <div className="-mt-px flex w-0 flex-1 justify-end">
          <a
            href="#"
            className="inline-flex items-center border-t-2 border-transparent pl-1 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
            onClick={() => handleNextClick()}
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
