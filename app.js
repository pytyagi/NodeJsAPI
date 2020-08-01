// Importing http and https module
const http = require("http");
const https = require("https");

// Set the port to 3000 if npt available just the available environment port
const PORT = process.env.PORT || 3000;

let responseArray = [];

// Hit the time API using https module. Fetch and axios could also be used.
https.get("https://time.com/", resp => {
  let data = "";

  resp.on("data", chunk => {
    data += chunk;
  });

  resp.on("end", () => {
    //   Regex to filter the section containing latest stories.
    const res1 = data.match(
      /<section class="homepage-module latest" data-module_name="Latest Stories"(.|\n)*?<\/section>/
    );
    //   Regex to filter the title and link from the section above.
    const res2 = res1[0].match(/<h2\sclass="title"(.|\n)*?<\/h2>/g);

    // Loop through the stories to generate the response.
    for (let i = 0; i < res2.length; i++) {
      let s = res2[i];

      let title = s.slice(s.indexOf("/>") + 2, s.indexOf("</a"));
      let link = s.slice(s.indexOf("=/") + 2, s.indexOf("/>"));
      let responseObj = {
        title: title,
        link: `https://time.com/${link}`
      };
      responseArray.push(responseObj);
    }
  });
});

// Created the http server. We can also use the express module but since this Assignment have just one end point to hit.
const server = http.createServer((req, res) => {
  // console.log("req", req);
  if (req.url == "/10.23.34.45/getTimeStories" && req.method == "GET") {
    // console.log("response", responseArray);
    res.writeHead(200, { "Content-Type": "application/json" });
    res.write(JSON.stringify(responseArray));
    res.end();
  } else {
    res.end("error");
  }
});

server.listen(PORT, () => {
  console.log(`Server Running on port ....${PORT}`);
});
