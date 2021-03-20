import { createContext, useEffect, useRef, useState } from 'react';
import Peer from 'simple-peer';
import io from 'socket.io-client';

export const CameraContext = createContext();
const socket = io.connect();
const CameraContextProvider = (props) => {
  const [auth, setAuth] = useState(true);
  const [endingCall, setEndingCall] = useState(false);
  const [error, setError] = useState(false);
  const [me, setMe] = useState();
  const [stream, setStream] = useState();
  const [receivingCall, setReceivingCall] = useState(false);
  const [caller, setCaller] = useState('');
  const [idToCall, setIdToCall] = useState('');
  const [callerSignal, setCallerSignal] = useState();
  const [calling, setCalling] = useState(false);
  const [callAccepted, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const [name, setName] = useState('');

  const myVideo = useRef();
  const userVideo = useRef();
  const connectionRef = useRef();

  const io = socket;

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
      console.log(`set caller signal`);
      setCaller(data.from);
      setName(data.name);
      setCallerSignal(data.signal);
      setReceivingCall(true);
    });
  }, []);

  const callUser = (id) => {
    console.log(`call user clicked`);
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
      console.log(`heard call accepted`);
      setCallAccepted(true);
      peer.signal(signal);
      setReceivingCall(false);
    });

    connectionRef.current = peer;
  };

  const answerCall = () => {
    console.log(`answerCall clicked`);
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
  const data = {
    //variables
    io,
    userVideo,

    //functions
    answerCall,
    leaveCall,
    cancelCall,
    callCancelled,
    callUser,

    //state
    stateAuth: [auth, setAuth],
    stateCallAccepted: [callAccepted, setCallAccepted],
    stateCallEnded: [callEnded, setCallEnded],
    stateCaller: [caller, setCaller],
    stateCallerSignal: [callerSignal, setCallerSignal],
    stateCalling: [calling, setCalling],
    stateEndingCall: [endingCall, setEndingCall],
    stateIdToCall: [idToCall, setIdToCall],
    stateMe: [me, setMe],
    stateName: [name, setName],
    stateStream: [stream, setStream],
    stateReceivingCall: [receivingCall, setReceivingCall],
    stateError: [error, setError],
    MyVideo,
    UserVideo,
  };
  return (
    <CameraContext.Provider value={data}>
      {props.children}
    </CameraContext.Provider>
  );
};
export default CameraContextProvider;
