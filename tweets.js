var container, stats;
var camera, controls, scene, renderer;

var mouse = new THREE.Vector2();
var mouseDownContent = '';
var raycaster = new THREE.Raycaster();
var INTERSECTED;

var info, info_stick;

init();
animate();

function init() {

    container = document.getElementById( "container" );

    info = document.getElementById( 'info' );
    info_stick = document.getElementById( 'info_stick' );

    camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 10000 );
    camera.position.z = 300;

    controls = new THREE.TrackballControls( camera );
    controls.rotateSpeed = 1.0;
    controls.zoomSpeed = 1.2;
    controls.panSpeed = 0.8;
    controls.noZoom = false;
    controls.noPan = true;
    controls.staticMoving = false;
    controls.dynamicDampingFactor = 0.3;

    scene = new THREE.Scene();

    pickingScene = new THREE.Scene();
    pickingTexture = new THREE.WebGLRenderTarget( window.innerWidth, window.innerHeight );
    pickingTexture.minFilter = THREE.LinearFilter;
    pickingTexture.generateMipmaps = false;

    scene.add( new THREE.AmbientLight( 0xffffff ) );

    var geometry = new THREE.Geometry(),
    pickingGeometry = new THREE.Geometry(),
    pickingMaterial = new THREE.MeshBasicMaterial( { vertexColors: THREE.VertexColors } ),
    defaultMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff, shading: THREE.FlatShading, vertexColors: THREE.VertexColors } );

    var geom = new THREE.SphereGeometry( 1, 16, 16 );


    for ( var i = 0; i < tweets.length; i ++ ) {

        var obj = new THREE.Mesh( geom, new THREE.MeshLambertMaterial( { color: Math.random() * 0xffffff } ) );

        obj.position.x = tweets[i].x;
        obj.position.y = tweets[i].y;
        obj.position.z = tweets[i].z;
        obj.idx = i;

        scene.add(obj);
    }

    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setClearColor( 0xffffff );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.sortObjects = false;
    container.appendChild( renderer.domElement );

    stats = new Stats();
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.bottom = '30px';
    stats.domElement.style.right = '0px';
    container.appendChild( stats.domElement );

    renderer.domElement.addEventListener( 'mousemove', onMouseMove, false );
    renderer.domElement.addEventListener( 'mousedown', onMouseDown, false );
    window.addEventListener( 'resize', onWindowResize, false );
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}

function onMouseMove( e ) {
    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
}

function onMouseDown( e ) {
    raycaster.setFromCamera( mouse, camera );
    var intersects = raycaster.intersectObjects( scene.children );
    if (intersects.length > 0) {
        var obj = intersects[ 0 ].object;
        info_stick.innerHTML = tweets[obj.idx].tweet;
    } else {
        info_stick.innerHTML = '<i>Click on any point to stick the corresponding tweet here</i>';
    }
}

function animate() {

    requestAnimationFrame( animate );

    render();
    stats.update();
}

function pick() {
    raycaster.setFromCamera( mouse, camera );
    var intersects = raycaster.intersectObjects( scene.children );

    if ( intersects.length > 0 ) {
        if ( INTERSECTED != intersects[ 0 ].object ) {
            if ( INTERSECTED ) {
                INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );
            }

            INTERSECTED = intersects[ 0 ].object;
            INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
            INTERSECTED.material.emissive.setHex( 0xff0000 );
            info.innerHTML = tweets[INTERSECTED.idx].tweet;
        }
    } else {
        if ( INTERSECTED ) {
            INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );
        }
        INTERSECTED = null;
        info.innerHTML = '<i>Hover on the points to see the tweets</i>';
    }
}

function render() {
    controls.update();
    pick();
    renderer.render( scene, camera );
}