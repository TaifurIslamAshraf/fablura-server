import { app } from "./app";
import secret from "./src/config/secret";

const startServer = () => {
  try {
    app.listen(secret.PORT, () => {
      console.log(`Server is running at http://localhost:${8000}`);
    });
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

startServer();
