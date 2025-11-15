import * as THREE from "https://cdn.skypack.dev/three@0.158.0";
import { OrbitControls } from "https://cdn.skypack.dev/three@0.158.0/examples/jsm/controls/OrbitControls.js";

const canvas = document.getElementById("scene");
const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
  alpha: true,
});
renderer.setPixelRatio(window.devicePixelRatio);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 100);
camera.position.set(6, 4, 9);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.enablePan = true;
controls.dampingFactor = 0.08;
controls.minDistance = 4;
controls.maxDistance = 15;
controls.target.set(0, 2.2, 0);

scene.background = null;

const hemiLight = new THREE.HemisphereLight(0xe9f1ff, 0x0b0c13, 0.85);
scene.add(hemiLight);

const keyLight = new THREE.DirectionalLight(0xffffff, 0.9);
keyLight.position.set(5, 8, 3);
scene.add(keyLight);

const rimLight = new THREE.DirectionalLight(0x6a8ae8, 0.5);
rimLight.position.set(-6, 5, -4);
scene.add(rimLight);

scene.add(createEnvironment());
const knight = createKnight();
scene.add(knight);

resizeRenderer();

function createEnvironment() {
  const env = new THREE.Group();

  const floorGeo = new THREE.CylinderGeometry(6, 6, 0.3, 48);
  const floorMat = new THREE.MeshStandardMaterial({
    color: 0x2a2f3d,
    metalness: 0.2,
    roughness: 0.6,
  });
  const floor = new THREE.Mesh(floorGeo, floorMat);
  floor.position.y = -0.15;
  env.add(floor);

  const floorInlayGeo = new THREE.CylinderGeometry(4.5, 4.5, 0.2, 24);
  const floorInlayMat = new THREE.MeshStandardMaterial({
    color: 0x3e475b,
    metalness: 0.3,
    roughness: 0.4,
  });
  const floorInlay = new THREE.Mesh(floorInlayGeo, floorInlayMat);
  floorInlay.position.y = -0.05;
  env.add(floorInlay);

  const glowGeo = new THREE.RingGeometry(3.5, 4.5, 48);
  const glowMat = new THREE.MeshBasicMaterial({
    color: 0x86a4ff,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.35,
  });
  const glow = new THREE.Mesh(glowGeo, glowMat);
  glow.rotation.x = -Math.PI / 2;
  glow.position.y = 0.001;
  env.add(glow);

  return env;
}

function createKnight() {
  const knight = new THREE.Group();
  knight.position.y = 0.1;

  const armorMaterial = new THREE.MeshStandardMaterial({
    color: 0xb5bcc9,
    metalness: 0.85,
    roughness: 0.2,
  });

  const darkArmorMaterial = new THREE.MeshStandardMaterial({
    color: 0x181c25,
    metalness: 0.4,
    roughness: 0.5,
  });

  const clothMaterial = new THREE.MeshStandardMaterial({
    color: 0x2d3f7f,
    metalness: 0.15,
    roughness: 0.6,
  });

  const goldTrimMaterial = new THREE.MeshStandardMaterial({
    color: 0xe0c66f,
    metalness: 0.9,
    roughness: 0.3,
  });

  const skinMaterial = new THREE.MeshStandardMaterial({
    color: 0xf6d7c6,
    metalness: 0.1,
    roughness: 0.6,
  });

  const hairMaterial = new THREE.MeshStandardMaterial({
    color: 0xf0f4ff,
    emissive: 0xdde6ff,
    emissiveIntensity: 0.2,
    roughness: 0.3,
  });

  const underSuitMaterial = new THREE.MeshStandardMaterial({
    color: 0x0c1018,
    metalness: 0.1,
    roughness: 0.8,
  });

  // Torso
  const torsoGeo = new THREE.CapsuleGeometry(1.1, 2.6, 12, 24);
  const torso = new THREE.Mesh(torsoGeo, armorMaterial);
  torso.position.y = 2.7;
  knight.add(torso);

  // Chest plate accent
  const chestPlateGeo = new THREE.BoxGeometry(1.8, 1.8, 0.4);
  const chestPlate = new THREE.Mesh(chestPlateGeo, darkArmorMaterial);
  chestPlate.position.set(0, 3.5, 0.5);
  knight.add(chestPlate);

  const chestEmblemGeo = new THREE.ConeGeometry(0.3, 0.6, 4);
  const chestEmblem = new THREE.Mesh(chestEmblemGeo, goldTrimMaterial);
  chestEmblem.position.set(0, 3.5, 0.9);
  chestEmblem.rotation.x = Math.PI;
  knight.add(chestEmblem);

  // Pauldrons
  const pauldronGeo = new THREE.SphereGeometry(0.9, 24, 24, 0, Math.PI * 2, 0, Math.PI / 2);
  const leftPauldron = new THREE.Mesh(pauldronGeo, armorMaterial);
  leftPauldron.position.set(1.3, 3.9, 0);
  leftPauldron.rotation.z = Math.PI / 3;
  knight.add(leftPauldron);

  const rightPauldron = leftPauldron.clone();
  rightPauldron.position.x = -1.3;
  rightPauldron.rotation.z = -Math.PI / 3;
  knight.add(rightPauldron);

  // Arms
  const upperArmGeo = new THREE.CapsuleGeometry(0.35, 1.1, 8, 16);
  const leftUpperArm = new THREE.Mesh(upperArmGeo, armorMaterial);
  leftUpperArm.position.set(1.75, 3.2, 0);
  leftUpperArm.rotation.z = Math.PI / 8;
  knight.add(leftUpperArm);

  const rightUpperArm = leftUpperArm.clone();
  rightUpperArm.position.x = -1.75;
  rightUpperArm.rotation.z = -Math.PI / 8;
  knight.add(rightUpperArm);

  const lowerArmGeo = new THREE.CapsuleGeometry(0.3, 1.2, 8, 16);
  const leftLowerArm = new THREE.Mesh(lowerArmGeo, darkArmorMaterial);
  leftLowerArm.position.set(2.1, 2.2, 0.1);
  leftLowerArm.rotation.z = Math.PI / 8;
  knight.add(leftLowerArm);

  const rightLowerArm = leftLowerArm.clone();
  rightLowerArm.position.x = -2.1;
  rightLowerArm.rotation.z = -Math.PI / 8;
  knight.add(rightLowerArm);

  // Gauntlets
  const gauntletGeo = new THREE.CylinderGeometry(0.32, 0.42, 0.6, 16);
  const leftGauntlet = new THREE.Mesh(gauntletGeo, goldTrimMaterial);
  leftGauntlet.position.set(2.2, 1.55, 0.15);
  knight.add(leftGauntlet);

  const rightGauntlet = leftGauntlet.clone();
  rightGauntlet.position.x = -2.2;
  knight.add(rightGauntlet);

  // Hands
  const handGeo = new THREE.SphereGeometry(0.28, 16, 16);
  const leftHand = new THREE.Mesh(handGeo, skinMaterial);
  leftHand.position.set(2.25, 1.2, 0.18);
  knight.add(leftHand);

  const rightHand = leftHand.clone();
  rightHand.position.x = -2.25;
  knight.add(rightHand);

  // Legs
  const hipGeo = new THREE.CylinderGeometry(1.1, 1.15, 0.8, 24);
  const hip = new THREE.Mesh(hipGeo, armorMaterial);
  hip.position.y = 1.7;
  knight.add(hip);

  const thighGeo = new THREE.CapsuleGeometry(0.45, 1.6, 8, 16);
  const leftThigh = new THREE.Mesh(thighGeo, darkArmorMaterial);
  leftThigh.position.set(0.6, 1, 0);
  knight.add(leftThigh);

  const rightThigh = leftThigh.clone();
  rightThigh.position.x = -0.6;
  knight.add(rightThigh);

  const greaveGeo = new THREE.CapsuleGeometry(0.4, 1.4, 8, 16);
  const leftGreave = new THREE.Mesh(greaveGeo, armorMaterial);
  leftGreave.position.set(0.55, 0, 0.1);
  knight.add(leftGreave);

  const rightGreave = leftGreave.clone();
  rightGreave.position.x = -0.55;
  knight.add(rightGreave);

  const bootGeo = new THREE.BoxGeometry(0.75, 0.32, 1.3);
  const leftBoot = new THREE.Mesh(bootGeo, darkArmorMaterial);
  leftBoot.position.set(0.55, -0.65, 0.35);
  knight.add(leftBoot);

  const rightBoot = leftBoot.clone();
  rightBoot.position.x = -0.55;
  knight.add(rightBoot);

  // Tassets
  const tassetGeo = new THREE.ConeGeometry(0.5, 1.2, 6, 1, true);
  const leftTasset = new THREE.Mesh(tassetGeo, armorMaterial);
  leftTasset.position.set(0.9, 1.6, 0.4);
  leftTasset.rotation.set(Math.PI, 0, -Math.PI / 8);
  knight.add(leftTasset);

  const rightTasset = leftTasset.clone();
  rightTasset.position.x = -0.9;
  rightTasset.rotation.z = Math.PI / 8;
  knight.add(rightTasset);

  const frontTassetGeo = new THREE.ConeGeometry(0.75, 1.8, 6, 1, true);
  const frontTasset = new THREE.Mesh(frontTassetGeo, clothMaterial);
  frontTasset.position.set(0, 1.4, 0.9);
  frontTasset.rotation.x = Math.PI;
  knight.add(frontTasset);

  const frontTrimGeo = new THREE.ConeGeometry(0.8, 0.2, 6);
  const frontTrim = new THREE.Mesh(frontTrimGeo, goldTrimMaterial);
  frontTrim.position.set(0, 2.25, 0.75);
  knight.add(frontTrim);

  // Cape
  const capeGeo = new THREE.PlaneGeometry(3.6, 5.8, 12, 18);
  const capeMat = new THREE.MeshStandardMaterial({
    color: 0x1b233a,
    roughness: 0.8,
    side: THREE.DoubleSide,
  });
  const cape = new THREE.Mesh(capeGeo, capeMat);
  cape.position.set(0, 3.6, -0.2);
  cape.rotation.x = -Math.PI / 16;
  cape.geometry.translate(0, -2.5, 0);
  cape.castShadow = true;
  knight.add(cape);

  // Head
  const headGeo = new THREE.SphereGeometry(0.65, 24, 24);
  const head = new THREE.Mesh(headGeo, skinMaterial);
  head.position.y = 4.7;
  knight.add(head);

  // Facial plane hint
  const noseGeo = new THREE.ConeGeometry(0.12, 0.3, 8);
  const nose = new THREE.Mesh(noseGeo, skinMaterial);
  nose.position.set(0, 4.65, 0.58);
  nose.rotation.x = Math.PI;
  knight.add(nose);

  // Hair
  const hairUpperGeo = new THREE.SphereGeometry(0.72, 24, 24, 0, Math.PI * 2, 0, Math.PI / 1.8);
  const hairUpper = new THREE.Mesh(hairUpperGeo, hairMaterial);
  hairUpper.position.y = 5.05;
  hairUpper.rotation.x = Math.PI;
  knight.add(hairUpper);

  const hairFringeGeo = new THREE.CylinderGeometry(0.7, 0.55, 0.8, 12, 1, true);
  const hairFringe = new THREE.Mesh(hairFringeGeo, hairMaterial);
  hairFringe.position.set(0, 4.9, 0.55);
  hairFringe.rotation.x = Math.PI / 2.2;
  knight.add(hairFringe);

  const hairStrandGeo = new THREE.CylinderGeometry(0.12, 0.06, 1.2, 8);
  for (let i = -1; i <= 1; i++) {
    const strand = new THREE.Mesh(hairStrandGeo, hairMaterial);
    strand.position.set(i * 0.25, 4.2, 0.6 + Math.abs(i) * 0.1);
    strand.rotation.x = Math.PI / 6;
    knight.add(strand);
  }

  const hairTailGeo = new THREE.CapsuleGeometry(0.22, 1.2, 8, 16);
  const hairTail = new THREE.Mesh(hairTailGeo, hairMaterial);
  hairTail.position.set(0, 4.1, -0.4);
  hairTail.rotation.x = -Math.PI / 5;
  knight.add(hairTail);

  // Helmet band
  const circletGeo = new THREE.TorusGeometry(0.7, 0.08, 12, 48);
  const circlet = new THREE.Mesh(circletGeo, goldTrimMaterial);
  circlet.position.y = 4.9;
  circlet.rotation.x = Math.PI / 2;
  knight.add(circlet);

  // Eyes
  const eyeGeo = new THREE.SphereGeometry(0.09, 12, 12);
  const leftEye = new THREE.Mesh(
    eyeGeo,
    new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0x9cb7ff, emissiveIntensity: 0.4 })
  );
  leftEye.position.set(0.22, 4.65, 0.64);
  knight.add(leftEye);

  const rightEye = leftEye.clone();
  rightEye.position.x = -0.22;
  knight.add(rightEye);

  // Eyebrows
  const browGeo = new THREE.BoxGeometry(0.25, 0.06, 0.12);
  const leftBrow = new THREE.Mesh(browGeo, hairMaterial);
  leftBrow.position.set(0.22, 4.82, 0.62);
  leftBrow.rotation.z = -Math.PI / 12;
  knight.add(leftBrow);

  const rightBrow = leftBrow.clone();
  rightBrow.position.x = -0.22;
  rightBrow.rotation.z = Math.PI / 12;
  knight.add(rightBrow);

  // Neck guard
  const neckGeo = new THREE.TorusGeometry(0.55, 0.12, 16, 36);
  const neckGuard = new THREE.Mesh(neckGeo, darkArmorMaterial);
  neckGuard.position.y = 4.2;
  neckGuard.rotation.x = Math.PI / 2;
  knight.add(neckGuard);

  // Belt
  const beltGeo = new THREE.TorusGeometry(1.05, 0.11, 16, 48);
  const belt = new THREE.Mesh(beltGeo, goldTrimMaterial);
  belt.position.y = 2.1;
  belt.rotation.x = Math.PI / 2;
  knight.add(belt);

  // Cape clips
  const clipGeo = new THREE.SphereGeometry(0.2, 16, 16);
  const leftClip = new THREE.Mesh(clipGeo, goldTrimMaterial);
  leftClip.position.set(0.5, 3.9, 0.65);
  knight.add(leftClip);

  const rightClip = leftClip.clone();
  rightClip.position.x = -0.5;
  knight.add(rightClip);

  // Sword
  const sword = createSword(armorMaterial, goldTrimMaterial);
  sword.position.set(-2.4, 1.4, 0.3);
  sword.rotation.set(THREE.MathUtils.degToRad(-20), THREE.MathUtils.degToRad(10), THREE.MathUtils.degToRad(40));
  knight.add(sword);

  // Shield
  const shield = createShield(armorMaterial, goldTrimMaterial, clothMaterial);
  shield.position.set(2.7, 2.1, -0.2);
  shield.rotation.set(THREE.MathUtils.degToRad(0), THREE.MathUtils.degToRad(-30), THREE.MathUtils.degToRad(-20));
  knight.add(shield);

  // Undersuit detail
  const waistWrapGeo = new THREE.CylinderGeometry(1.05, 1.1, 1.6, 24);
  const waistWrap = new THREE.Mesh(waistWrapGeo, underSuitMaterial);
  waistWrap.position.y = 2.5;
  knight.add(waistWrap);

  // Pose
  knight.rotation.y = THREE.MathUtils.degToRad(12);

  return knight;
}

function createSword(bladeMaterial, hiltMaterial) {
  const sword = new THREE.Group();

  const bladeGeo = new THREE.BoxGeometry(0.25, 0.25, 3.6);
  const blade = new THREE.Mesh(
    bladeGeo,
    new THREE.MeshStandardMaterial({
      color: 0xcfd7e6,
      metalness: 0.95,
      roughness: 0.15,
      emissive: 0x2f4fd0,
      emissiveIntensity: 0.12,
    })
  );
  blade.position.z = 2;
  sword.add(blade);

  const fullerGeo = new THREE.BoxGeometry(0.08, 0.08, 3.5);
  const fuller = new THREE.Mesh(
    fullerGeo,
    new THREE.MeshStandardMaterial({
      color: 0x9ba7c0,
      metalness: 0.9,
      roughness: 0.2,
    })
  );
  fuller.position.z = 2.05;
  sword.add(fuller);

  const guardGeo = new THREE.BoxGeometry(0.7, 0.25, 0.2);
  const guard = new THREE.Mesh(guardGeo, hiltMaterial);
  guard.position.z = 0.6;
  sword.add(guard);

  const gripGeo = new THREE.CylinderGeometry(0.12, 0.1, 0.9, 12);
  const grip = new THREE.Mesh(gripGeo, hiltMaterial.clone());
  grip.material.color.set(0x2a2f3a);
  grip.position.z = 0.2;
  sword.add(grip);

  const pommelGeo = new THREE.SphereGeometry(0.16, 12, 12);
  const pommel = new THREE.Mesh(pommelGeo, hiltMaterial);
  pommel.position.z = -0.15;
  sword.add(pommel);

  return sword;
}

function createShield(armorMaterial, trimMaterial, insigniaMaterial) {
  const shield = new THREE.Group();

  const bodyGeo = new THREE.CylinderGeometry(0, 1.2, 2.6, 6, 1, false);
  const body = new THREE.Mesh(bodyGeo, armorMaterial);
  body.rotation.x = Math.PI / 2;
  body.rotation.z = Math.PI;
  shield.add(body);

  const rimGeo = new THREE.TorusGeometry(1.1, 0.08, 12, 48);
  const rim = new THREE.Mesh(rimGeo, trimMaterial);
  rim.rotation.x = Math.PI / 2;
  shield.add(rim);

  const bossGeo = new THREE.SphereGeometry(0.45, 24, 24);
  const boss = new THREE.Mesh(bossGeo, trimMaterial);
  boss.position.z = 0.4;
  shield.add(boss);

  const emblemGeo = new THREE.ShapeGeometry(createInsigniaShape());
  const emblem = new THREE.Mesh(
    emblemGeo,
    new THREE.MeshStandardMaterial({
      color: 0x445a9f,
      emissive: 0x1f2b5a,
      emissiveIntensity: 0.2,
      metalness: 0.3,
      roughness: 0.6,
    })
  );
  emblem.rotation.x = -Math.PI / 2;
  emblem.scale.set(0.8, 0.8, 0.8);
  emblem.position.z = 0.38;
  shield.add(emblem);

  return shield;
}

function createInsigniaShape() {
  const shape = new THREE.Shape();
  shape.moveTo(0, 1);
  shape.quadraticCurveTo(0.7, 0.3, 0.35, -0.8);
  shape.lineTo(0, -1.4);
  shape.lineTo(-0.35, -0.8);
  shape.quadraticCurveTo(-0.7, 0.3, 0, 1);
  return shape;
}

function resizeRenderer() {
  const { clientWidth, clientHeight } = renderer.domElement;
  if (renderer.domElement.width !== clientWidth || renderer.domElement.height !== clientHeight) {
    renderer.setSize(clientWidth, clientHeight, false);
    camera.aspect = clientWidth / clientHeight;
    camera.updateProjectionMatrix();
  }
}

function animate(time) {
  resizeRenderer();

  knight.rotation.y = THREE.MathUtils.degToRad(12) + Math.sin(time * 0.0004) * 0.05;

  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

requestAnimationFrame(animate);

window.addEventListener("resize", () => {
  resizeRenderer();
});
