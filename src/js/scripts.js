import * as THREE from 'three';
import {GLTFLoader} from '../../three.js-dev/examples/jsm/loaders/GLTFLoader.js';
import {OrbitControls} from '../../three.js-dev/examples/jsm/controls/OrbitControls.js';


const canvas = document.querySelector('#web');
const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true});

renderer.setSize(window.innerWidth,window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio,2)); //ความคมชัด


const scene = new THREE.Scene();
scene.background = new THREE.Color(0xfaf0e6);

//กล้อง
const camera = new THREE.PerspectiveCamera(75,window.innerWidth / window.innerHeight,0.1,1000 );
camera.position.set(-4,20,8);


//มุมกล้อง
const orbit = new OrbitControls(camera,canvas);
orbit.update();

//Light
const ambientLight = new THREE.AmbientLight(0xffffff,0.9);
scene.add(ambientLight);

const light = new THREE.PointLight(0xffffff,200,100)
light.position.set(-5,10,6)
scene.add(light)

//สร้างURL
const pic = new URL('../../pic/Room3d02.glb',import.meta.url);

//โหลดโมเดล 3d
const loader = new GLTFLoader();
loader.load( pic.href, function ( gltf ) {
    const local = gltf.scene;
    local.position.set(-2,2,2);
    scene.add(local);

}, undefined, function ( error ) {
    console.error( error );
} );



const pic1 = new URL('../../pic/book3.glb',import.meta.url);

//โมเดลหนังสือ เเละตัวอนิเมชัน
let mixer;
const loader1 = new GLTFLoader();
loader1.load( pic1.href, function ( gltf ) {
    const local = gltf.scene;
    local.position.set(-2,5.6,0.4);
    local.rotation.set(0,-1.6,0)
    scene.add(local);

    const clips = gltf.animations;
    mixer = new THREE.AnimationMixer(local);

    const insideclip = THREE.AnimationClip.findByName(clips,'Inside_PageAction');
    const insideaction = mixer.clipAction(insideclip);
    insideaction.play();

    const bookclip = THREE.AnimationClip.findByName(clips,'Book_CoverAction.001');
    const bookaction = mixer.clipAction(bookclip);
    bookaction.play();

}, undefined, function ( error ) {
    console.error( error );

} );


//ส่วนของนาฬิกา
const timeDisplay = document.querySelector("#timeDisplay");
const startBtn = document.querySelector("#startBtn");
const pauseBtn = document.querySelector("#pauseBtn");
const resetBtn = document.querySelector("#resetBtn");

let startTime = 0;
let elapsedTime = 0;
let paused = true;
let intervalId;
let hrs = 0;
let mins = 0;
let secs = 0;

startBtn.addEventListener("click", () => {
    if(paused){
        paused = false;
        startTime = Date.now() - elapsedTime;
        intervalId = setInterval(updateTime, 1000);
    }
});
pauseBtn.addEventListener("click", () => {
    if(!paused){
        paused = true;
        elapsedTime = Date.now() - startTime;
        clearInterval(intervalId);
    }
});
resetBtn.addEventListener("click", () => {
    paused = true;
    clearInterval(intervalId);
    startTime = 0;
    elapsedTime = 0;
    currentTime = 0;
    hrs = 0;
    mins = 0;
    secs = 0;
    timeDisplay.textContent = "00:00:00";
});

function updateTime(){
    elapsedTime = Date.now() - startTime;

    secs = Math.floor((elapsedTime / 1000) % 60);
    mins = Math.floor((elapsedTime / (1000 * 60)) % 60);
    hrs = Math.floor((elapsedTime / (1000 * 60 * 60)) % 60);

    secs = pad(secs);
    mins = pad(mins);
    hrs = pad(hrs);

    timeDisplay.textContent = `${hrs}:${mins}:${secs}`;

    function pad(unit){
        return (("0") + unit).length > 2 ? unit : "0" + unit;
    }
}

    
const clock = new THREE.Clock();
function animate(){
    requestAnimationFrame(animate);
    mixer.update(clock.getDelta());
    renderer.render(scene,camera); 
}
animate();


