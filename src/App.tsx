import { useEffect, useMemo, useState } from "react";
import "./App.css";
import UsersList from "./components/UsersList";
import { SortBy, type User } from "./types.d";

import { useIntersectionObserver } from "./hooks/useIntersectionObserver";
import { useUsers } from "./hooks/useUsers";

import Results from "./components/Results";

function App() {
	const { isLoading, isError, users, refetch, fetchNextPage, hasNextPage } =
		useUsers();

	const [colored, setColored] = useState(false);
	const [sorting, setSorting] = useState<SortBy>(SortBy.NONE);
	// const originalUsers = useRef<User[]>([]);
	const [filterC, setFilterC] = useState<string | null>(null);

	const { isIntersecting, ref } = useIntersectionObserver({
		threshold: 0.5,
	});

	useEffect(() => {
		if (isIntersecting) {
			console.log("Cargando siguiente pagina");
			fetchNextPage();
		}
	}, [isIntersecting]);

	const toggleColors = () => {
		setColored(!colored);
	};

	const toggleSortC = () => {
		const newSortVal = sorting === SortBy.NONE ? SortBy.COUNTRY : SortBy.NONE;
		setSorting(newSortVal);
	};

	const handleChangeSort = (sort: SortBy) => {
		setSorting(sort);
	};

	// const handleDelete = (uuid: string) => {
	// 	const filteredUsers = users.filter((u) => u.login.uuid !== uuid);
	// 	setUsers(filteredUsers);
	// };

	const handleReset = async () => {
		await refetch();
	};

	const filteredUsers = useMemo(() => {
		return typeof filterC === "string"
			? users.filter((user) => {
					return user.location.country
						.toLowerCase()
						.includes(filterC.toLowerCase());
			  })
			: users;
	}, [users, filterC]);

	const sortedUsers = useMemo(() => {
		console.log("calculate sortedUsers");

		if (sorting === SortBy.NONE) return filteredUsers;

		const compareProperties: Record<string, (user: User) => any> = {
			[SortBy.COUNTRY]: (user) => user.location.country,
			[SortBy.NAME]: (user) => user.name.first,
			[SortBy.LAST]: (user) => user.name.last,
		};

		return filteredUsers.toSorted((a, b) => {
			const extractProperty = compareProperties[sorting];
			return extractProperty(a).localeCompare(extractProperty(b));
		});
	}, [filteredUsers, sorting]);

	return (
		<>
			<h1>Buscador de personas</h1>

			<Results />

			<header className="botones">
				<button onClick={toggleColors}>Colorear</button>
				<button onClick={toggleSortC}>
					{sorting === SortBy.COUNTRY ? "Desordenar pais" : "Ordenar Pais"}
				</button>
				<button onClick={handleReset}>Resetear</button>
				<input
					placeholder="Filtrar Pais"
					onChange={(e) => setFilterC(e.target.value)}
				/>
			</header>

			<main>
				{users.length > 0 && (
					<>
						<UsersList
							changeSorting={handleChangeSort}
							// handleDelete={handleDelete}
							showColors={colored}
							users={sortedUsers}
						/>
						<div ref={ref} />
					</>
				)}
				{isLoading && <strong>Cargando...</strong>}
				{isError && <p>Error al cargar los datos</p>}
				{!isLoading && !isError && users.length === 0 && <p>No hay usuarios</p>}
				{!hasNextPage && <strong>Ya no hay mas datos</strong>}
			</main>
		</>
	);
}

export default App;
