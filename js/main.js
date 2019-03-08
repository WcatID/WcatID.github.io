if (WEBGL.isWebGLAvailable() === false) {

  document.body.appendChild(WEBGL.getWebGLErrorMessage());

}

var container, controls;
var camera, scene, renderer, light;

var clock = new THREE.Clock();

var mixer, action_idles, action_skills;

init();
animate();

function init() {

  container = document.createElement('div');
  $('#madoka_here')[0].appendChild(container);

  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 2000);
  camera.position.set(0, 40, 150);

  scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0xa0a0a0, 200, 1000);

  light = new THREE.HemisphereLight(0xffffff, 0x444444);
  light.position.set(0, 200, 0);
  scene.add(light);

  light = new THREE.DirectionalLight(0x888888);
  light.position.set(0, 200, 200);
  light.castShadow = true;
  light.shadow.camera.top = 180;
  light.shadow.camera.bottom = -100;
  light.shadow.camera.left = -120;
  light.shadow.camera.right = 120;
  scene.add(light);

  var mesh = new THREE.Mesh(new THREE.PlaneBufferGeometry(2000, 2000), new THREE.MeshPhongMaterial({
    color: 0x999999,
    depthWrite: false
  }));
  mesh.rotation.x = -Math.PI / 2;
  mesh.receiveShadow = true;
  //scene.add(mesh); // hide ground

  var loader = new THREE.FBXLoader();
  arr_models = ["ply_20705440", "ply_20505430", "ply_20605450", "ply_20304520",
    "ply_20600770", "ply_20903760"
  ]
  var model_fn = "models/" + arr_models[Math.floor(Math.random() * arr_models.length)] + ".fbx";
  loader.load(model_fn, function(object) {

    mixer = new THREE.AnimationMixer(object);

    action_idles = [
      mixer.clipAction(THREE.AnimationClip.parse(anim_Idle003())),
      mixer.clipAction(THREE.AnimationClip.parse(anim_Idle004Good())),
    ];
    action_idles.forEach(function(act) {
      act.setLoop(THREE.LoopRepeat);
      act.clampWhenFinished = true;
      act.enable = true;
    });
    action_skills = [
      mixer.clipAction(THREE.AnimationClip.parse(anim_Skill001())),
      mixer.clipAction(THREE.AnimationClip.parse(anim_Skill002())),
      mixer.clipAction(THREE.AnimationClip.parse(anim_Skill003())),
      mixer.clipAction(THREE.AnimationClip.parse(anim_Skill004())),
      mixer.clipAction(THREE.AnimationClip.parse(anim_Skill005())),
      mixer.clipAction(THREE.AnimationClip.parse(anim_Skill006())),
    ];
    action_skills.forEach(function(act) {
      act.setLoop(THREE.LoopOnce);
      act.clampWhenFinished = true;
      act.enable = true;
    });

    action_skills[0].play();
    mixer.addEventListener('finished', function(e) {
      console.log("FINI");
      mixer.stopAllAction();
      action_rand = action_idles[Math.floor(Math.random() * action_idles.length)];
      action_rand.play().reset();
    });

    object.scale.x = 100;
    object.scale.y = 100;
    object.scale.z = 100;
    object.traverse(function(child) {

      if (child.isMesh) {
        console.log(child);

        child.castShadow = true;
        child.receiveShadow = true;
      }
    }, undefined, function(error) {
      console.error(error);
    });
    scene.add(object);

  });

  renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true
  });
  renderer.setClearColor(0x000000, 0);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth / 4, window.innerHeight / 4);
  renderer.shadowMap.enabled = true;
  container.appendChild(renderer.domElement);

  window.addEventListener('resize', onWindowResize, false);
}

function changeModelAnim() {
  mixer.stopAllAction();
  action_rand = action_skills[Math.floor(Math.random() * action_skills.length)];
  action_rand.play().reset();
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth / 4, window.innerHeight / 4);
}

function animate() {
  requestAnimationFrame(animate);
  var delta = clock.getDelta();
  if (mixer) mixer.update(delta);
  renderer.render(scene, camera);
}
