import React, { useEffect, useState } from 'react';
import { Table, Button } from 'antd';
import { IPMapShow } from '@/components/HyIP';

interface IPData {
  key: string;
  allowed: boolean;
  ip: string;
  lock_time: string;
  remaining_requests: number;
  reset_time: string;
  site_id: string;
}

const IPList: React.FC = () => {
  const [data, setData] = useState<IPData[]>([]);
  const [showModalVisible, handleShowModalVisible] = useState<boolean>(
    false
  ); 
  const [ip, setIP] = useState<string>(""); 

  useEffect(() => {
    // 取資料API
    fetch("http://localhost:8972/api/hyipcontroller/getIPList")
      .then((response) => response.json())
      .then((data) => {
        const ipData = Object.keys(data).map((key) => {
          const item = JSON.parse(data[key]);
          return {
            key,
            allowed: item.allowed,
            ip: item.ip,
            lock_time: item.lock_time,
            remaining_requests: item.remaining_requests,
            reset_time: item.reset_time,
            site_id: item.site_id,
          };
        });
        setData(ipData);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const columns = [
    {
      title: 'IP',
      dataIndex: 'ip',
      key: 'ip',
    },
    {
      title: 'Site ID',
      dataIndex: 'site_id',
      key: 'site_id',
    },
    {
      title: 'Allowed',
      dataIndex: 'allowed',
      key: 'allowed',
      render: (allowed: boolean) => (allowed ? 'Yes' : 'No'),
    },
    {
      title: 'Lock Time',
      dataIndex: 'lock_time',
      key: 'lock_time',
    },
    {
        title: 'IP Map',
        key: 'action',
        render: (text: any, record: IPData) => (
          <Button  onClick={() => {  
            setIP(record.ip);
            handleShowModalVisible(true); 
          }}>地圖</Button>
        ),
    },
  ];

  return (<>
   <IPMapShow   
        onCancel={() => {
            handleShowModalVisible(false); 
        }}  
        showModalVisible={showModalVisible}  
        ip={ip} 
    />
    <Table dataSource={data} columns={columns} /> 
   
  </>);
};

export default IPList;