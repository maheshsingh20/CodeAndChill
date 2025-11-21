import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, X, Smartphone, Monitor, Wifi, WifiOff } from 'lucide-react';
import { usePWA, isOnline, onNetworkChange } from '@/utils/pwa';
import { motion, AnimatePresence } from 'framer-motion';

interface PWAInstallPromptProps {
  className?: string;
}

export const PWAInstallPrompt: React.FC<PWAInstallPromptProps> = ({
  className = ''
}) => {
  const { canInstall, isInstalled, updateAvailable, installApp, updateApp } = usePWA();
  const [showPrompt, setShowPrompt] = React.useState(false);
  const [online, setOnline] = React.useState(isOnline());
  const [dismissed, setDismissed] = React.useState(false);

  // Show prompt when install becomes available
  React.useEffect(() => {
    if (canInstall && !dismissed && !isInstalled) {
      setShowPrompt(true);
    }
  }, [canInstall, dismissed, isInstalled]);

  // Listen for network changes
  React.useEffect(() => {
    const cleanup = onNetworkChange(setOnline);
    return cleanup;
  }, []);

  const handleInstall = async () => {
    const success = await installApp();
    if (success) {
      setShowPrompt(false);
    }
  };

  const handleUpdate = async () => {
    await updateApp();
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    setDismissed(true);
    // Remember dismissal for this session
    sessionStorage.setItem('pwa-prompt-dismissed', 'true');
  };

  // Check if previously dismissed
  React.useEffect(() => {
    const wasDismissed = sessionStorage.getItem('pwa-prompt-dismissed');
    if (wasDismissed) {
      setDismissed(true);
    }
  }, []);

  if (isInstalled && !updateAvailable) {
    return null;
  }

  return (
    <>
      {/* Install Prompt */}
      <AnimatePresence>
        {showPrompt && canInstall && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className={`fixed bottom-4 right-4 z-50 max-w-sm ${className}`}
          >
            <Card className="bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0 shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <Download className="h-5 w-5" />
                    <h4 className="font-semibold text-sm">Install App</h4>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleDismiss}
                    className="h-6 w-6 p-0 text-white hover:bg-white/20"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                
                <p className="text-xs opacity-90 mb-4">
                  Install Code & Chill for a better experience with offline access and notifications.
                </p>
                
                <div className="flex items-center space-x-2 mb-4">
                  <Badge variant="secondary" className="bg-white/20 text-white text-xs">
                    <Smartphone className="h-3 w-3 mr-1" />
                    Mobile Ready
                  </Badge>
                  <Badge variant="secondary" className="bg-white/20 text-white text-xs">
                    <Monitor className="h-3 w-3 mr-1" />
                    Desktop
                  </Badge>
                  <Badge variant="secondary" className="bg-white/20 text-white text-xs">
                    <WifiOff className="h-3 w-3 mr-1" />
                    Offline
                  </Badge>
                </div>
                
                <div className="flex space-x-2">
                  <Button
                    onClick={handleInstall}
                    size="sm"
                    className="flex-1 bg-white text-purple-600 hover:bg-gray-100"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Install
                  </Button>
                  <Button
                    onClick={handleDismiss}
                    variant="ghost"
                    size="sm"
                    className="text-white hover:bg-white/20"
                  >
                    Later
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Update Available Prompt */}
      <AnimatePresence>
        {updateAvailable && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50"
          >
            <Card className="bg-blue-600 text-white border-0 shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <Download className="h-5 w-5" />
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm">Update Available</h4>
                    <p className="text-xs opacity-90">
                      A new version of the app is ready to install.
                    </p>
                  </div>
                  <Button
                    onClick={handleUpdate}
                    size="sm"
                    className="bg-white text-blue-600 hover:bg-gray-100"
                  >
                    Update
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Network Status Indicator */}
      <div className="fixed bottom-4 left-4 z-40">
        <AnimatePresence>
          {!online && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <Badge variant="destructive" className="flex items-center space-x-1">
                <WifiOff className="h-3 w-3" />
                <span className="text-xs">Offline</span>
              </Badge>
            </motion.div>
          )}
        </AnimatePresence>
        
        <AnimatePresence>
          {online && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <Badge variant="secondary" className="flex items-center space-x-1 bg-green-100 text-green-800">
                <Wifi className="h-3 w-3" />
                <span className="text-xs">Online</span>
              </Badge>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default PWAInstallPrompt;