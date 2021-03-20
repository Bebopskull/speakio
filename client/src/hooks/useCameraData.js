import { useEffect, useRef, useState } from 'react';
import Peer from 'simple-peer';
import io from 'socket.io-client';

export default function useCameraData() {
  const socket = io.connect();
  const [me, setMe] = useState();
  const [stream, setStream] = useState();
  const [receivingCall, setReceivingCall] = useState(false);
  const [caller, setCaller] = useState('');
  const [idToCall, setIdToCall] = useState('');
  const [callerSignal, setCallerSignal] = useState();
  const [callAccepted, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const [name, setName] = useState('');
  const myVideo = useRef();
  const userVideo = useRef();
  const connectionRef = useRef();

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        setStream(stream);
        if (myVideo.current) {
          myVideo.current.srcObject = stream;
        }
      });

    socket.on('me', (id) => {
      setMe(id);
    });

    socket.on('hey', (data) => {
      setCaller(data.from);
      setName(data.name);
      setCallerSignal(data.signal);
      setReceivingCall(true);
    });
  }, []);

  const callUser = (id) => {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: stream,
    });
    peer.on('signal', (data) => {
      socket.emit('callUser', {
        userToCall: id,
        signalData: data,
        from: me,
        name: 'Teacher',
      });
    });
    peer.on('stream', (stream) => {
      if (userVideo.current) {
        userVideo.current.srcObject = stream;
      }
    });
    socket.on('callAccepted', (signal) => {
      setCallAccepted(true);
      peer.signal(signal);
      setReceivingCall(false);
    });

    connectionRef.current = peer;
  };

  const answerCall = () => {
    setCallAccepted(true);
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: stream,
    });
    peer.on('signal', (data) => {
      socket.emit('answerCall', { signal: data, to: caller });
    });
    peer.on('stream', (stream) => {
      userVideo.current.srcObject = stream;
    });
    callerSignal && peer.signal(callerSignal);

    connectionRef.current = peer;
  };

  const leaveCall = () => {
    setCallEnded(true);
    connectionRef.current.destroy();
  };
  const cancelCall = () => {
    setCallEnded(true);
  };

  const callCancelled = () => {
    setCallEnded(true);
    setReceivingCall(false);
  };

  let MyVideo;
  if (stream) {
    MyVideo = (
      <video
        playsInline
        muted
        ref={myVideo}
        autoPlay
        style={{ width: '300px' }}
      />
    );
  }

  let UserVideo;
  if (callAccepted) {
    UserVideo = (
      <video playsInline ref={userVideo} autoPlay style={{ width: '300px' }} />
    );
  }
  return {
    stream,
    callAccepted,
    callerSignal,
    setCallerSignal,
    setCallAccepted,
    callEnded,
    callCancelled,
    userVideo,
    name,
    setName,
    me,
    idToCall,
    setIdToCall,
    callUser,
    receivingCall,
    answerCall,
    cancelCall,
    leaveCall,
    MyVideo,
    UserVideo,
    socket,
  };
}
