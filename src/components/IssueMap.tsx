import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import type { Issue } from "../pages/Dashboard";

// Fix default marker icons
import iconUrl from "leaflet/dist/images/marker-icon.png";
import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";

   const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'in-progress': return 'bg-blue-100 text-blue-800';
            case 'resolved': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };
const DefaultIcon = L.icon({
  iconUrl,
  iconRetinaUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

interface Props {
  issues: Issue[];
}

const IssueMap: React.FC<Props> = ({ issues }) => {

  const haldwaniBounds: L.LatLngBoundsExpression = [
    [29.16, 79.48],
    [29.28, 79.58],
  ];

  return (
    <MapContainer
      center={[29.22, 79.52]}
      zoom={13}
      minZoom={13}
      maxZoom={18}
      style={{ height: "500px", width: "100%" }}
      maxBounds={haldwaniBounds}
      maxBoundsViscosity={1.0}
      className="rounded-xl"
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />

     {issues.map((issue) => (
  <Marker
    key={issue.id}
    position={[issue.location.latitude, issue.location.longitude]}
  >
    <Popup>
      <div  style={{ maxWidth: "250px" }}>
        <strong>{issue.title}</strong>
        <p className="text-neutral-600">{issue.description}</p>
        <p className={`${getStatusColor(issue.status)} w-fit px-2 py-2 rounded-full`}>Status: {issue.status}</p>

          <img
            src={issue.image}
            style={{ width: "100%", marginTop: "5px", borderRadius: "4px" }}
          />

      </div>
    </Popup>
  </Marker>
))}

    </MapContainer>
  );
};

export default IssueMap;
