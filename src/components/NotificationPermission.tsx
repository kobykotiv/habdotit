import React, { useEffect, useState } from 'react';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { Button } from '../../components/ui/button';
import { notificationService } from '../services/notificationService';

export function NotificationPermission() {
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const checkPermission = async () => {
      if (!('Notification' in window)) return;
      
      const permission = notificationService.getPermissionStatus();
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
    <Alert className="my-4">
      <div className="flex items-center justify-between">
        <AlertDescription>
          Enable notifications to stay on track with your habits!
        </AlertDescription>
        <Button variant="outline" size="sm" onClick={handleEnable}>
          Enable Notifications
        </Button>
      </div>
    </Alert>
  );
}
