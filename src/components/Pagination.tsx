import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { Center, HStack, Text } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { CONTENTS_PER_PAGE, PAGINATION_LIMIT } from "../constants/contents";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { fetchContents } from "../redux/slices/contents";
import { setPage } from "../redux/slices/page";
import { isNullOrUndefined } from "../utils/lodashExtensions";

const chevrons = { w: "36px", h: "36px", cursor: "pointer" };

const Pagination = () => {
  const firstRendering = useRef<boolean>(true);
  const dispatch = useAppDispatch();
  const {
    contents,
    page: { current: currentPage },
  } = useAppSelector((state) => state);
  const [numOfPages, setNumOfPages] = useState(0);
  const [paginationClicked, setPaginationClicked] = useState(false);

  useEffect(() => {
    // When first rendering, do nothing
    if (firstRendering.current) {
      firstRendering.current = false;
      return;
    }

    if (paginationClicked && currentPage > 0) {
      dispatch(
        fetchContents({
          s: contents.searchTitle,
          page: currentPage,
          type: contents.searchType,
        })
      );
    }
  }, [currentPage]);

  useEffect(() => {
    if (
      !isNullOrUndefined(contents?.result) &&
      contents.result.totalResults !== 0
    ) {
      setNumOfPages(
        Math.ceil(contents.result.totalResults / CONTENTS_PER_PAGE)
      );
    }
  }, [contents.result?.totalResults]);

  const onPaginationClicked = async (i: number) => {
    await setPaginationClicked(true);
    dispatch(setPage(i));
  };

  const createPagination = (numOfPages: number) => {
    const pageIndexComponents = [];
    let lowerLimit = 1;
    let upperLimit = numOfPages;
    const oneSideOfPageRange = Math.floor(PAGINATION_LIMIT / 2);

    // If the total number of pages is greater than the defined pagination range, do not display all page indexes
    if (numOfPages > PAGINATION_LIMIT) {
      const lowerSideIndex = currentPage - oneSideOfPageRange;
      const upperSideIndex = currentPage + oneSideOfPageRange;
      if (lowerSideIndex > 1) lowerLimit = lowerSideIndex;
      // else if (1 + PAGINATION_LIMIT > upperSideIndex)
      //   upperLimit = 1 + PAGINATION_LIMIT;
      if (upperSideIndex < numOfPages) upperLimit = upperSideIndex;
      // else if (numOfPages - PAGINATION_LIMIT < lowerSideIndex)
      //   lowerLimit = numOfPages - PAGINATION_LIMIT;
    }
    for (let i = lowerLimit; i <= upperLimit; i++) {
      pageIndexComponents.push(
        <Text
          key={i}
          onClick={() => onPaginationClicked(i)}
          fontSize="20px"
          cursor="pointer"
          color={i === currentPage ? "vanflixRed" : "fontWhite"}
          fontWeight={i === currentPage ? "bold" : "normal"}
        >
          {i}
        </Text>
      );
    }
    return pageIndexComponents;
  };

  return (
    <>
      {numOfPages !== 0 && (
        <Center p="16px 0">
          <HStack spacing="20px" wrap="wrap" justify="center">
            {currentPage > 1 && (
              <ChevronLeftIcon
                onClick={() => onPaginationClicked(currentPage - 1)}
                sx={chevrons}
              />
            )}
            {createPagination(numOfPages)}
            {currentPage < numOfPages && (
              <ChevronRightIcon
                onClick={() => onPaginationClicked(currentPage + 1)}
                sx={chevrons}
              />
            )}
          </HStack>
        </Center>
      )}
    </>
  );
};

export default Pagination;
