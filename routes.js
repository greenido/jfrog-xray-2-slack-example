//
// An example integrate Slack with JFrog Xray
// Author: @greenido
// Date: April 2019
//
//
//
// This defines three routes that our API is going to use.
//
const fs = require("fs");
const https = require("https");

//
// Main End points of our app
//
var routes = function(app) {
  //
  // The home page end-point return basic explanation
  //
  app.get("/", function(req, res) {
    res.send(
      "<h1>🐸 An example integrate Slack with JFrog Xray ☀️</h1> <br> <br>\
      <p>This projects send messages to Slack when JFrog Xray will send it notifications base on the policy.<br> \
      It makes use of Express.js, a minimal and flexible Node.js framework that includes a myriad of HTTP utility methods for quickly <br> \
      creating robust APIs. We also use the Body Parser package, which is Node.js middleware that allows us to process any POST requests we receive.<br>\
      <h3>This is what it will look like:</h3> <img src='https://cdn.glitch.com/18f97c3f-b8ef-44ba-a661-e915b310696d%2FScreen%20Shot%202020-03-28%20at%204.14.10%20PM.png?v=1585437298767' alt='image of notification at slack' />\
      <h4>For More details check this project: <a href='https://glitch.com/edit/#!/xray-2-slack?path=README.md:23:0'>README.md</a> </h4>"
    );
  });

  //
  // The API end-point that get the notifications from Xray and send them as messages to Slack
  //
  app.post("/xray/api/", function(req, res) {
    let payload = req.body;
    let totalIssues = payload.issues.length;

    // send each component to Slack
    let tmpStr =
      "🔔 Policy:" +
      payload.policy_name +
      " \nWatch: " +
      payload.watch_name +
      " \nCreated: " +
      payload.created +
      " \nNumber Of Issues: " +
      payload.issues.length +
      "\n ℹ️ Below is the first issue:";

    // let's see what are we going to send to Slack
    console.log(tmpStr + " --> sending to Slack ");

    // Build a nice msg
    const xrayNotification = {
      username: "Xray notifier",
      text: tmpStr, // text
      icon_emoji: ":bangbang:",
      attachments: [
        {
          color: "#eed140",
          // You can add more fields as the data from Xray contains more information
          fields: [
            {
              title: "Type",
              value: payload.issues[0].type,
              short: true // long fields will be full width
            },
            {
              title: "Severity",
              value: payload.issues[0].severity,
              short: true // long fields will be full width
            },
            {
              title: "Created",
              value: payload.issues[0].created,
              short: true
            },
            {
              title: "Provider",
              value: payload.issues[0].provider,
              short: true
            },
            {
              title: "Summary",
              value: payload.issues[0].summary
            }
          ]
        }
      ]
    };

    sendSlackMessage(xrayNotification);

    // just in case you wish to monitor this API end point
    return res.json({ status: "All Good", msg_sent: totalIssues });
  });
};

/**
 * Send formated messages to Slack
 *
 * @param messageBody
 * @return {Promise}
 */
function sendSlackMessage(messageBody) {
  try {
    //console.log("=== " + messageBody);
    messageBody = JSON.stringify(messageBody);
  } catch (e) {
    console.log("Got ERR with sending msg to slack ");
    console.log(e);
  }

  // Promisify the https.request
  return new Promise((resolve, reject) => {
    const requestOptions = {
      method: "POST",
      header: {
        "Content-Type": "application/json"
      }
    };

    // actual request
    const req = https.request(
      process.env.SLACK_WEBHOOK_URL,
      requestOptions,
      res => {
        let response = "";

        res.on("data", d => {
          response += d;
        });

        res.on("end", () => {
          resolve(response);
        });
      }
    );

    req.on("error", e => {
      reject(e);
    });

    // send our message body (was parsed to JSON beforehand)
    req.write(messageBody);
    req.end();
  });
}

module.exports = routes;
