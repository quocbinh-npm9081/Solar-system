import * as THREE from "three";
import * as DATGUI from "dat.gui";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

import starsTexture from "../img/stars.jpg";
import sunTexture from "../img/sun.jpg";
import mercuryTexture from "../img/mercury.jpg";
import venusTexture from "../img/venus.jpg";
import earthTexture from "../img/earth.jpg";
import marsTexture from "../img/mars.jpg";
import jupiterTexture from "../img/jupiter.jpg";
import saturnTexture from "../img/saturn.jpg";
import saturnRingTexture from "../img/saturn ring.png";
import uranusTexture from "../img/uranus.jpg";
import uranusRingTexture from "../img/uranus ring.png";
import neptuneTexture from "../img/neptune.jpg";
import plutoTexture from "../img/pluto.jpg";

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const cubeScene = new THREE.CubeTextureLoader();
scene.background = cubeScene.load([
  starsTexture,
  starsTexture,
  starsTexture,
  starsTexture,
  starsTexture,
  starsTexture,
]);

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerHeight / window.innerHeight,
  0.1,
  1000
);

camera.position.z = 200;

const orbitControls = new OrbitControls(camera, renderer.domElement);
orbitControls.update();

//Hệ trục tọa độ không gian 3D
const axesHelper = new THREE.AxesHelper(77);
scene.add(axesHelper);

//config GUI
const gui = new DATGUI.GUI();
const lightColorDefault = new THREE.PointLight(0xffffff); // Create a point light
const lightDataEntryFolder = gui.addFolder("Point Light");
const optionsPointLight = {
  colorPointLight: lightColorDefault.color.getStyle(),
  intensity: 2.5,
  distance: 300,
};
lightDataEntryFolder
  .addColor(optionsPointLight, "colorPointLight")
  .onChange(function (value) {
    pointLight.color.setStyle(value);
  });
lightDataEntryFolder.add(optionsPointLight, "intensity", 0, 10);
lightDataEntryFolder.add(optionsPointLight, "distance", 100, 400);

//Đối tượng Tạo kiến trức vật liệu cho bề mặt
const texttureLoader = new THREE.TextureLoader();

//Tạo điểm sáng tỏa ra từ mặt trời (PointLight)
const pointLight = new THREE.PointLight(
  optionsPointLight.colorPointLight,
  optionsPointLight.intensity,
  optionsPointLight.distance
);
pointLight.position.set(0, 0, 0); // Vị trí nguồn sang ngay tại tâm mặt trời
scene.add(pointLight);
//POINTER HELPER
const pointLightHelper = new THREE.PointLightHelper(pointLight, 30);
scene.add(pointLightHelper);

//Tạo mặt trời ở trung tâm( sphere)
const sunGeometry = new THREE.SphereGeometry(16, 30, 30);
const sunMaterial = new THREE.MeshBasicMaterial({
  map: texttureLoader.load(sunTexture),
});
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
scene.add(sun);

function createPlanete(size, texture, position, ringTexture) {
  const geometry = new THREE.SphereGeometry(size, 30, 30);
  const material = new THREE.MeshStandardMaterial({
    map: texttureLoader.load(texture),
  });
  const mesh = new THREE.Mesh(geometry, material);
  const meshObject = new THREE.Object3D();
  meshObject.add(mesh); //mercuryObject sẽ gói mercury, và trở thành cha, khiến mercury không còn phải phụ thuộc vào tốc độ quay của Mặt trời nữa
  scene.add(meshObject);
  mesh.position.x = position;
  if (ringTexture) {
    //Tạo vùng vòng tròn cho sao mộc
    const ringGeometry = new THREE.RingGeometry(
      10,
      ringTexture.innerRadius,
      ringTexture.outerRadius
    );
    const ringMaterial = new THREE.MeshBasicMaterial({
      map: texttureLoader.load(ringTexture.textTure),
      side: THREE.DoubleSide,
    });

    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    ring.rotateX(-0.5 * Math.PI);
    mesh.add(ring);
    scene.add(meshObject);
  }
  return { mesh: mesh, omeshObjectbj: meshObject };
}

//Tạo hành tinh sao thủy( đảm bảo sao thủy phải vừa quay nhanh mặt trời đồng thời cũng quay quanh chính trục của nó, thay vì thêm sao thủy vào mesh của scene ta sẽ thêm vào mesh của cha(cha ở đây là mặt trời))
// const mercuryGeometry = new THREE.SphereGeometry(3.2, 30, 30);
// const mercuryMaterial = new THREE.MeshStandardMaterial({
//   map: texttureLoader.load(mercuryTexture),
// });
// const mercury = new THREE.Mesh(mercuryGeometry, mercuryMaterial);
// const mercuryObject = new THREE.Object3D();
// mercuryObject.add(mercury); //mercuryObject sẽ gói mercury, và trở thành cha, khiến mercury không còn phải phụ thuộc vào tốc độ quay của Mặt trời nữa
// mercuryObject.position.set(0, 0, 1);
// mercury.position.x = 28;
// scene.add(mercuryObject);
//sun.add(mercury); // thêm mercury(sao thủy) vào mesh của mặt trời( điều này khiến mercury trờ thành con của mặt trời)
const mercury = createPlanete(3.2, mercuryTexture, 28);

//Tạo hành tinh sao mộc
const saturn = createPlanete(7.2, saturnTexture, 110, {
  textTure: saturnRingTexture,
  innerRadius: 20,
  outerRadius: 32,
});
//Tạo sao thiên vương
const uranus = createPlanete(7, uranusTexture, 176, {
  textTure: uranusRingTexture,
  innerRadius: 7,
  outerRadius: 12,
});
//Tạo hành tinh sao kim
const venus = createPlanete(5.8, venusTexture, 44);
//Tạo trái đất
const earth = createPlanete(6, earthTexture, 26);
//Tạo sao mộc
const jupiter = createPlanete(12, jupiterTexture, 100);
//Tạo sao Hải vương
const neptune = createPlanete(7, neptuneTexture, 200);
//Tạo sao Diêm Vương
const pluto = createPlanete(2.8, plutoTexture, 216);
function animation(time) {
  sun.rotateY(0.004);

  mercury.mesh.rotateY(0.004);
  mercury.omeshObjectbj.rotateY(0.04);

  saturn.mesh.rotateY(0.032);
  saturn.omeshObjectbj.rotateY(0.009);

  venus.mesh.rotateY(0.03);
  venus.omeshObjectbj.rotateY(0.002);

  earth.mesh.rotateY(0.013);
  earth.omeshObjectbj.rotateY(0.007);

  jupiter.mesh.rotateY(0.023);
  jupiter.omeshObjectbj.rotateY(0.012);

  uranus.mesh.rotateY(0.033);
  uranus.omeshObjectbj.rotateY(0.0012);

  neptune.mesh.rotateY(0.056);
  neptune.omeshObjectbj.rotateY(0.00702);

  pluto.mesh.rotateY(0.066);
  pluto.omeshObjectbj.rotateY(0.00202);

  pointLight.intensity = optionsPointLight.intensity;
  pointLight.distance = optionsPointLight.distance;

  renderer.render(scene, camera);
}

renderer.setAnimationLoop(animation);
