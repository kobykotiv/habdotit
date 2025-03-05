import React, { useEffect, useState } from 'react';
import { Button, Alert } from 'react-bootstrap';
import { notificationService } from '../services/notificationService';

export const NotificationPermission: React.FC = () => {
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const checkPermission = async () => {
      if (!('Notification' in window)) return;
      
      const permission = await notificationService.getPermissionStatus();
      setShowPrompt(permission === 'default');
    };

    checkPermission();
  }, []);

  const handleEnable = async () => {
    await notificationService.requestPermission();
    setShowPrompt(false);
  };

  if (!showPrompt) return null;

  return (
    <Alert variant="info" className="d-flex align-items-center justify-content-between m-3">
      <span>Enable notifications to stay on track with your habits!</span>
      <Button variant="outline-primary" size="sm" onClick={handleEnable}>
        Enable Notifications
      </Button>
    </Alert>
  );
};
