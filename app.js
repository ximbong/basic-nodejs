const http = require("http"),
  fs = require("fs"),
  os = require("os"),
  qs = require("querystring"),
  sendEmail = require("./emailSender"),
  getDateTime = require("./getDateTime");

const port = 3000,
  hostname = "127.0.0.1";

http
  .createServer((req, res) => {
    const pageUrl = req.url;

    //handle response
    if (pageUrl === "/" || pageUrl === "/home") {
      res.writeHead(200, { "Content-Type": "text/html" });
      res.write("Go to contact page for more info.");
      res.end();
    } else if (pageUrl === "/about") {
      res.writeHead(200, { "Content-Type": "text/html" });
      res.write("This is the about page");
      res.end();
    } else if (pageUrl === "/contact") {
      fs.readFile("contact.html", (err, data) => {
        if (err) {
          return console.log(err);
        }
        res.writeHead(200, { "Content-Type": "text/html" });
        res.write(data);
        res.end();
      });
    }

    //handle post request and send email
    if (req.method == "POST") {
      let body = "";
      let post = {};
      let firstname, lastname, email;

      req.on("data", function(data) {
        body += data;
      });
      req.on("end", function() {
        ({ firstname, lastname, email } = qs.parse(body));
        sendEmail(email, firstname, lastname);
      });

      res.writeHead(200, { "Content-Type": "text/plain" }, function() {
        res.end("Email sent!");
      });
    }

    //handle user log
    const username = os.hostname();
    const currentTime = getDateTime();
    const userIP = req.connection.remoteAddress;

    const userTrack =
      pageUrl === "/favicon.ico"
        ? ``
        : `User ${username}, User IP: ${userIP}, currentTime: ${currentTime}, current page: ${pageUrl} \n`;

    fs.appendFile("user-log.txt", userTrack, e => {
      if (e) {
        console.log(e);
      }
      console.log(
        `User ${username}, User IP: ${userIP}, currentTime: ${currentTime}, current page: ${pageUrl} \n`
      );
    });
  })
  .listen(port, hostname, () => {
    console.log(`Server is running on ${port}`);
  });
