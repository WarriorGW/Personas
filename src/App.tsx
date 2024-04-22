import { useEffect, useMemo, useRef, useState } from "react";
import "./App.css";
import UsersList from "./components/UsersList";
import { SortBy, type User } from "./types.d";

function App() {
	const [users, setUsers] = useState<User[]>([]);
	const [colored, setColored] = useState(false);
	const [sorting, setSorting] = useState<SortBy>(SortBy.NONE);
	const originalUsers = useRef<User[]>([]);
	const [filterC, setFilterC] = useState<string | null>(null);

	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(false);

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

	const handleDelete = (uuid: string) => {
		const filteredUsers = users.filter((u) => u.login.uuid !== uuid);
		setUsers(filteredUsers);
	};

	const handleReset = () => {
		setUsers(originalUsers.current);
	};

	const filteredUsers = useMemo(() => {
		return typeof filterC === "string"
			? users.filter((u) => {
					return u.location.country
						.toLowerCase()
						.includes(filterC.toLowerCase());
			  })
			: users;
	}, [users, filterC]);

	const sortedUsers = useMemo(() => {
		if (sorting === SortBy.NAME) {
			return filteredUsers.toSorted((a, b) => {
				return a.name.first.localeCompare(b.name.first);
			});
		}
		if (sorting === SortBy.LAST) {
			return filteredUsers.toSorted((a, b) => {
				return a.name.last.localeCompare(b.name.last);
			});
		}
		if (sorting === SortBy.COUNTRY) {
			return filteredUsers.toSorted((a, b) => {
				return a.location.country.localeCompare(b.location.country);
			});
		}
		return filteredUsers;
	}, [filteredUsers, sorting]);

	useEffect(() => {
		setIsLoading(true);
		setError(false);
		fetch("https://randomuser.me/api?results=10")
			.then(async (res) => {
				if (!res.ok) {
					throw new Error("Error al cargar los datos"); // Forma correcta de validar errores con fetch
					// axios si lo gestiona con el catch
					// axios.get('https://randomuser.me/api?results=10').catch((err) => console.log(err))
				}
				return await res.json();
			})
			.then((res) => {
				setUsers(res.results);
				originalUsers.current = res.results;
			})
			.catch((err) => {
				setError(true);
				console.log(err);
			})
			.finally(() => {
				setIsLoading(false);
			});
	}, []);

	return (
		<>
			<h1>Buscador de personas</h1>

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
				{isLoading && <div>Cargando...</div>}
				{!isLoading && error && <div>Error al cargar los datos</div>}
				{!isLoading && !error && users.length === 0 && <p>No hay usuarios</p>}
				{!isLoading && !error && users.length > 0 && (
					<UsersList
						changeSorting={handleChangeSort}
						handleDelete={handleDelete}
						showColors={colored}
						users={sortedUsers}
					/>
				)}
			</main>
		</>
	);
}

export default App;
