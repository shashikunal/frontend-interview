# Phase 16 — Device Management & Failure Resilience

## 1. Overview

Enterprise meeting users require robust handling of audio and video peripherals, including USB headset plug/unplug events, Bluetooth switching, device permission denials, and hardware failures.

---

## 2. Device Enumeration & Selection

### 2.1 Hardware Discovery
- Devices are discovered using `navigator.mediaDevices.enumerateDevices()`.
- Filtered into:
  - `audioinput`: Microphones
  - `videoinput`: Webcams / capture cards
  - `audiooutput`: Speakers / headphones (supported in browsers supporting `HTMLMediaElement.setSinkId()`)

### 2.2 Permissions First
- Before device labels can be read, permission must be granted.
- The pre-join lobby or in-call settings dialog triggers a minimal `getUserMedia({ audio: true, video: true })` probe, labels are extracted, and tracks are closed immediately unless needed for preview.

---

## 3. Dynamic Hot-Plugging (`devicechange`)

The application attaches an active listener:
```typescript
navigator.mediaDevices.addEventListener('devicechange', async () => {
  const updatedDevices = await navigator.mediaDevices.enumerateDevices();
  refreshDeviceList(updatedDevices);
  verifyActiveDevices(updatedDevices);
});
```

### Hot-Unplug Handling:
1. **Active Microphone Unplugged**:
   - Browser fires `track.onended`.
   - Client automatically falls back to system `default` microphone.
   - User is informed via non-intrusive status badge.
2. **Active Webcam Unplugged**:
   - Browser fires `track.onended`.
   - Video is safely turned off (`cameraState: 'off'`).
   - Call audio remains 100% active and unaffected.
3. **Bluetooth Headset Disconnected**:
   - System automatically re-routes audio to speakers without terminating WebRTC PeerConnection.

---

## 4. Error Handling & Privacy
- **Permission Denied (`NotAllowedError`)**: Clear, actionable guidance explaining how to enable camera/microphone permissions in the browser address bar. Internal browser stack traces are never exposed to the user.
- **Device In Use (`NotReadableError`)**: Informs the user that another application (e.g. Teams, Zoom) is holding exclusive access to the webcam.
- **Zero Sensitive Storage**: Raw device hardware IDs (`deviceId`) are stored in component memory or local storage solely for device preference persistence, never uploaded to server databases.
