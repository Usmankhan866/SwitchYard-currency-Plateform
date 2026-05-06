"use client";

import { memo } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
} from "react-simple-maps";

const GEO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const markers = [
  { name: "New York", coordinates: [-74.006, 40.7128] as [number, number], value: "8.2K" },
  { name: "London", coordinates: [-0.1278, 51.5074] as [number, number], value: "5.4K" },
  { name: "Tokyo", coordinates: [139.6917, 35.6895] as [number, number], value: "4.1K" },
  { name: "Sydney", coordinates: [151.2093, -33.8688] as [number, number], value: "2.8K" },
  { name: "São Paulo", coordinates: [-46.6333, -23.5505] as [number, number], value: "3.2K" },
  { name: "Dubai", coordinates: [55.2708, 25.2048] as [number, number], value: "1.9K" },
  { name: "Singapore", coordinates: [103.8198, 1.3521] as [number, number], value: "2.1K" },
];

function WorldMapInner() {
  return (
    <ComposableMap
      projectionConfig={{ rotate: [-10, 0, 0], scale: 147 }}
      height={350}
      style={{ width: "100%", height: "auto" }}
    >
      <Geographies geography={GEO_URL}>
        {({ geographies }) =>
          geographies.map((geo) => (
            <Geography
              key={geo.rpiD ?? geo.properties?.name ?? geo.id}
              geography={geo}
              fill="#e8ecf1"
              stroke="#d0d7de"
              strokeWidth={0.5}
              style={{
                default: { outline: "none" },
                hover: { fill: "#d0d7de", outline: "none" },
                pressed: { outline: "none" },
              }}
            />
          ))
        }
      </Geographies>
      {markers.map(({ name, coordinates }) => (
        <Marker key={name} coordinates={coordinates}>
          <circle r={5} fill="#4680ff" stroke="#fff" strokeWidth={1.5} />
        </Marker>
      ))}
    </ComposableMap>
  );
}

export const WorldMap = memo(WorldMapInner);
