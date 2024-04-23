import { fetchUsers } from "../services/users";
import { useInfiniteQuery } from "@tanstack/react-query";
import { type User } from "../types.d";

export const useUsers = () => {
	const { isLoading, isError, data, refetch, fetchNextPage, hasNextPage } =
		useInfiniteQuery<{ nextPage?: number; users: User[] }>({
			queryKey: ["users"],
			queryFn: ({ pageParam }) => {
				if (typeof pageParam !== "number") {
					throw new Error("pageParam must be a number");
				}
				return fetchUsers({ pageParam });
			},
			getNextPageParam: (lastPage) => lastPage.nextPage,
			initialPageParam: 1,
			refetchOnWindowFocus: false,
			refetchOnMount: false,
			refetchOnReconnect: false,
		});
	// const { isLoading, isError, data, refetch } = useInfiniteQuery<{
	// 	nextPage: number;
	// 	users: User[];
	// }>(["users"], fetchUsers, {
	// 	getNextPageParam: (lastPage) => lastPage.nextPage,
	// });
	return {
		isLoading,
		isError,
		users: data?.pages?.flatMap((page) => page.users) ?? [],
		refetch,
		fetchNextPage,
		hasNextPage,
	};
};
