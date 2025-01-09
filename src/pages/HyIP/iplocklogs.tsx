import React, { useEffect, useState } from 'react';
import ProTable, { ProColumns } from '@ant-design/pro-table';
import moment from 'moment';

interface IPLockLogData {
  id: number;
  site_id: string;
  ip_address: string;
  note: string;
  lock_date: string;
  insert_muser_id: number;
  insert_date: string;
  update_muser_id: number;
  update_date: string;
}

const IPLockLogs: React.FC = () => {
  const [data, setData] = useState<IPLockLogData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
 
  const fetchData = async (page: number, pageSize: number) => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:8972/api/hyipcontroller/getIPLockLogs?page=${page}&pageSize=${pageSize}`);
      const result = await response.json();
      setData(result.data);
      setPagination({ ...pagination, total: result.total });
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(pagination.current, pagination.pageSize);
  }, [pagination.current, pagination.pageSize]);

  const handleTableChange = (pagination: any) => {
    setPagination(pagination);
  };

  const columns: ProColumns<IPLockLogData>[] = [
    {
        title: "#",
        dataIndex: "seq",
        hideInSearch: true,
        hideInForm: true,
        width: 50,
        render: (text, record, index) => {
          return index + 1;
        },
    }, 
    {
      title: 'Site ID',
      dataIndex: 'site_id',
      key: 'site_id',
    },
    {
      title: 'IP Address',
      dataIndex: 'ip_address',
      key: 'ip_address',
    },
    {
        title: '狀態',
        dataIndex: 'ip_status',
        key: 'ip_status',
        render: (_, record: any) => {  
            let formattedDate = ""; 
            if (record.lock_date) { 
                let dateObj = new Date(record.lock_date.replace("T", " ").replace("Z","")); // 将日期字符串转换为日期对象
                formattedDate = moment(dateObj).format("YYYY/MM/DD HH:mm:ss");
            }
            let status = "";
            if (record.ip_status === -1) {
              status = "手動解除";
            } else if (record.ip_status === 1|| new Date(formattedDate) > new Date() ) {
              status = "鎖定中";
            } else {
              status = "已解除";
            }
            return <>{status}</>;
        },
    },
    {
      title: '鎖定日期迄日',
      dataIndex: 'lock_date',
      key: 'lock_date',
      render: (_, record: any) => {  
        let formattedDate = record.lock_date; 
        if (record.lock_date) { 
            let dateObj = new Date(record.lock_date.replace("T", " ").replace("Z","")); // 将日期字符串转换为日期对象
            formattedDate = moment(dateObj).format("YYYY/MM/DD HH:mm:ss");
        } 
        return <>{formattedDate}</>;
      },
    },  
    {
      title: '日期',
      dataIndex: 'update_date',
      key: 'update_date',
      render: (_, record: any) => {  
        let formattedDate = record.update_date; 
        if (record.update_date) { 
            let dateObj = new Date(record.update_date.replace("T", " ").replace("Z","")); // 将日期字符串转换为日期对象
            formattedDate = moment(dateObj).format("YYYY/MM/DD HH:mm:ss");
        } 
        return <>{formattedDate}</>;
      },
    },
    {
      title: '說明',
      dataIndex: 'note',
      key: 'note',
    },
  ];

  return (
    <ProTable<IPLockLogData>
      columns={columns}
      dataSource={data}
      rowKey="id"
      pagination={{
        current: pagination.current,
        pageSize: pagination.pageSize,
        total: pagination.total,
        onChange: (page, pageSize) => handleTableChange({ current: page, pageSize }),
      }}
      loading={loading}
      search={false}
      options={false}
    />
  );
};

export default IPLockLogs;