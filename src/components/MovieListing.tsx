import {
  Box,
  Button,
  Flex,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Text,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { useState } from "react";
import { headerHeight, horizontalMargin } from "../constants/length";
import { CONTENTS_PER_PAGE } from "../constants/page";
import { useAppSelector } from "../redux/hooks";
import ErrorMsg from "./ErrorMsg";
import LoadingSpinner from "./LoadingSpinner";
import Pagination from "./Pagination";

const MovieListing = () => {
  const { movie } = useAppSelector((state) => state);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedMovie, setSelectedMovie] = useState<any>(null);

  const renderErrorMsg = (error: any) => {
    let errorMsg = "";

    switch (error) {
      case "Movie not found!":
        errorMsg = "Movie not found, try other words.";
        break;
      case "Too many results.":
        errorMsg = "Too many results. Please search with a detailed term.";
        break;
      default:
        errorMsg = "Something went wrong.";
    }

    return <ErrorMsg text={errorMsg} />;
  };

  const onOpenDetails = (movie: any) => {
    setSelectedMovie(movie);
    onOpen();
  };

  const verifyPoster = (movie: any): string =>
    movie.Poster !== "N/A" && movie?.Poster
      ? movie.Poster
      : `${process.env.PUBLIC_URL}/noImageFound.png`;

  return (
    <>
      <Box p={`${headerHeight} ${horizontalMargin}`}>
        {movie?.searchTitle === "" ? (
          <ErrorMsg text="Enter some words in the search box!" />
        ) : movie?.status === "loading" ? (
          <LoadingSpinner />
        ) : movie?.status === "idle" && movie?.contents?.Search?.length ? (
          <Box>
            <Flex
              align="flex-start"
              justify="left"
              alignContent="flex-start"
              flexWrap="wrap"
              mb="24px"
              minH="670px"
            >
              {movie.contents.Search.map((m: any) => (
                <VStack key={m?.imdbID} w="150px" h="325px" m="5px">
                  <Image
                    src={verifyPoster(m)}
                    w="150px"
                    h="225px"
                    objectFit="cover"
                  />
                  <Text
                    fontSize="14px"
                    h="42px"
                    overflow="hidden"
                    mb="16px"
                  >{`${m?.Title} (${m?.Year})`}</Text>
                  <Button
                    onClick={() => onOpenDetails(m)}
                    color="bgBlack"
                    size="sm"
                  >
                    Detail
                  </Button>
                </VStack>
              ))}
            </Flex>
            {movie?.contents?.totalResults > CONTENTS_PER_PAGE && (
              <Pagination />
            )}
          </Box>
        ) : (
          <>{renderErrorMsg(movie?.contents?.Error)}</>
        )}
      </Box>
      {selectedMovie && (
        <Modal isOpen={isOpen} onClose={onClose} isCentered>
          <ModalOverlay bg="blackAlpha.700" />
          <ModalContent
            maxW="850px"
            p="20px"
            bgColor="modalBgBlack"
            color="fontWhite"
          >
            <ModalCloseButton />
            <ModalBody>
              <Flex>
                <Box mr="24px">
                  <Image src={verifyPoster(selectedMovie)} w="300px" />
                </Box>
                <Box>
                  <Text fontWeight="bold" fontSize="24px" mb="24px">
                    {selectedMovie.Title}
                  </Text>
                  <VStack align="flex-start">
                    <Text>Year: {selectedMovie.Year}</Text>
                    <Text>Type: {selectedMovie.Type}</Text>
                    <Text>ID: {selectedMovie.imdbID}</Text>
                  </VStack>
                </Box>
              </Flex>
            </ModalBody>
          </ModalContent>
        </Modal>
      )}
    </>
  );
};

export default MovieListing;
