//シーンの作成
var scene = new THREE.Scene();
	
//シーンの大きさ
var scene_w  = document.body.clientWidth;//横
var scene_h = document.body.clientHeight;//縦

//window.alert(scene_h);	
// Init renderer
var renderer = new THREE.WebGLRenderer({ antialias:true, alpha: true });
renderer.setSize( scene_w, scene_h );
renderer.setClearColor(0x000000, 0);//背景色
document.body.appendChild(renderer.domElement);//最後に生成した要素を追加

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
trackball.maxDistance = 500;
trackball.noPan = false; 


var rayReceiveObjects = []

// Prepare earth texture
//imagePath = '/images/earth.png'
imagePath = '/images/earth2048.jpg'
loader = new THREE.TextureLoader();
loader.load(imagePath, function(texture) {
	createEarth(texture);
	
	render();
});

// Create earth
function createEarth(texture) {
	sphereEarth = new THREE.Mesh(
		new THREE.SphereGeometry(80, 20, 20), // 形状    
		new THREE.MeshLambertMaterial({ // 材質         
			map: texture
		})
	);
	sphereEarth.position.set(0, 0, 0);
	scene.add(sphereEarth);
	rayReceiveObjects.push(sphereEarth);
};


// Touch Event
function touchEvent() {
	renderer.domElement.addEventListener('mousedown', function(e){
		var mouse_x =   ((e.pageX-e.target.offsetParent.offsetLeft) / renderer.domElement.width)  * 2 - 1;
		var mouse_y = - ((e.pageY-e.target.offsetParent.offsetTop) / renderer.domElement.height) * 2 + 1;
		var vector = new THREE.Vector3(mouse_x, mouse_y, 0.5);
		vector.unproject(camera);

		var ray = new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize()); // レイの作成
		var obj = ray.intersectObjects(rayReceiveObjects); // レイがメッシュに衝突するかどうか
		// 戻り値は、衝突したメッシュが配列で入っている。

		if(obj.length > 0){
			console.log('clicked')
		}

	}, false);
}



function render() {
	touchEvent();
	renderer.render(scene, camera);
}

//アニメーション
( function renderLoop () {
	requestAnimationFrame( renderLoop );
	// 表示する
	renderer.render( scene, camera );
	trackball.update();
} )();	
