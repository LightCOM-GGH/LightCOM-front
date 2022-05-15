import { useEffect } from "react";
import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import * as THREE from "three";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Camera } from "three";

const Home: NextPage = () => {
  useEffect(() => {
    let scene: THREE.Scene;
    let camera: THREE.PerspectiveCamera;
    let renderer: THREE.WebGLRenderer;
    let controls: OrbitControls;
    let card = new THREE.Object3D();
    let light: THREE.DirectionalLight;

    const size_ratio = 1.5;

    const container = document.getElementById("card-container");
    function init() {
      window.addEventListener("resize", onWindowResize);

      scene = new THREE.Scene();
      scene.background = new THREE.Color(0xffffff);

      camera = new THREE.PerspectiveCamera(
        40,
        window.innerWidth / window.innerHeight,
        1,
        5000
      );
      camera.position.z = 500;
      camera.rotation.z = Math.PI / 2;

      renderer = new THREE.WebGLRenderer({ antialias: true });

      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap

      //Create a DirectionalLight and turn on shadows for the light
      light = new THREE.DirectionalLight( 0xffffff, 1 );
      light.position.set(camera.position.x, camera.position.y, camera.position.z); //default; light shining from top
      light.castShadow = true; // default false
      scene.add( light );

      //Set up shadow properties for the light
      light.shadow.mapSize.width = 512; // default
      light.shadow.mapSize.height = 512; // default
      light.shadow.camera.near = 0.5; // default
      light.shadow.camera.far = 500; // default
      renderer.setSize(window.innerWidth / size_ratio, window.innerHeight / size_ratio);
      container?.appendChild(renderer.domElement);

      controls = new OrbitControls(camera, renderer.domElement);
      controls.enableZoom = false;
      controls.enablePan = false;
      controls.enableDamping = true;

      // load card
      new MTLLoader().load("/untitled.mtl", function (materials) {
        materials.preload();
        new OBJLoader().setMaterials(materials).load(
          "/untitled.obj",
          function (obj) {
            card = obj; // copy element
            scene.add(card); // add element to scene
            card.rotation.x = Math.PI / 2; // rotation pour fixer le model
            card.rotation.y = Math.PI; // le model est a l'envers fix bugger
            card.rotation.z = Math.PI;
            renderer.render(scene, camera); // refresh le render
            animate(); // lancer l'animation
          },
          function (xhr) {
            console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
          }
        );
      });
    }

    function animate() {
      requestAnimationFrame(animate);

      const time = Date.now() / 1000; // trouvé sur stackoverflow
      card.rotation.y = Math.sin(time / 4) / 4 - Math.PI; // trouver par tatonement
      card.rotation.x = Math.sin(time / 2) / 2 + Math.PI / 2; // same
      card.rotation.z = Math.sin(time / 2) / 2; // same

      light.position.set(camera.position.x, camera.position.y, camera.position.z);
      
      light.rotation.x = Math.sin(time / 2) / 2 + Math.PI / 2; // same
      light.rotation.y = Math.sin(time / 4) / 4 - Math.PI; // same
      light.rotation.z = Math.sin(time / 2) / 2; // same

      controls.update();
      renderer.render(scene, camera);
    }

    function onWindowResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth / size_ratio, window.innerHeight / size_ratio);
    }

    if (typeof window !== "undefined") {
      init();
    }
  }, []);

  return (
    <div>
      <Head>
        <title>IOT</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex min-h-screen text-center image-url1">
        <div className="m-auto">
          <h1 className="title text-white">
            LightCOM.
            <br />
            Never Ever Wait Again.
          </h1>
        </div>
      </div>

      <div className="flex min-h-screen text-center">
        <div className="m-auto">
          <h1 className="title text-black pt-32">
            Say Hello to IOT: I Observ Traffic
          </h1>
          <div id="card-container" className="text-center"></div>
        </div>
      </div>

      <div className="flex min-h-screen text-center">
        <div className="m-auto flex flex-col">
          <h1 className="title text-black">Be Faster, Be Smarter.</h1>
          <div className="flex-1">
            <Image
              src="/road.png"
              alt="API"
              width={1000}
              height={600}
              className="mx-auto"
            />
          </div>
        </div>
      </div>

      <div className="flex min-h-screen text-center">
        <div className="m-auto flex flex-col">
          <h1 className="title text-black">A Powerful API.</h1>
          <div className="flex-1">
            <Image
              src="/api.png"
              alt="API"
              width={900}
              height={600}
              className="mx-auto"
            />
          </div>
        </div>
      </div>

      <div className="flex min-h-screen text-center">
      <div className="m-auto flex flex-col">
          <h1 className="title text-black">Install Now.</h1>
          <div style={{flex: 1}}>
            <Image
              src="/app1.png"
              alt="API"
              width={350}
              height={700}
              className="mx-auto"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
