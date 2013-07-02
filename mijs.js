
var tipoitmes = [];
tipoitmes[1]="Servicios terceros";
tipoitmes[2]="Traslados";
tipoitmes[3]="Combustible";
tipoitmes[4]="Materiales of.";
tipoitmes[5]="Consumo";
tipoitmes[6]="Alojamiento";
tipoitmes[7]="Varios";

var listaitems = [];

//var urlrendiciones="http://192.168.1.124/rendicionesweb/";
var urlrendiciones="http://s2.intus.cl/rendicionesweb/";

$(document).ready(function() {
	//$.mobile.changePage("#nueva_rendicion");
	//$("#guardar").click(function(e) {

	$("#nueva_rendicion_form").submit(function(e) {
		e.preventDefault();
		// Un mensaje de estado
		$("#resultBlock").html("Guardando...");
		// Hacemos un peticion web y obtenemos la data
		$.post(urlrendiciones+"guarda_rendicion.php", {
				enviar:$("#guardar").val(), 
				fecha_rendicion: $("#fecha_rendicion").val(), 
				saldo_anterior: $("#saldo_anterior").val(),
				monto_asignado: $("#monto_asignado").val(),
				saldo_anterior_combustible: $("#saldo_anterior_combustible").val(),
				combustible_asignado: $("#combustible_asignado").val()
			}, 
			function(data) {
				// Cargamos la data dentro de la etiqueta p
				$("#resultBlock").html(data);
		
				cargarendiciones();

				$.mobile.changePage("#page");
		});
				
		return false;
	});
	
	$("#nuevo_item_form").submit(function(e) {
		e.preventDefault();
		//return false;
		// Un mensaje de estado
		//alert("wtf!");
		$("#resultBlock2").html("Guardando...");
		// Hacemos un peticion web y obtenemos la data
		//alert("wtf2222! "+sessionStorage.id_rendicion);
		$.post(urlrendiciones+"guarda_item.php", {
				enviar:$("#guardar").val(),
				id_rendicion:sessionStorage.id_rendicion,
				id_item:sessionStorage.id_item,
				fecha: $("#fecha_item").val(), 
				numero_documento: $("#numero_documento").val(),
				descripcion: $("#descripcion").val(),
				tipo: $("#items").val(),
				monto: $("#monto").val(),
				lafoto: sessionStorage.lafoto
			},
			function(data) {
				//alert("q ondiwi");
				// Cargamos la data dentro de la etiqueta p
				$("#resultBlock2").html(data);
				
				if(data=="TAMOSRULES") {
					cargarendiciones();
					//cargaritems();
					
					$.mobile.changePage("#itemspage");
				}
		});
		
		return false;
	});

	$("#itemspage").live("pageshow", function (e) {
		cargaritems();
	});

	$("#page").live("pageshow", function (e) {
  		//cargarendiciones();
	});

	$("#nuevo_item").live("pageshow", function (e) {
		alert(sessionStorage.id_item+"-"+listaitems[sessionStorage.id_item][0].tipo);

		if(sessionStorage.id_item=="") {
			$("#fecha_item").val("");
			$("#numero_documento").val("");
			$("#descripcion").val("");
			$("#items").val("0");
			$("#monto").val("");
			$("#smallImage").attr("src", "");
		}
		else {
			$("#fecha_item").val(listaitems[sessionStorage.id_item][0].fecha);
			$("#numero_documento").val(listaitems[sessionStorage.id_item][0].numero_documento);
			$("#descripcion").val(listaitems[sessionStorage.id_item][0].descripcion);
			$("#items").val("'"+listaitems[sessionStorage.id_item][0].tipo+"'");
			$("#monto").val(listaitems[sessionStorage.id_item][0].monto);
		}
	});

	cargarendiciones();
});

function cargarendiciones() {
	$("#lista_rendiciones").html(''+
		'<tr align="left">'+
			'<th>Rendici&oacute;n</th>'+
			'<th>Saldo</th>'+
			'<th>Saldo combustible</th>'+
		'</tr>'+
		'<tr align="left">'+
			'<td colspan="3">Cargando rendiciones...</td>'+
		'</tr>'+
	'');

	$.get(urlrendiciones+"lista_rendiciones.php", function(data){
		var datos=$.parseJSON(data);
	
		$("#lista_rendiciones").html(''+
			'<tr align="left">'+
				'<th>Rendici&oacute;n</th>'+
				'<th>Saldo</th>'+
				'<th>Saldo combustible</th>'+
			'</tr>'+
		'');
		
		$.each(datos, function(llave, valor){
			$("#lista_rendiciones").append(''+
			'<tr align="left">'+
			  '<td><a data-role="button" href="#itemspage" onclick="sessionStorage.id_rendicion='+llave+'">'+valor[0].fecha_rendicion+'</a></td>'+
			  '<td>'+valor[0].saldo_a_devolver+'</td>'+
			  '<td>'+valor[0].saldo_combustible+'</td>'+
			'</tr>'+
			'');
		});
	});
}

function cargaritems() {
	$("#lista_items").html(''+
		'<tr align="left">'+
			'<th>Fecha</th>'+
			'<th>N&ordm; doc.</th>'+
			'<th>Monto</th>'+
			'<th>Item</th>'+
			'<th>Descripcion</th>'+
			'<th>Descripcion</th>'+
		'</tr>'+
		'<tr align="left">'+
			'<td colspan="3">Cargando items...</td>'+
		'</tr>'+
	'');

	$.get(urlrendiciones+"lista_items.php?id_rendicion="+sessionStorage.id_rendicion, function(data){
		var datos=$.parseJSON(data);
    	listaitems=datos;
		    
	  $("#lista_items").html(''+
		  '<tr align="left">'+
			  '<th>Fecha</th>'+
			  '<th>N&ordm; doc.</th>'+
			  '<th>Monto</th>'+
			  '<th>Item</th>'+
			  '<th>Descripcion</th>'+
			  '<th>Boleta/Factura</th>'+
		  '</tr>'+
	  '');

		$.each(datos, function(llave, valor){			
			var elenlace='';
			if(valor[0].boleta_factura!="") elenlace='<a onclick="window.open(\''+urlrendiciones+valor[0].boleta_factura+'\', \'_system\');" href="#">Ver</a>';
			
			$("#lista_items").append(''+
			'<tr align="left">'+
			  '<td><a href="#nuevo_item" onclick="sessionStorage.id_item='+llave+'" >'+valor[0].fecha+'</a></td>'+
			  '<td>'+valor[0].numero_documento+'</td>'+
			  '<td>'+valor[0].monto+'</td>'+
			  '<td>'+tipoitmes[valor[0].tipo]+'</td>'+
			  '<td>'+valor[0].descripcion+'</td>'+
			  '<td>'+elenlace+'</td>'+
			'</tr>'+
			'');
		});
	});
}


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

	sessionStorage.lafoto=imageData;

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
	
	//alert(imageData.name);
}

// Called when a photo is successfully retrieved
//
function onPhotoURISuccess(imageURI) {
	// Uncomment to view the image file URI 
	// console.log(imageURI);

	// Get image handle
	//
	var largeImage = document.getElementById('largeImage');
	//var largeImage = document.getElementById('smallImage');

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
	//navigator.camera.getPicture(onPhotoDataSuccess, onFail, { quality: 80,destinationType: destinationType.DATA_URL, correctOrientation:true });
	navigator.camera.getPicture(onPhotoDataSuccess, onFail, { quality: 80, destinationType: destinationType.DATA_URL, correctOrientation:true, saveToPhotoAlbum:true });
	
	//navigator.camera.getPicture(onPhotoDataSuccess, onFail, { quality: 80,destinationType: destinationType.FILE_URI, correctOrientation:true });
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
