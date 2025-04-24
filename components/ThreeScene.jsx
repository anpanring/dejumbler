import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const PixelatedTexturedCubeScene = () => {
  const mountRef = useRef(null);
  const rendererRef = useRef(null);
  const cubeRef = useRef(null);

  // Refs to store random rotation speeds
  const rotateSpeedXRef = useRef(0);
  const rotateSpeedYRef = useRef(0);
  const rotateSpeedZRef = useRef(0);
  const maxRotationSpeed = 0.02;

  // Ref to store the animation frame ID for cleanup
  const animationFrameId = useRef(null);


  useEffect(() => {
    if (typeof window === 'undefined' || !mountRef.current) return;

    console.log("Setting up animation loop...");

    // --- Three.js Setup (Scene, Camera, Renderer, Controls, Lights, Pixelation) ---
    // ... (Code from previous response for scene, camera, renderer, controls, lights, render target, ppScene, ppCamera, ppGeometry, ppMaterial, ppMesh) ...
     const scene = new THREE.Scene();
     scene.background = new THREE.Color(0xffffff);
     const camera = new THREE.PerspectiveCamera(75, mountRef.current.clientWidth / mountRef.current.clientHeight, 0.1, 1000);
     camera.position.z = 3;
     const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });
     rendererRef.current = renderer;
     renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
     renderer.setPixelRatio(window.devicePixelRatio);
     mountRef.current.appendChild(renderer.domElement);
     const controls = new OrbitControls(camera, renderer.domElement);
     controls.enableDamping = true;
     controls.dampingFactor = 0.25;
     const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
     scene.add(ambientLight);
     const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
     directionalLight.position.set(1, 1, 1).normalize();
     scene.add(directionalLight);

     // Pixelation Setup
     const pixelSizeDivisor = 32;
     const renderTargetWidth = Math.floor(mountRef.current.clientWidth / window.devicePixelRatio / pixelSizeDivisor);
     const renderTargetHeight = Math.floor(mountRef.current.clientHeight / window.devicePixelRatio / pixelSizeDivisor);
     const renderTarget = new THREE.WebGLRenderTarget(renderTargetWidth, renderTargetHeight, { minFilter: THREE.NearestFilter, magFilter: THREE.NearestFilter, format: THREE.RGBAFormat, type: THREE.UnsignedByteType });
     const ppScene = new THREE.Scene();
     const ppCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
     const ppGeometry = new THREE.PlaneGeometry(2, 2);
     const ppMaterial = new THREE.MeshBasicMaterial({ map: renderTarget.texture });
     const ppMesh = new THREE.Mesh(ppGeometry, ppMaterial);
     ppScene.add(ppMesh);


    // --- Generate Random Rotation Speeds Once ---
    rotateSpeedXRef.current = (Math.random() - 0.5) * maxRotationSpeed * 2;
    rotateSpeedYRef.current = (Math.random() - 0.5) * maxRotationSpeed * 2;
    rotateSpeedZRef.current = (Math.random() - 0.5) * maxRotationSpeed * 2;


    // --- Texture Loading and Cube Creation ---
    const textureLoader = new THREE.TextureLoader();
    const imageUrl = '/images/dejumbler-logo.png';

    textureLoader.load(
      imageUrl,
      (texture) => {
        console.log("Texture loaded successfully! Creating cube...");
        const material = new THREE.MeshStandardMaterial({ map: texture });
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const cube = new THREE.Mesh(geometry, material);
        scene.add(cube);
        cubeRef.current = cube; // Store the cube mesh in the ref

        texture.minFilter = THREE.NearestFilter;
        texture.magFilter = THREE.NearestFilter;
        texture.needsUpdate = true;
      },
      undefined, // onProgress
      (error) => { console.error('An error happened loading the texture:', error); }
    );


    // --- Define the Animation Loop Function ---
    const animate = () => {
      // 1. Schedule the next frame
      animationFrameId.current = requestAnimationFrame(animate);

      // 2. Perform animation updates
      // Check if the cube exists (it's created asynchronously after texture loads)
      if (cubeRef.current) {
         // Apply continuous rotation using the random speeds
         cubeRef.current.rotation.x += rotateSpeedXRef.current;
         cubeRef.current.rotation.y += rotateSpeedYRef.current;
         cubeRef.current.rotation.z += rotateSpeedZRef.current;
      }

      // Update OrbitControls (if enabled) - this allows user interaction to orbit the camera
      controls.update(); // IMPORTANT: Call this if using OrbitControls

      // 3. Render the scene
      // Render Step 1: Render the main scene into the low-res render target
      rendererRef.current.setRenderTarget(renderTarget);
      rendererRef.current.render(scene, camera);

      // Render Step 2: Render the low-res texture from the render target onto the screen
      rendererRef.current.setRenderTarget(null); // Set target back to the screen
      rendererRef.current.render(ppScene, ppCamera); // Render the post-processing scene
    };

    // --- Handle Window Resizing ---
    const handleResize = () => {
        if (mountRef.current && camera && rendererRef.current && renderTarget) {
            const width = mountRef.current.clientWidth;
            const height = mountRef.current.clientHeight;
            const pixelRatio = window.devicePixelRatio;

            camera.aspect = width / height;
            camera.updateProjectionMatrix();

            rendererRef.current.setSize(width, height);
            rendererRef.current.setPixelRatio(pixelRatio);

            const newRenderTargetWidth = Math.floor(width / pixelRatio / pixelSizeDivisor);
            const newRenderTargetHeight = Math.floor(height / pixelRatio / pixelSizeDivisor);
            renderTarget.setSize(newRenderTargetWidth, newRenderTargetHeight);
        }
    };
    window.addEventListener('resize', handleResize);


    // --- Start the Animation Loop ---
    animate();


    // --- Cleanup Function (Runs when component unmounts) ---
    return () => {
      console.log("Cleaning up Three.js scene and stopping animation loop...");
      // 1. Cancel the scheduled animation frame
      cancelAnimationFrame(animationFrameId.current);

      // 2. Remove event listener
      window.removeEventListener('resize', handleResize);

      // 3. Dispose Three.js objects
      if (rendererRef.current && rendererRef.current.domElement) {
         // Remove canvas from DOM
         mountRef.current.removeChild(rendererRef.current.domElement);

         // Dispose renderer
         rendererRef.current.dispose();
         rendererRef.current = null; // Clear the ref

         // Dispose render target
         renderTarget.dispose();

         // Dispose main scene objects (including the cube's geometry and material)
         scene.traverse((object) => {
            if (object.isMesh) {
               object.geometry.dispose();
               if (Array.isArray(object.material)) {
                  object.material.forEach(material => material.dispose());
               } else {
                  material.dispose();
               }
            }
         });

         // Dispose post-processing objects
         ppGeometry.dispose();
         ppMaterial.dispose();
      }
      // Dispose controls
      if (controls) { controls.dispose(); }

      // Clear refs holding Three.js objects
      cubeRef.current = null;
      // speed refs will be garbage collected with the component
    };
  }, []); // Empty dependency array means this effect runs only once on mount

  // The div that will hold the Three.js canvas
  // Use next/dynamic with ssr: false for this component!
  return <div ref={mountRef} style={{ width: '100%', height: '500px', position: 'relative' }} />;
};

export default PixelatedTexturedCubeScene;