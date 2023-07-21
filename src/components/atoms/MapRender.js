import React, { useEffect, useState, useRef } from 'react';
import mapboxgl from 'mapbox-gl';

const MapRender = () => {
  const mapContainer = useRef(null);
  const map = useRef(null);

  useEffect(() => {
    console.log("map rendered");
    mapboxgl.accessToken = 'pk.eyJ1IjoicnViaWM0IiwiYSI6ImNrY3Vla3R1ZjF0YnYyeXQ2c243eWVpeHEifQ.Hgj0BjhuuOAowR_pE97V_Q';

    if (!map.current) {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/rubic4/clk5n3pvd00j501pe0juiej4p',
        center: [20, 44],
        zoom: 2
      });

      map.current.on('load', function () {
        map.current.resize();
      });
    }
  }, []);

  return <div ref={mapContainer} className="map" style={{height: "400px"}}/>;
};

export default MapRender;
