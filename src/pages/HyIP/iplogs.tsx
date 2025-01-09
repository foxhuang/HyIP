import React, { useEffect, useState } from 'react';
import ProTable, { ProColumns } from '@ant-design/pro-table';
import moment from 'moment';
interface IPLogData {
  id: number;
  site_id: string;
  ip_address: string;
  ip_status: number;
  insert_muser_id: number;
  insert_date: string;
  update_muser_id: number;
  update_date: string;
}

const IPLogs: React.FC = () => {
  const [data, setData] = useState<IPLogData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });

  const fetchData = async (page: number, pageSize: number) => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:8972/api/hyipcontroller/getIPLogs?page=${page}&pageSize=${pageSize}`);
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

  const columns: ProColumns<IPLogData>[] = [
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
  ];

  return (
    <ProTable<IPLogData>
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

export default IPLogs;