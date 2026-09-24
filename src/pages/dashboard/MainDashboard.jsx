import React from 'react';
import { useAuth } from '../../context/useAuth';
import { ROLES } from '../../utils/constants';
import { FSEDashboard } from './FSEDashboard';
import { TeamLeaderDashboard } from './TeamLeaderDashboard';
import { WarehouseDashboard } from './WarehouseDashboard';
import { DispatchDashboard } from './DispatchDashboard';
import { AdminDashboard } from './AdminDashboard';

export const MainDashboard = () => {
  const { user } = useAuth();

  switch (user?.role) {
    case ROLES.FSE:
      return <FSEDashboard />;
    case ROLES.TEAM_LEADER:
      return <TeamLeaderDashboard />;
    case ROLES.WAREHOUSE:
      return <WarehouseDashboard />;
    case ROLES.DISPATCH:
      return <DispatchDashboard />;
    case ROLES.ADMIN:
      return <AdminDashboard />;
    default:
      return <div>Invalid Role</div>;
  }
};