import './style.css';
import * as THREE from 'three';
import { ARButton } from 'three/examples/jsm/webxr/ARButton.js';

let camera, scene, renderer;
let cone, tetrahedron, torus;

init();
animate();

function init() {
    const container = document.createElement('div');
    document.body.appendChild(container);

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 20);

    // --- ОСВІТЛЕННЯ ---
    // Напівсферичне світло для базового фону
    const ambientLight = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
    scene.add(ambientLight);

    // Спрямоване світло для відблисків на глянці та чітких тіней на кільці
    const directLight = new THREE.DirectionalLight(0xffffff, 2.5);
    directLight.position.set(2, 4, 2);
    scene.add(directLight);

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.xr.enabled = true;
    container.appendChild(renderer.domElement);

    document.body.appendChild(ARButton.createButton(renderer));

    // --- ОБ'ЄКТИ ЗА ВАРІАНТОМ ---

    // 1. КОНУС - ЧЕРВОНИЙ ГЛЯНЦЕВИЙ (MeshStandardMaterial)
    const geometry1 = new THREE.ConeGeometry(0.15, 0.3, 32);
    const material1 = new THREE.MeshStandardMaterial({ 
        color: 0xff0000, 
        roughness: 0.05, // Дуже гладкий
        metalness: 0.5   // Ефект лакованого металу
    });
    cone = new THREE.Mesh(geometry1, material1);
    cone.position.set(-0.5, 0, -1.5);
    scene.add(cone);

    // 2. ТЕТРАЕДР - ЗЕЛЕНИЙ МАТОВИЙ (MeshLambertMaterial)
    // Матеріал Ламберта ідеально розсіює світло без відблисків
    const geometry2 = new THREE.TetrahedronGeometry(0.2);
    const material2 = new THREE.MeshLambertMaterial({ color: 0x00ff00 });
    tetrahedron = new THREE.Mesh(geometry2, material2);
    tetrahedron.position.set(0, 0, -1.5);
    scene.add(tetrahedron);

    // 3. КІЛЬЦЕ (ТОР) - ОБ'ЄМНЕ, НАПІВПРОЗОРЕ, МАЛЬОВАНЕ (MeshToonMaterial)
    // Створюємо карту градієнта для ефекту коміксу (Cel-shading)
    const colors = new Uint8Array([0, 128, 255]);
    const gradientMap = new THREE.DataTexture(colors, colors.length, 1, THREE.LuminanceFormat);
    gradientMap.needsUpdate = true;

    const geometry3 = new THREE.TorusGeometry(0.12, 0.05, 16, 100);
    const material3 = new THREE.MeshToonMaterial({ 
        color: 0x00ffff, 
        gradientMap: gradientMap,
        transparent: true, // Вмикаємо прозорість
        opacity: 0.6       // Рівень прозорості
    });
    torus = new THREE.Mesh(geometry3, material3);
    torus.position.set(0.5, 0, -1.5);
    scene.add(torus);

    window.addEventListener('resize', onWindowResize);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    renderer.setAnimationLoop(render);
}

function render() {
    // Анімація об'єктів
    cone.rotation.y += 0.01;
    
    tetrahedron.rotation.x += 0.015;
    tetrahedron.rotation.y += 0.01;
    
    torus.rotation.x += 0.01;
    torus.rotation.y += 0.02;

    renderer.render(scene, camera);
}

