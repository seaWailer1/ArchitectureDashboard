import { Button, Result } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      minHeight: '100vh',
      padding: '20px'
    }}>
      <Result
        status="404"
        title="404"
        subTitle="Sorry, the page you visited does not exist."
        extra={
          <Link href="/">
            <Button type="primary" icon={<HomeOutlined />}>
              Back Home
            </Button>
          </Link>
        }
      />
    </div>
  );
}