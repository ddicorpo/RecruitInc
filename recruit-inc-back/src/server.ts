import app from "./app";
const PORT = process.env.PORT || 6969;

var server = app.listen(PORT, () => {
    console.log('listening on port ' + PORT);
})

//Node js has a default timeout of 2 minutes for routes
//Since our application tends to have routes that run several queries (and take a really long time)
//this can be an issue. If a route is called and it doesn't end before nodejs times out, the server automatically makes a new call to the route
//triggering an infinite loop since the new call will not finish under 2 mins thus triggering a new call etc.
//The line below is to avoid that
server.setTimeout(2147483647);
