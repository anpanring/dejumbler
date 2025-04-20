import { ListData, ListMetadata } from "@/types/dejumbler-types";
import { useQuery } from "@tanstack/react-query";

const useGetList = (currentList: ListMetadata) => {
  const { data, isLoading } = useQuery({
    queryKey: ['get-list', currentList.id],
    queryFn: async (): Promise<ListData> => {
      return fetch(`/api/get-list?id=${currentList.id}`).then((res) =>
        res.json(),
      );
    },
  });

  return {
    data,
    isLoading,
  }
};

export default useGetList;