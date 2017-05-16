var socket = io.connect("192.168.1.138:4000", {
    'forceNew': true
});

function leds(e) {
    socket.emit("leds");
    return false;
}

function camera(e) {
    socket.emit("camera");
    return false;
}

function video(e) {
    socket.emit("video");
    return false;
}

/*function temperature(e) {
    socket.emit("temperature");
    return false;
}*/