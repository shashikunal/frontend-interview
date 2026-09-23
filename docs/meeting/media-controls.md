# Phase 16 — Media Controls & Track Management

## 1. Overview

The media controls architecture governs local input/output media hardware (Microphone, Camera, Screen Share) while maintaining strict synchronization between actual browser `MediaStreamTrack` states and control plane announcements.

---

## 2. Audio (Microphone) Controls

### 2.1 State Synchronization
- **Strict Media Parity**: Frontend UI never reports "Muted" if the underlying `MediaStreamTrack.enabled === true`.
- **Mute Action**: Sets `audioTrack.enabled = false` and pauses SFU producer via `webrtcService.pauseProducer('audio')`.
- **Unmute Action**: Sets `audioTrack.enabled = true` and resumes SFU producer via `webrtcService.resumeProducer('audio')`.
- **Control Plane Notification**: Emits `meeting:participant:state` with `micState: 'active' | 'muted'`.

### 2.2 Remote Mute Security Limitation
- In accordance with WebRTC & browser security standards (W3C Media Capture and Streams), a remote party (even a Host) **CANNOT** remotely unmute or enable a participant's microphone without their physical consent.
- When a Host requests a mute:
  1. Server verifies host credentials.
  2. Server delivers targeted instruction `meeting:host:mute-participant`.
  3. Client mutes local track and displays banner: *"You were muted by the host"*.
  4. The participant must explicitly unmute themselves when ready.

---

## 3. Video (Camera) Controls

### 3.1 Device Acquisition & Toggling
- **Camera Off**: Stops or disables video track, pauses/closes producer, and broadcasts `cameraState: 'off'`.
- **Camera On**: Requests `navigator.mediaDevices.getUserMedia({ video: { deviceId } })`, attaches stream to local tile, resumes producer, and broadcasts `cameraState: 'active'`.
- **Hot Replacement**: Switching camera hardware during an active call invokes `track.stop()`, acquires the new track, and performs `producer.replaceTrack({ track: newTrack })` without tearing down the WebRTC PeerConnection.

### 3.2 Hardware Failure Resilience
- If camera hardware disconnects or throws `NotReadableError` / `AbortError`:
  1. The meeting audio session remains completely uninterrupted.
  2. The video tile falls back to the user's avatar initials with an alert indicator.
  3. The client broadcasts `cameraState: 'off'`.

---

## 4. Screen Sharing Architecture

### 4.1 Track Capture & Publishing
- Initiated via `navigator.mediaDevices.getDisplayMedia({ video: true, audio: true })`.
- Handled as a dedicated `screenShareProducer` separate from the camera producer.
- Automatic cleanup on native browser stop:
  ```typescript
  screenTrack.onended = () => {
    stopScreenShare();
  };
  ```

### 4.2 Security Constraints
- **Authentication**: Only validated participants with active meeting tokens can publish screen tracks.
- **Cross-Meeting Protection**: Media router is strictly keyed to the validated `meetingId`.
- **Session Termination**: Navigating away, token expiry, or meeting termination immediately calls `track.stop()` and closes the SFU screen producer.

---

## 5. Keyboard Shortcuts
To maximize accessibility and power-user ergonomics:
- **Ctrl+D / Cmd+D**: Toggle Microphone
- **Ctrl+E / Cmd+E**: Toggle Camera
- **Alt+H**: Toggle Raise / Lower Hand
