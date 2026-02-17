// import { Client, Databases, ID, Query } from "appwrite";
import { Client, TablesDB, ID, Query } from "appwrite";

const PROJECT_ID = import.meta.VITE_APPWRITE_PROJECT_ID;
const ENDPOINT = import.meta.VITE_APPWRITE_ENDPOINT;
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const TABLE_ID = import.meta.env.VITE_APPWRITE_TABLE_ID;

const client = new Client();
client.setEndpoint("https://sfo.cloud.appwrite.io/v1");
client.setProject("6993e1c00024662a06ac");

const database = new TablesDB(client);
// export { client, db };

// <------------------------------------------------------------------------>
export const updateSearchCount = async (searchTerm, movie) => {
  // 1. Use Appwrite SDK to check if the search term exists in the database
  try {
    const response = await database.listRows({
      databaseId: DATABASE_ID,
      tableId: TABLE_ID,
      queries: [Query.equal("searchTerm", searchTerm)],
    });

    // 2. If it does, update the count
    if (response.rows.length > 0) {
      const row = response.rows[0];

      await database.updateRow({
        databaseId: DATABASE_ID,
        tableId: TABLE_ID,
        rowId: row.$id,
        data: { count: row.count + 1 },
      });
      // 3. If it doesn't, create a new document with the search term and count as 1
    } else {
      await database.createRow({
        databaseId: DATABASE_ID,
        tableId: TABLE_ID,
        rowId: ID.unique(),
        data: {
          searchTerm,
          count: 1,
          movie_id: movie.id,
          poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
        },
      });
    }
  } catch (error) {
    console.log(error);
  }
};

// <------------------------------------------------------------------------>
// export const getTrendingMovies = async () => {
//   try {
//     const response = await database.listRows({
//       databaseId: DATABASE_ID,
//       tableId: TABLE_ID,
//     });
//     console.log(`response -> ${response}`);
//   } catch (error) {
//     console.error(`Trending Error Movies -> ${error}`);
//   }
// };
