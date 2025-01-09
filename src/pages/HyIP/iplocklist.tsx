import React, { useEffect, useState } from 'react';
import { Table ,Button} from 'antd';
import { IPMapShow } from '@/components/HyIP';

interface LockIPData {
  key: string;
  ip: string;
  lock: boolean;
  lock_counter: number;
  lock_etime: string;
  lock_stime: string;
  site_id: string;
}

const IPLockList: React.FC = () => {
  const [data, setData] = useState<LockIPData[]>([]);
  const [showModalVisible, handleShowModalVisible] = useState<boolean>(
    false
  ); 
  const [ip, setIP] = useState<string>(""); 
  useEffect(() => {
    // 取資料API
    fetch("http://localhost:8972/api/hyipcontroller/getLockIP")
      .then((response) => response.json())
      .then((data) => {
        const lockIPData = Object.keys(data).map((key) => {
          const item = JSON.parse(data[key]);
          return {
            key,
            ip: item.ip,
            lock: item.lock,
            lock_counter: item.lock_counter,
            lock_etime: item.lock_etime,
            lock_stime: item.lock_stime,
            site_id: item.site_id,
          };
        });
        setData(lockIPData);
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
      title: 'Lock Time',
      dataIndex: 'lock_etime',
      key: 'lock_etime',
    },
    {
        title: 'IP Map',
        key: 'action',
        render: (text: any, record: LockIPData) => (
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

export default IPLockList;