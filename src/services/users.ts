//! Importante, no hacer actualizacion de estados en esta clase de funciones
export const fetchUsers = async ({ pageParam = 1 }: { pageParam?: number }) => {
	return await fetch(
		`https://randomuser.me/api?results=10&seed=thewarriorgw&page=${pageParam}`
	)
		.then(async (res) => {
			if (!res.ok) {
				throw new Error("Error al cargar los datos"); // Forma correcta de validar errores con fetch
			}
			return await res.json();
		})
		.then((res) => {
			const currentPage = Number(res.info.page);
			const nextPage = currentPage > 3 ? undefined : currentPage + 1;
			return {
				users: res.results,
				nextPage,
			};
		});
};
