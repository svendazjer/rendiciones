
$(document).ready(function() {
	//$.mobile.changePage("#nueva_rendicion");
	$("#guardar").click(function(e) {
		e.preventDefault();
		// Un mensaje de estado
		$("#resultBlock").html("Obteniendo los datos - esperando...");
		// Hacemos un peticion web y obtenemos la data
		$.post("http://s2.intus.cl/raxteltss2013/test.php", {enviar:$("#guardar").val(), campo: "descripcion", valor: $("#descripcion").val()}, function(data) {
			// Cargamos la data dentro de la etiqueta p
			$("#resultBlock").html(data);
		})
	});
});

var pictureSource;   // picture source
var destinationType; // sets the format of returned value 

// Wait for Cordova to connect with the device
//
document.addEventListener("deviceready",onDeviceReady,false);

// Cordova is ready to be used!
//
function onDeviceReady() {
	pictureSource=navigator.camera.PictureSourceType;
	destinationType=navigator.camera.DestinationType;
}

// Called when a photo is successfully retrieved
//
function onPhotoDataSuccess(imageData) {
	// Uncomment to view the base64 encoded image data
	// console.log(imageData);

	// Get image handle
	//
	var smallImage = document.getElementById('smallImage');

	// Unhide image elements
	//
	smallImage.style.display = 'block';

	// Show the captured photo
	// The inline CSS rules are used to resize the image
	//
	smallImage.src = "data:image/jpeg;base64," + imageData;
}

// Called when a photo is successfully retrieved
//
function onPhotoURISuccess(imageURI) {
	// Uncomment to view the image file URI 
	// console.log(imageURI);

	// Get image handle
	//
	var largeImage = document.getElementById('largeImage');

	// Unhide image elements
	//
	largeImage.style.display = 'block';

	// Show the captured photo
	// The inline CSS rules are used to resize the image
	//
	largeImage.src = imageURI;
}

// A button will call this function
//
function capturePhoto() {
	// Take picture using device camera and retrieve image as base64-encoded string
	navigator.camera.getPicture(onPhotoDataSuccess, onFail, { quality: 50,
		destinationType: destinationType.DATA_URL });
}

// A button will call this function
//
function capturePhotoEdit() {
	// Take picture using device camera, allow edit, and retrieve image as base64-encoded string  
	navigator.camera.getPicture(onPhotoDataSuccess, onFail, { quality: 20, allowEdit: true,
		destinationType: destinationType.DATA_URL });
}

// A button will call this function
//
function getPhoto(source) {
	// Retrieve image file location from specified source
	navigator.camera.getPicture(onPhotoURISuccess, onFail, { quality: 50, 
		destinationType: destinationType.FILE_URI,
		sourceType: source });
}

// Called if something bad happens.
// 
function onFail(message) {
	alert('Failed because: ' + message);
}