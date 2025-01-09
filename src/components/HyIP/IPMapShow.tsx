import React, { useState, useEffect } from "react";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Modal } from "antd";
import L from "leaflet";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";

 
const IPMapShow: React.FC<{}> = (props: any) => { 
  const [markers, setMarkers] = useState<{
    id: number;
    position: L.LatLngTuple;
    ip: string;
    hostname: string;
    city: string;
    region: string;
    country: string;
    loc: string;
    org: string;
    timezone: string;
  }[]>([]);
  const [loc, setLoc] = useState<[number, number] | null>(null);
  const { showModalVisible, onCancel ,ip} = props;  
  console.log("ip==="+ip);

  useEffect(() => {
    // 取資料API
    if (ip === "") {
        return;
    }

    fetch("http://localhost:8972/api/hyipcontroller/getIPInfo?ip="+ip)
      .then((response) => response.json())
      .then((data) => {
        console.log("data.loc==="+data.loc);
   
        const loc = data.loc.split(",");
        setLoc([parseFloat(loc[0]), parseFloat(loc[1])]);
        const marker = {
          id: 1,
          position: [parseFloat(loc[0]), parseFloat(loc[1])] as L.LatLngTuple,
          ip: data.ip,
          hostname: data.hostname,
          city: data.city,
          region: data.region,
          country: data.country,
          loc: data.loc,
          org: data.org,
          timezone: data.timezone,
        };
        setMarkers([marker]);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, [ip]);
 
  return (
    
    <Modal
    title="IP Map"
    visible={showModalVisible} 
    onCancel={() =>{
        setLoc(null);
        onCancel();
    } }
    width={1000} 
    footer={null}> 
    {loc !== null && ip !== "" && (
      <MapContainer
        center={loc} // 地圖中心（經緯度）
        zoom={4} // 縮放等級
        style={{ height: "600px", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {/* 添加標記點 */}
        {markers.map((marker) => (
            <Marker key={marker.id} position={marker.position}>
            <Popup>{marker.ip}</Popup>
            </Marker>
        ))}
      </MapContainer> 
    )}   
    </Modal>
  );
};

export default IPMapShow;