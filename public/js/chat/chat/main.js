var socket = io.connect("192.168.1.139:8000", {
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

function borrar(e) {
    var id = e.getAttribute("id");
    alert(id);
    socket.emit("borrar_imagen", id);
    return false;
}


//Con este socket recibimos el evento para mostrar un mensaje de haber hecho una foto
socket.on('final', function (data) {
    document.querySelector("#mensaje").setAttribute("class", "alert alert-success");
    document.querySelector("#mensaje").innerHTML = "<strong>Success! </strong>" + data;
    document.querySelector("#mensaje").style.opacity = '1';
    setTimeout(function () {
        document.querySelector("#mensaje").style.opacity = '0';
        document.querySelector("#mensaje").setAttribute('margin', '0');
    }, 2000);
});

//Con este socket recibimos el evento para mostrar un mensaje de haber hecho un video
socket.on('final_video', function (data) {
    document.querySelector("#mensaje").setAttribute("class", "alert alert-success");
    document.querySelector("#mensaje").innerHTML = "<strong>Success! </strong>" + data;
    document.querySelector("#mensaje").style.opacity = '1';
    setTimeout(function () {
        document.querySelector("#mensaje").style.opacity = '0';
        document.querySelector("#mensaje").setAttribute('margin', '0');
    }, 2000);
});

//Con esta funcion conseguimos que el usuario pueda actualizar su perfil
function update(e) {
    var company = document.getElementById("company").value;
    var username = document.getElementById("username").value;
    var email = document.getElementById("email").value;
    var first_name = document.getElementById("first_name").value;
    var last_name = document.getElementById("last_name").value;
    var address = document.getElementById("address").value;
    var city = document.getElementById("city").value;
    var country = document.getElementById("country").value;
    var about = document.getElementById("about").value;
    var zip = document.getElementById("zip").value;

    var info = {
            company: company,
            username: username,
            email: email,
            first_name: first_name,
            last_name: last_name,
            address: address,
            city: city,
            country: country,
            zip: zip,
            about: about
        } //Guardamos todas las varialbles en JSON para poder emitirlo al servidor
    document.querySelector("#success").setAttribute("class", "alert alert-success");
    document.querySelector("#success").innerHTML = "<strong>Success! </strong> Tu perfil se ha actualizado";
    document.querySelector("#success").style.opacity = '1';
    setTimeout(function () {
        document.querySelector("#success").style.opacity = '0';
        document.querySelector("#success").setAttribute('margin', '0');
    }, 2000);
    socket.emit('update_profile', info); //emitimos un evento con el qual pasamos la informacion del formulario
    return false;
}

//Con esta funcion cojemos los datos de los campos de las notas
function nota(e) {
    var titulo = document.getElementById("titulo").value;
    var content = document.getElementById("notes").value;

    var info = {
        titulo: titulo,
        content: content
    }
    socket.emit('agregar_nota', info);
    return false;
}