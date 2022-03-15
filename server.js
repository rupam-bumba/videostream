let http = require("http")
let app = require("./app")





let server = http.createServer(app)

server.listen(process.env.PORT || 9090, () => {
    console.log("server\t::\t" + process.env.PORT || 9090);
  });