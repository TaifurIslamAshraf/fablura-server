import { app } from "./app";
import { dbConnection } from "./src/config/db";
import secret from "./src/config/secret";

const startServer = () => {
  try {
    app.listen(secret.PORT, () => {
      console.log(`Server is running at http://localhost:${secret.PORT}`);
    });
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

//database connection
dbConnection();

startServer();
