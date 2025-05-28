import ReactPaginate from 'react-paginate';
import { ReactNode } from 'react';



export default function PagComp({ currentItems, pageCount, onPageChange}: { currentItems: ReactNode[], pageCount: number, onPageChange:any}) {


  const buffCurrentItems = currentItems.slice(0, 10)

  return (<>
    {buffCurrentItems}
    <ReactPaginate
      breakLabel={"..."}
      className={"flex justify-around items-center bg-blue-500 cent text-white rounded-md p-4 mb-3 "}
      activeClassName={"bg-white text-blue-500 h-8 w-8 text-center content-center rounded-full cursor-pointer"}
      nextLinkClassName={"block cursor-pointer h-8 w-8 hover:bg-blue-600 text-center content-center rounded-full"}
      previousLinkClassName={"block cursor-pointer h-8 w-8 hover:bg-blue-600 text-center content-center rounded-full"}
      pageLinkClassName={"block cursor-pointer h-8 w-8 hover:bg-blue-600 text-center content-center rounded-full"}
      pageCount={pageCount}
      nextLabel={">"}
      previousLabel={"<"}

      pageRangeDisplayed={5}
      renderOnZeroPageCount={null}
      onPageChange={(event) => onPageChange(event)}
    />
  </>);
}