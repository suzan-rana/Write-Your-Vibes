import React, { SetStateAction, useState } from "react";
import { cn } from "~/lib/utils";

type Props = {
  currentPage: number;
  setCurrentPage: React.Dispatch<SetStateAction<number>>;
  totalPages: number;
  handleDecreasePage: () => void;
  handleIncreasePage: (totalPages: number) => void;
};

const Pagination = ({
  currentPage,
  totalPages,
  setCurrentPage,
  handleIncreasePage,
  handleDecreasePage,
}: Props) => {
  const array = new Array(totalPages).fill(1).map((_, i) => i + 1);
  return (
    <section className="mx-auto my-12 flex flex-col gap-5 px-2 py-3 md:flex-row md:justify-center md:items-start md:gap-3">
      <button
        onClick={handleDecreasePage}
        className="rounded-md bg-slate-800 px-3 py-2 text-sm"
      >
        Previous
      </button>
      <div className="mx-auto flex w-[80%] flex-wrap items-center justify-center gap-3  md:mx-0 md:w-auto">
        {array.map((a) => (
          <p key={a}
            onClick={() => setCurrentPage(a)}
            className={cn(
              "cursor-pointer rounded-md bg-slate-800 px-3 py-2 text-sm ",
              currentPage === a && "bg-red-400 text-black"
            )}
          >
            {a}
          </p>
        ))}
      </div>
      <button
        onClick={() => handleIncreasePage(totalPages)}
        className="rounded-md bg-slate-800 px-3 py-2 text-sm"
      >
        Next
      </button>
    </section>
  );
};

export default Pagination;

export const usePagination = () => {
  const [currentPage, setCurrentPage] = useState(1);

  const handleIncreasePage = (totalPages: number) => {
    if (currentPage === totalPages) return;
    setCurrentPage((prev) => prev + 1);
  };
  const handleDecreasePage = () => {
    if (currentPage === 1) return;
    setCurrentPage((prev) => prev - 1);
  };
  return {
    currentPage,
    setCurrentPage,
    handleDecreasePage,
    handleIncreasePage,
  };
};
