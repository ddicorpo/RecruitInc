import app from "./app";
const PORT = process.env.PORT || 6969;

var server = app.listen(PORT, () => {
    console.log('listening on port ' + PORT);
})

server.setTimeout(2147483647);
