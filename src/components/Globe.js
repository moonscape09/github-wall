'use client';

import { useEffect, useRef, useState } from 'react';
import Globe from 'globe.gl';
import * as THREE from 'three';

const GitHubGlobe = () => {
  const globeRef = useRef(null);
  const [polygonsData, setPolygonsData] = useState(null);

  useEffect(() => {
    fetch('/data/custom.geo-4.json')
      .then(res => {
        if (!res.ok) throw new Error(`Failed to load GeoJSON: ${res.status}`);
        return res.json();
      })
      .then(geojson => setPolygonsData(geojson.features))
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    if (!globeRef.current || !polygonsData) return;

    // Initialize globe
    const myGlobe = Globe()(globeRef.current)
      .globeImageUrl(null)         // no texture image
      .bumpImageUrl('https://cdn.jsdelivr.net/npm/three-globe/example/img/earth-topology.png')          // no bump map
      .backgroundImageUrl('https://cdn.jsdelivr.net/npm/three-globe/example/img/night-sky.png')
      .showAtmosphere(true)
      .atmosphereColor('rgba(122, 122, 122, 0.02)') // perhaps a second transparent globe?
      .atmosphereAltitude(0.5)
      .polygonsData(polygonsData)
      .polygonAltitude(0.01)
      .polygonCapColor(() => '#1a1d3d')
      .polygonSideColor(() => 'rgba(33, 33, 33, 0.1)')
      .polygonStrokeColor(() => 'rgba(162, 162, 162, 0.1)')
      .polygonLabel(({ properties }) => `
        <div style="color:#fff; font-size:12px;">
          ${properties.ADMIN || properties.name || 'Unknown'}
        </div>
      `);

      

    const scene = myGlobe.scene();
  
    const sphereMaterial = new THREE.MeshPhongMaterial({
      color: '#080017',   // adjust to your desired color
      shininess: 0,      // set low if you want matte look
      bumpScale: 100 // subtle specular; or 0x000000 for fully flat
    });
    myGlobe.globeMaterial(sphereMaterial);

    // Optionally add a subtle light so color is visible
    const ambientLight = new THREE.AmbientLight(0x444444, 0.5);
    scene.add(ambientLight);

    // Directional from right side:
    const dirLight = new THREE.DirectionalLight(0xffffff, 1);
    // Position the light to the right of the globe:
    // e.g., x positive, y maybe slightly above, z maybe behind or in front depending on desired angle.
    dirLight.position.set(5, 0, 0); // far to the +X side
    scene.add(dirLight);
    // Controls
    myGlobe.controls().autoRotate = true;
    myGlobe.controls().autoRotateSpeed = -0.5;
    myGlobe.controls().enableZoom = false;
    myGlobe.pointOfView({ lat: 20, lng: 0, altitude: 3 }, 0);

    return () => {
      myGlobe.pauseAnimation();
      scene.remove(ambientLight, dirLight);
    };
  }, [polygonsData]);

  return (
    <div
      ref={globeRef}
      style={{ width: '100%', height: '100vh' }}
    />
  );
};

export default GitHubGlobe;