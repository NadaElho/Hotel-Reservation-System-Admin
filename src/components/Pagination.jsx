import ReactPaginate from "react-paginate";

const Pagination = ({
  pageCount,
  handlePageClick,
  handleLimit,
  limit,
  noOfItems = 10,
}) => {
  let arr = [];
  for (let i = 1; i <= noOfItems; i++) {
    arr.push(i);
  }

  return (
    <div className="py-4 px-8 bg-white w-fit border rounded-full flex items-center gap-4">
      <ReactPaginate
        breakLabel="..."
        nextLabel="&gt;"
        onPageChange={handlePageClick}
        pageRangeDisplayed={2}
        pageCount={pageCount}
        previousLabel="&lt;"
        renderOnZeroPageCount={null}
        containerClassName="flex items-center -space-x-px h-8 text-sm gap-4 "
        pageClassName="text-main-400"
        previousClassName="text-main-400 border border-main-400 rounded-full w-5 h-5 flex items-center justify-center"
        nextClassName="text-main-400 border border-main-400 rounded-full w-5 h-5 flex items-center justify-center"
        breakLinkClassName="text-main-400"
        activeClassName="bg-grey-500 text-main-400 font-bold border border-grey-500 rounded-full w-7 h-7 flex items-center justify-center text-center"
      />
      <div>
        <span className="text-sm text-main-400 mx-2">Page items</span>
        <select
        value={limit}
          name="no"
          className="bg-main-400 text-white border-0 outline-none focus:ring-0 rounded"
          onChange={(e) => handleLimit(e.target.value)}
        >
          {arr.map((op) => (
            <option value={op} key={op}>
              {op}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default Pagination;
