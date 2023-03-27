import "./style.css";

import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import Stats from "three/examples/jsm/libs/stats.module";

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xadd8e6);
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.update();

camera.position.z = 48;

const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
ambientLight.castShadow = true;
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
directionalLight.castShadow = true;
directionalLight.position.set(0, 32, 64);
scene.add(directionalLight);

const clock = new THREE.Clock();
const stats = Stats();
let mixer: THREE.AnimationMixer;
const loader = new GLTFLoader();

loader.load(
  "./model/scene.gltf",
  function (gltf) {
    scene.add(gltf.scene);

    gltf.scene.traverse((node) => {
      if (node.type === "Mesh") {
        node.castShadow = true;
        node.receiveShadow = true;
      }
    });

    mixer = new THREE.AnimationMixer(gltf.scene);
    var action = mixer.clipAction(gltf.animations[0]);
    action.play();
  },
  undefined,
  function (error) {
    console.error(error);
  }
);

function animate() {
  var delta = clock.getDelta();

  if (mixer) mixer.update(delta);

  stats.update();

  requestAnimationFrame(animate);

  controls.update();

  renderer.render(scene, camera);
}

animate();
