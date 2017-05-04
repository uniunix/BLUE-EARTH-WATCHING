//シーンの作成
var scene = new THREE.Scene();

canvas = document.getElementById('canvas');

//シーンの大きさ
var scene_w  = canvas.clientWidth;//横
var scene_h = canvas.clientHeight;//縦

//window.alert(scene_h);
// Init renderer
var renderer = new THREE.WebGLRenderer({ antialias:true, alpha: true });
renderer.setSize( scene_w, scene_h );
renderer.setClearColor(0x000000, 0);//背景色
canvas.appendChild(renderer.domElement);//最後に生成した要素を追加

// Camera setting
var fov    = 60; //画角
var aspect = scene_w / scene_h; //撮影の縦横比
var near   = 1; //nearより近い領域は表示されない
var far    = 2000; //farより遠い領域は表示されない
var camera = new THREE.PerspectiveCamera( fov, aspect, near, far );
camera.position.set(200, 100, 300 );//カメラ位置

// Add light
var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
directionalLight.position.set(0, 100,30);
scene.add( directionalLight );

// Add AmbientLight
light = new THREE.AmbientLight(0xFFFFFF);
scene.add(light);

// Track ball
trackball = new THREE.TrackballControls(camera);
trackball.minDistance = 200;
trackball.maxDistance = 300;
trackball.noPan = false;


var rayReceiveObjects = []

// Prepare earth texture
textures = []
function loadTextures(num, callback) {
	if (num > 0) {
		loader = new THREE.TextureLoader();
		imagePath = "/images/earth_lv" + num + ".jpg"
		loader.load(imagePath, function(texture) {
			textures[num - 1] = texture
			loadTextures(num - 1, callback)
		});
	} else {
		callback()
	}
}
loadTextures(7, function() {
	createEarth(textures[0]);

	render();
});

var sphereEarth;
var pos = {
	osaka: {
		x: -47,
		y: 49,
		z: -46,
	},
	houston: {
		x: -7,
		y: 42,
		z: 69,
	},
	washington: {
		x: 15,
		y: 54,
		z: 59
	},
	hongkong: {
		x: -32,
		y: 34,
		z: -67 
	}

}

// Create earth
function createEarth(texture) {
	sphereEarth = new THREE.Mesh(
		new THREE.SphereGeometry(80, 20, 20),
		new THREE.MeshLambertMaterial({
			map: texture
		})
	);
	sphereEarth.position.set(0, 0, 0);
	scene.add(sphereEarth);
	rayReceiveObjects.push(sphereEarth);

	// Osaka pin
	addPin(new THREE.Vector3(pos.osaka.x, pos.osaka.y, pos.osaka.z), 'osaka')
	// Houston pin
	addPin(new THREE.Vector3(pos.houston.x, pos.houston.y, pos.houston.z), 'houston')
	// Washington pin
	addPin(new THREE.Vector3(pos.washington.x, pos.washington.y, pos.washington.z), 'washington')
	// Hong Kong pin
	addPin(new THREE.Vector3(pos.hongkong.x, pos.hongkong.y, pos.hongkong.z), 'hongkong')
	
};

function addPin(vector, name) {
	loader = new THREE.TextureLoader();
	imagePath = "/images/pin.png"
	loader.load(imagePath, function(texture) {
		// Pin
		//var pinGeometry = new THREE.SphereGeometry(1);
		var pinGeometry = new THREE.PlaneGeometry(8, 8);
		var pinMaterial = new THREE.MeshBasicMaterial({
			map : texture,
			transparent: true 
		});
		//vector.unproject(sphereEarth.position);
		var pin1 = new THREE.Mesh(pinGeometry, pinMaterial)
		pin1.position.set(vector.x, vector.y, vector.z)
		pin1.name = name
		//pin1.rotation.z = 45 * Math.PI / 180;
		scene.add(pin1)
		var pin2 = new THREE.Mesh(pinGeometry, pinMaterial)
		pin2.position.set(vector.x, vector.y, vector.z)
		//pin2.rotation.z = 45 * Math.PI / 180;
		pin2.rotation.y = 180 * Math.PI / 180;
		pin2.name = name
		scene.add(pin2)
		//rayReceiveObjects.push(pin1);
		//rayReceiveObjects.push(pin2);
	});
	
	// var areaGeometry = new THREE.CubeGeometry(13,13,13);
	// var areaMaterial = new THREE.MeshBasicMaterial({
	// 	color: 0x0000ff,
	// 	transparent: true, 
	// 	opacity : 0.5
	// });
	// var area = new THREE.Mesh(areaGeometry, areaMaterial)
	// area.position.set(vector.x, vector.y, vector.z)
	// scene.add(area)
}

var sun_count = 0

// Touch Event
function touchEvent() {
	renderer.domElement.addEventListener('mousedown', function(e){
		var mouse_x =   ((e.pageX-e.target.offsetParent.offsetLeft) / renderer.domElement.width)  * 2 - 1;
		var mouse_y = - ((e.pageY-e.target.offsetParent.offsetTop) / renderer.domElement.height) * 2 + 1;
		var vector = new THREE.Vector3(mouse_x, mouse_y, 0.5);
		vector.unproject(camera);

		var ray = new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize());
		var obj = ray.intersectObjects(rayReceiveObjects);

		if(obj.length > 0){
			console.log("clicked: " + obj[0].point.x + ", " + obj[0].point.y + "," + obj[0].point.z)
			console.log(obj[0].name)

			const range = 10
            // osaka point
            if (
                (obj[0].point.x < pos.osaka.x + range + 4 && obj[0].point.x > pos.osaka.x - range + 4)
                && (obj[0].point.y < pos.osaka.y + range - 4 && obj[0].point.y > pos.osaka.y - range - 4) 
            ) {
                location.href = '/sealevel/index.html' + '?level=' + sun_count + '&city=osaka'
                console.log('click osaka')
            }
            // houston point
            else if (
                (obj[0].point.x < pos.houston.x + range + 4 && obj[0].point.x > pos.houston.x - range + 4)
                && (obj[0].point.y < pos.houston.y + range + 4 && obj[0].point.y > pos.houston.y - range - 4) 
            ) {
                location.href = '/sealevel/index.html' + '?level=' + sun_count + '&city=houston'
                console.log('click houston')
            }
            // washington point
            else if (
                (obj[0].point.x < pos.washington.x + range + 4 && obj[0].point.x > pos.washington.x - range + 4)
                && (obj[0].point.y < pos.washington.y + range + 4 && obj[0].point.y > pos.washington.y - range - 4) 
            ) {
                location.href = '/sealevel/index.html' + '?level=' + sun_count + '&city=washington'
                console.log('click washington')
            }
            // hongkong point
            else if (
                (obj[0].point.x < pos.hongkong.x + range + 4 && obj[0].point.x > pos.hongkong.x - range + 4)
                && (obj[0].point.y < pos.hongkong.y + range + 4 && obj[0].point.y > pos.hongkong.y - range - 4) 
            ) {
                location.href = '/sealevel/index.html' + '?level=' + sun_count + '&city=hongkong'
                console.log('click hongkong')
            }
		}

	}, false);
}


function render() {
	touchEvent();
	renderer.render(scene, camera);
}

// Animation
( function renderLoop () {
	requestAnimationFrame( renderLoop );

	renderer.render( scene, camera );
	trackball.update();
} )();


// Each params
meters = [0, 50, 100, 150, 200, 250, 300]
degrees = [0, 350, 700, 1050, 1400, 1750, 2100]
// params
//document.getElementById("params").innerHTML = "meter: +" + meters[0] + " m<br>" + "degree: +" + degrees[0] + " deg C";
document.getElementById("params").innerHTML = "meter: +" + meters[0] + " m";


////// Sun Button //////
sun_button = document.getElementById('sun_button');
sun_count = 0
sun_current_size = 80
sun_init_size = sun_current_size
sun_button.style.backgroundSize = "" + sun_current_size + "px"
sun_button.style.height = "" + sun_current_size + "px"
sun_button.style.width = "" + sun_current_size + "px"
sun_button.style.backgroundImage = "url(/images/sun_lv1.png)"

sun_button.onclick = function () {
	sun_count += 1
	sun_current_size = sun_current_size * 1.1
	if (sun_count == 7) {
		sun_count = 0
		sun_current_size = sun_init_size
	}
	console.log(sun_current_size)
	file_count = sun_count + 1
	sun_button.style.backgroundSize = "" + sun_current_size + "px"
	sun_button.style.height = "" + sun_current_size + "px"
	sun_button.style.width = "" + sun_current_size + "px"
	sun_button.style.backgroundImage = "url(/images/sun_lv" + file_count + ".png)"
	// Change earth texture
	sphereEarth.material = new THREE.MeshLambertMaterial({
		map: textures[sun_count]
	})
	// Change labels
	// prams
	//document.getElementById("params").innerHTML = "meter: +" + meters[sun_count] + " m<br>" + "degree: +" + degrees[sun_count] + " deg C";
	document.getElementById("params").innerHTML = "meter: +" + meters[sun_count] + " m";
	console.log("Sun: Lv." + sun_count)
};



////// Reset Button //////
reset_button = document.getElementById('reset_button')
reset_button.onclick = function() {
	sun_count = 0
	sun_current_size = sun_init_size
	sun_button.style.backgroundSize = "" + sun_current_size + "px"
	sun_button.style.height = "" + sun_current_size + "px"
	sun_button.style.width = "" + sun_current_size + "px"
	sun_button.style.backgroundImage = "url(/images/sun_lv1.png)"
	sphereEarth.material = new THREE.MeshLambertMaterial({
		map: textures[0]
	})
	//document.getElementById("params").innerHTML = "meter: +" + meters[0] + " m<br>" + "degree: +" + degrees[0] + " deg C";
	document.getElementById("params").innerHTML = "meter: +" + meters[0] + " m";

	trackball.reset()
}
