import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, User, LogOut, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useMobile } from '@/hooks/useMobile';
import { useProjectStorage } from '@/hooks/useProjectStorage';
import { ProfileModal } from './modals/ProfileModal';
import { SettingsModal } from './modals/SettingsModal';

interface DashboardHeaderProps {
  onMenuToggle?: () => void;
}

export function DashboardHeader({ onMenuToggle }: DashboardHeaderProps) {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const isMobile = useMobile();
  const { activeProject } = useProjectStorage();
  const [rippleSettings, setRippleSettings] = useState<{ x: number; y: number; show: boolean }>({ x: 0, y: 0, show: false });
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleRipple = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setRippleSettings({ x, y, show: true });
    setTimeout(() => setRippleSettings(prev => ({ ...prev, show: false })), 150);
  };

  return (
    <>
      <header
        className="fixed top-0 z-50 w-full flex items-center justify-between px-4 app-header"
        style={{
          height: '56px'
        }}
      >
        {/* Left Section - Logo */}
        <div className="flex items-center space-x-4">
          <motion.h1
            className="text-white font-bold"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            style={{
              fontSize: '20px',
              fontFamily: 'system-ui, -apple-system, "Roboto", sans-serif',
              fontWeight: 700
            }}
          >
            LifePilot
          </motion.h1>
        </div>



        {/* Right Section - Avatar Dropdown */}
        <div className="flex items-center space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-10 w-10 rounded-full p-0 hover:bg-white/10"
              >
                <Avatar className="h-10 w-10">
                  <AvatarImage src="" alt="User Avatar" />
                  <AvatarFallback className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                    {activeProject?.character?.role?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-56 bg-gray-900 border-gray-700 text-white"
              align="end"
              forceMount
            >
              {activeProject && (
                <>
                  <div className="flex items-center space-x-2 p-2">
                    <Crown className="h-4 w-4 text-yellow-400" />
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">{activeProject.character.role}</p>
                      <p className="text-xs text-gray-400">Level {activeProject.character.level}</p>
                    </div>
                  </div>
                  <DropdownMenuSeparator className="bg-gray-700" />
                </>
              )}
              <DropdownMenuItem 
                className="hover:bg-gray-800 cursor-pointer"
                onClick={() => setShowProfileModal(true)}
              >
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="hover:bg-gray-800 cursor-pointer"
                onClick={() => setShowSettingsModal(true)}
              >
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-gray-700" />
              <DropdownMenuItem onClick={handleLogout} className="hover:bg-gray-800 cursor-pointer text-red-400">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Profile Modal */}
      <ProfileModal 
        isOpen={showProfileModal} 
        onClose={() => setShowProfileModal(false)} 
      />

      {/* Settings Modal */}
      <SettingsModal 
        isOpen={showSettingsModal} 
        onClose={() => setShowSettingsModal(false)} 
      />
    </>
  );
}