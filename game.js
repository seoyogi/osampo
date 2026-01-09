let scene, camera, renderer;
let player;
let move = {up:false, down:false, left:false, right:false};
let objects = [];

init();
animate();

function init() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xa0d8f0);

  camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
  camera.position.set(0, 5, 10);

  renderer = new THREE.WebGLRenderer({antialias:true});
  renderer.setSize(window.innerWidth*0.9, window.innerHeight*0.6);
  document.getElementById("gameContainer").appendChild(renderer.domElement);

  // 地面
  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(50, 50),
    new THREE.MeshBasicMaterial({color:0x228B22})
  );
  ground.rotation.x = -Math.PI/2;
  scene.add(ground);

  // プレイヤー
  player = new THREE.Mesh(
    new THREE.BoxGeometry(1,2,1),
    new THREE.MeshBasicMaterial({color:0xffd700})
  );
  player.position.y = 1;
  scene.add(player);

  // 木
  const tree = new THREE.Mesh(new THREE.CylinderGeometry(0.5,0.5,3,12), new THREE.MeshBasicMaterial({color:0x8B4513}));
  tree.position.set(5,1.5,-5); tree.name="木"; scene.add(tree); objects.push(tree);
  const leaves = new THREE.Mesh(new THREE.SphereGeometry(1.5,12,12), new THREE.MeshBasicMaterial({color:0x00FF00}));
  leaves.position.set(5,3.5,-5); leaves.name="葉っぱ"; scene.add(leaves); objects.push(leaves);

  // 花
  const flower = new THREE.Mesh(new THREE.ConeGeometry(0.5,1,8), new THREE.MeshBasicMaterial({color:0xFF69B4}));
  flower.position.set(-4,0.5,-3); flower.name="花"; scene.add(flower); objects.push(flower);

  // 猫
  const cat = new THREE.Mesh(new THREE.BoxGeometry(1,0.5,0.5), new THREE.MeshBasicMaterial({color:0x000000}));
  cat.position.set(0,0.25,-7); cat.name="猫"; scene.add(cat); objects.push(cat);

  createTouchControls();

  document.addEventListener('keydown', (e)=>{ if(e.key=="ArrowUp") move.up=true; if(e.key=="ArrowDown") move.down=true; if(e.key=="ArrowLeft") move.left=true; if(e.key=="ArrowRight") move.right=true; });
  document.addEventListener('keyup', (e)=>{ if(e.key=="ArrowUp") move.up=false; if(e.key=="ArrowDown") move.down=false; if(e.key=="ArrowLeft") move.left=false; if(e.key=="ArrowRight") move.right=false; });
}

function animate(){
  requestAnimationFrame(animate);

  if(move.up) player.position.z -= 0.1;
  if(move.down) player.position.z += 0.1;
  if(move.left) player.position.x -= 0.1;
  if(move.right) player.position.x += 0.1;

  objects.forEach(obj=>{
    const dx = player.position.x - obj.position.x;
    const dz = player.position.z - obj.position.z;
    const distance = Math.sqrt(dx*dx + dz*dz);
    if(distance < 1.2){
      console.log(obj.name + "に触れました！");
    }
  });

  renderer.render(scene, camera);
}

function createTouchControls(){
  const buttons = ["↑","↓","←","→"];
  const directions = ["up","down","left","right"];
  buttons.forEach((btn,i)=>{
    const b = document.createElement("button");
    b.innerText = btn;
    b.style.position = "fixed";
    b.style.bottom = "20px";
    b.style.left = (20 + i*60) + "px";
    b.style.fontSize = "24px";
    b.style.width = "50px"; b.style.height="50px";
    b.addEventListener("touchstart", ()=> move[directions[i]] = true);
    b.addEventListener("touchend", ()=> move[directions[i]] = false);
    document.body.appendChild(b);
  });
}
