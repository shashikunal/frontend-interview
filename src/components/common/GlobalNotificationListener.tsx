import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { pushClientService } from '../../features/notifications/services/pushClientService';
import { io, type Socket } from 'socket.io-client';
import './GlobalNotificationListener.css';

export interface GlobalMeetingAlert {
  id?: string;
  meetingId: string;
  meetingTitle: string;
  meetingUrl: string;
  customMessage?: string;
  trainerName?: string;
  timestamp: string;
}

export const GlobalNotificationListener: React.FC = () => {
  const navigate = useNavigate();
  const [activeAlert, setActiveAlert] = useState<GlobalMeetingAlert | null>(null);
  const [isDismissed, setIsDismissed] = useState<boolean>(false);

  useEffect(() => {
    // 1. Initial check for active meeting alert
    pushClientService.getActiveMeetingNotification().then(alert => {
      if (alert) {
        const key = `dismissed_${alert.meetingId}_${alert.timestamp}`;
        if (!sessionStorage.getItem(key)) {
          setActiveAlert(alert);
        }
      }
    });

    // 2. BroadcastChannel listener across local browser tabs
    const unsubBroadcast = pushClientService.onNotificationReceived((data) => {
      const alert: GlobalMeetingAlert = {
        meetingId: data.meetingId,
        meetingTitle: data.meetingTitle || 'Live Interview Meeting',
        meetingUrl: data.url || data.meetingUrl || `/meet/${data.meetingId}`,
        customMessage: data.body || data.customMessage,
        timestamp: data.timestamp || new Date().toISOString(),
      };
      setActiveAlert(alert);
      setIsDismissed(false);
    });

    // 3. Socket.IO connection for instant real-time server push events
    let socket: Socket | null = null;
    try {
      const socketUrl = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5173';
      socket = io(socketUrl, {
        path: '/api/socket',
        transports: ['websocket', 'polling'],
        reconnection: true,
      });

      socket.on('notification:meeting-link', (data: any) => {
        if (data && (data.meetingId || data.meetingUrl)) {
          const alert: GlobalMeetingAlert = {
            meetingId: data.meetingId,
            meetingTitle: data.meetingTitle || 'Live Interview Session',
            meetingUrl: data.meetingUrl || `/meet/${data.meetingId}`,
            customMessage: data.customMessage || data.body || 'Your interviewer has started the live session.',
            timestamp: data.timestamp || new Date().toISOString(),
          };
          
          pushClientService.displayLocalNotification({
            title: `🟢 Live Meeting: ${alert.meetingTitle}`,
            body: alert.customMessage || 'Your interview room is now live. Click to join!',
            url: alert.meetingUrl,
            meetingId: alert.meetingId,
          });

          setActiveAlert(alert);
          setIsDismissed(false);
        }
      });
    } catch (_) {}

    return () => {
      unsubBroadcast();
      if (socket) socket.disconnect();
    };
  }, []);

  if (!activeAlert || isDismissed) return null;

  const handleJoin = () => {
    if (activeAlert.meetingUrl.startsWith('http')) {
      window.location.href = activeAlert.meetingUrl;
    } else {
      navigate(activeAlert.meetingUrl);
    }
    setIsDismissed(true);
  };

  const handleDismiss = () => {
    const key = `dismissed_${activeAlert.meetingId}_${activeAlert.timestamp}`;
    try {
      sessionStorage.setItem(key, 'true');
    } catch (_) {}
    setIsDismissed(true);
  };

  return (
    <div className="global-live-meeting-banner" role="alert" aria-live="assertive">
      <div className="global-banner-glass">
        <div className="global-banner-pulse-container">
          <span className="global-banner-pulse-dot"></span>
          <span className="global-banner-pulse-ring"></span>
        </div>

        <div className="global-banner-content">
          <div className="global-banner-badge">LIVE INTERVIEW SESSION</div>
          <h4 className="global-banner-title">{activeAlert.meetingTitle}</h4>
          <p className="global-banner-subtext">
            {activeAlert.customMessage || 'Your meeting room is open. Click below to enter the live interview.'}
          </p>
        </div>

        <div className="global-banner-actions">
          <button onClick={handleJoin} className="global-banner-join-btn">
            <span>Join Meeting Now</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
          <button onClick={handleDismiss} className="global-banner-close-btn" aria-label="Dismiss alert">
            ✕
          </button>
        </div>
      </div>
    </div>
  );
};
