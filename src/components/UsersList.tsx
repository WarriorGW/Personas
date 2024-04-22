import { type User, SortBy } from "../types.d";

interface Props {
	handleDelete: (uuid: string) => void;
	changeSorting: (sort: SortBy) => void;
	showColors: boolean;
	users: User[];
}

function UsersList({ users, showColors, handleDelete, changeSorting }: Props) {
	return (
		<table>
			<thead>
				<tr>
					<th>Foto</th>
					<th className="pointer" onClick={() => changeSorting(SortBy.NAME)}>
						Nombre
					</th>
					<th className="pointer" onClick={() => changeSorting(SortBy.LAST)}>
						Apellido
					</th>
					<th className="pointer" onClick={() => changeSorting(SortBy.COUNTRY)}>
						Pais
					</th>
					<th>Acciones</th>
				</tr>
			</thead>
			<tbody>
				{users.map((u, i) => {
					const backgroundColor = i % 2 === 0 ? "#333" : "#555";
					const color = showColors ? backgroundColor : "transparent";
					return (
						<tr key={u.login.uuid} style={{ backgroundColor: color }}>
							<td>
								<img src={u.picture.thumbnail} alt={u.name.first} />
							</td>
							<td>{u.name.first}</td>
							<td>{u.name.last}</td>
							<td>{u.location.country}</td>
							<td>
								<button onClick={() => handleDelete(u.login.uuid)}>
									Eliminar
								</button>
							</td>
						</tr>
					);
				})}
			</tbody>
		</table>
	);
}

export default UsersList;
