import React, { useEffect, useState } from 'react';
import { NotificationService } from './services/notificationService';
// import React, { useEffect, useState } from 'react';
import { NotificationPermission } from './components/NotificationPermission';

// function App() {
//   // ...existing code...
  
//   useEffect(() => {
//     const notificationService = NotificationService.getInstance();
//     // Initialize notification service
//     notificationService.initialize();
//   }, []);

function App() {
    const [initialized, setInitialized] = useState(false);

    useEffect(() => {
        const bootstrapApp = async () => {
            // Initialize the notification service
            const notificationService = NotificationService.getInstance();
            const notificationsSupported = await notificationService.initialize();
            
            // Only register service worker if notifications are supported
            if (notificationsSupported && 'serviceWorker' in navigator) {
                try {
                    await navigator.serviceWorker.register('/sw.js');
                } catch (error) {
                    console.error('Service worker registration failed:', error);
                }
            }

            setInitialized(true);
        };

        bootstrapApp();
    }, []);

    if (!initialized) {
        return <div>Loading...</div>;
    }

    return (
        <div className="app-container">
            <NotificationPermission />
            <div>App Content</div>
        </div>
    );
}

// export default App;

  


export default App;