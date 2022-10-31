// These lines make "require" available
import { createRequire } from "module";
const require = createRequire(import.meta.url);

const request = require("request");

require('dotenv').config();

export default (req, res) => {
  // path to file
  const filePath = req.query.filename;     

  // filename only
  const fileName = filePath.substring(filePath.lastIndexOf("/") + 1);

  // set header
  res.setHeader("content-disposition", "attachment; filename=" + fileName);

  // send request to the original file
  request
    .get(process.env.REMOTE_URL + filePath) // download original image
    .on("error", function(err) {
      res.writeHead(404, { "Content-Type": "text/html" });
      res.write("<h1>404 not found</h1>");
      res.end();
      return;
    })
    .pipe(res); // pipe converted image to HTTP response
};