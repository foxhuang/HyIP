import React, { useState, useEffect } from "react";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Card } from "antd";
import L from "leaflet";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";

const GlobalMap = () => {
  //取資料API　http://127.0.0.1:8972/api/hyipcontroller/getIPInfo?ip=192.83.187.216
  //輸出格式 {"ip":"211.20.225.247","hostname":"211-20-225-247.hinet-ip.hinet.net","city":"Kaohsiung","region":"Takao","country":"TW","loc":"22.6163,120.3133","org":"AS3462 Data Communication Business Group","timezone":"Asia/Taipei","readme":"https://ipinfo.io/missingauth"}
  const [markers, setMarkers] = useState<{ id: number; position: L.LatLngTuple; name: string }[]>([]);

  useEffect(() => {
    // 取資料API
    fetch("http://localhost:8972/api/hyipcontroller/getIPInfo?ip=192.83.187.216")
      .then((response) => response.json())
      .then((data) => {
        const loc = data.loc.split(",");
        const marker = {
          id: 1,
          position: [parseFloat(loc[0]), parseFloat(loc[1])] as L.LatLngTuple,
          name: `${data.ip} ${data.city} ${data.region} ${data.country}`,
        };
        setMarkers([marker]);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);


　
  return (
    <Card title="全球地圖" style={{ margin: "20px" }}>
      <MapContainer
        center={[25, 120]} // 地圖中心（經緯度）
        zoom={4} // 縮放等級
        style={{ height: "500px", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {/* 添加標記點 */}
        {markers.map((marker) => (
          <Marker key={marker.id} position={marker.position}>
            <Popup>{marker.name}</Popup>
          </Marker>
        ))}
      </MapContainer>
    </Card>
  );
};

export default GlobalMap;