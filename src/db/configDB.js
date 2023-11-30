import mongoose from "mongoose";

const URI =
  "mongodb+srv://joaquinfefe:ecommercecoder@ecommerce.gmltjrj.mongodb.net/?retryWrites=true&w=majority";

mongoose
  .connect(URI)
  .then(() => console.log("Conectado a DB"))
  .catch((error) => console.log(error));
