import { app } from "./app.js";
import { dbconn } from "./data/connectdb.js";
import { config } from "dotenv";
config()
const port = process.env.PORT


dbconn()
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
