import Navbar from '@/components/Navbar';
import { NotificationPermission } from '../components/NotificationPermission';

const MainLayout = () => {
  return (
    <div className="main-layout">
      <Navbar />
      <NotificationPermission />
      {/* ...existing code... */}
    </div>
  );
};

export default MainLayout;
