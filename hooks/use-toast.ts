import { message } from 'antd';
import type { MessageInstance } from 'antd/es/message/interface';

let messageApi: MessageInstance;

export const useToast = () => {
  const [api, contextHolder] = message.useMessage();
  messageApi = api;

  const toast = ({ title, description, variant = 'info' }: {
    title: string;
    description?: string;
    variant?: 'success' | 'error' | 'warning' | 'info';
  }) => {
    const content = description ? `${title}: ${description}` : title;
    
    switch (variant) {
      case 'success':
        api.success(content);
        break;
      case 'error':
        api.error(content);
        break;
      case 'warning':
        api.warning(content);
        break;
      default:
        api.info(content);
    }
  };

  return { toast, contextHolder };
};

// Global toast function for use without hook
export const toast = ({ title, description, variant = 'info' }: {
  title: string;
  description?: string;
  variant?: 'success' | 'error' | 'warning' | 'info';
}) => {
  const content = description ? `${title}: ${description}` : title;
  
  switch (variant) {
    case 'success':
      message.success(content);
      break;
    case 'error':
      message.error(content);
      break;
    case 'warning':
      message.warning(content);
      break;
    default:
      message.info(content);
  }
};