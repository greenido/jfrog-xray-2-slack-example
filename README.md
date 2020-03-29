# Integrate JFrog Xray with Slack

![](https://cdn.glitch.com/18f97c3f-b8ef-44ba-a661-e915b310696d%2FScreen%20Shot%202020-03-28%20at%205.57.46%20PM.png?v=1585443484957)

This project send messages to [Slack](http://slack.com) when JFrog Xray will send its notifications.

We will use [Xray's Webhooks](https://www.jfrog.com/confluence/display/JFROG/Configuring+Xray#ConfiguringXray-ConfiguringWebhooks) to
define our server's and base on the [policy/rules](https://www.jfrog.com/confluence/display/JFROG/Creating+Xray+Policies+and+Rules) our
webhook will be notified with the alerts about violations (security or licenses).

## Getting Started

It makes use of [Express.js](http://expressjs.com/), a minimal and flexible Node.js framework that includes a myriad of
HTTP utility methods for quickly creating robust APIs. We also use the [Body Parser](https://github.com/expressjs/body-parser) package,
which is Node.js middleware that allows us to process any POST requests we receive.

#### For more details check this [post](https://greenido.wordpress.com/?p=9820)

Now it's time to see **routes.js** file and the end-point that is being used:

**/xray/api** - Get the notification from Xray and send messages to Slack.
Each violation will be sent as one message. To make it more efficient we aren't sending all the issues' data per violation.
However, if you wish to get more information, please feel free to fork this project and add fields to the message.

ℹ️ If you wish to see how the JSON payload from Xray is going to look like check: **z_example-of-xray-webhook-data.json**

### Steps To Follow

1. Defined Xray's webook by following [these steps](https://www.jfrog.com/confluence/display/JFROG/Configuring+Xray#ConfiguringXray-ConfiguringWebhooks).

2. Copy this project and change:

```
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/specific-string-from-slack/more-chars-from-slack-that-are-unique
```

3. Create a Slack App by following this tutorial on [Incoming Webhooks For Slack](https://slack.com/help/articles/115005265063-Incoming-Webhooks-for-Slack)

4. Check and see the channel you defined at #3 for incoming notification.
   They should look like this:

![](https://cdn.glitch.com/18f97c3f-b8ef-44ba-a661-e915b310696d%2FScreen%20Shot%202020-03-28%20at%204.14.10%20PM.png?v=1585437298767)

Go have a ☕️ and check your Slack channel for messages.
