import { app } from "./app.js";
import { dbconn } from "./data/connectdb.js";

const PORT = process.env.PORT || 3000;


dbconn()
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
