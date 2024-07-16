import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import Peer from "simple-peer";
import styled from "styled-components";
import { useParams } from "react-router-dom";
const socket = io.connect("http://localhost:8000");
const myPeer = new Peer(undefined, {
  host: "/",
  port: "3001",
});

const VideoContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
`;
const VideoElement = styled.video`
  width: 50%;
  height: 50%;
  object-fit: cover;
  border-radius: 50%;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5);
`;

const Room = () => {
  const roomId = useParams();
  const [stream, setStream] = useState(null);
  const [me, setMe] = useState("");
  const [call, setCall] = useState(null);
  const [error, setError] = useState();
  const [callAccepted, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const myVideo = useRef();

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({
        video: true,
        audio: true,
      })
      .then((currentStream) => {
        setStream(currentStream);
        myVideo.current.srcObject = currentStream;
      });
    socket.on("me", (id) => setMe(id));

    socket.on("calluser", ({ from, name: callerName, signal }) => {
      setCall({ isRecieved: true, from, name: callerName, signal });
    });

    // if (videoRef.current) {
    //   navigator.mediaDevices
    //     .getUserMedia({
    //       video: true,
    //       audio: true,
    //     })
    //     .then((stream) => {
    //       videoRef.current.srcObject = stream;
    //     })
    //     .catch((err) => {
    //       setError(err);
    //     });
    // socket.emit("join-room", roomId, 10);
    // socket.on("user-connected", (userId) => {
    //   console.warn(`inside user-connected ${userId}`);
    // });
    //}
  }, []);

  const answercall = () => {
    setCallAccepted(true);
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream,
    });
    peer.on("signal", (data) => {
      socket.emit("answercall", { signal: data, to: call.from });
    });
  };
  return (
    <div className="my-video-container">
      <video className="my-video" srcObject={stream} autoPlay muted></video>
      <audio className="my-audio" srcObject={stream} autoPlay muted></audio>
    </div>
  );
};

export default Room;

// import React, { useEffect, useRef, useState } from "react";

// import io from "socket.io-client";
// import Peer from "simple-peer";
// import styled from "styled-components";
// import { useParams } from "react-router-dom";

// const socket = require("socket.io-client")("http://localhost:8000");

// socket.on("connect_error", (err) => {
//   console.warn(`connect_error due to ${err.message}`);
// });
// const Container = styled.div`
//     padding: 20px;
//     display: flex;
//     height: 100vh;
//     width: 90%;
//     margin: auto;
//     flex-wrap: wrap;
// `;

// const StyledVideo = styled.video`
//     height: 40%;
//     width: 50%;
// `;

// const Video = (props) => {
//     const ref = useRef();

//     useEffect(() => {
//         props.peer.on("stream", stream => {
//             ref.current.srcObject = stream;
//         })
//     }, []);

//     return (
//         <StyledVideo playsInline autoPlay ref={ref} />
//     );
// }

// const videoConstraints = {
//     height: window.innerHeight / 2,
//     width: window.innerWidth / 2
// };

// const Room = (props) => {
//     const params = useParams;
//     const [peers, setPeers] = useState([]);
//     const socketRef = useRef();
//     const userVideo = useRef();
//     const peersRef = useRef([]);//array of peers
//     const roomID = params.roomID;

//     useEffect(() => {
//         socketRef.current = io.connect("/");
//         navigator.mediaDevices.getUserMedia({ video: videoConstraints, audio: true }).then(stream => {
//             userVideo.current.srcObject = stream;//seee your own video
//             socketRef.current.emit("join room", roomID);//emit event saying join room
//             socketRef.current.on("all users", users => {//getting all users array users
//                 const peers = [];//just joined has no peers
//                 users.forEach(userID => {//get user id from users
//                     const peer = createPeer(userID, socketRef.current.id, stream);//it takes user id of the person we are trying to ccreate peer for and send our is, setream
//                     peersRef.current.push({//arrays of peers
//                         peerID: userID,
//                         peer,
//                     })
//                     peers.push(peer);//used for rendering purposes
//                 })
//                 setPeers(peers);
//             })

//             socketRef.current.on("user joined", payload => {
//                 const peer = addPeer(payload.signal, payload.callerID, stream);
//                 peersRef.current.push({
//                     peerID: payload.callerID,
//                     peer,
//                 })

//                 setPeers(users => [...users, peer]);//setPeers(peers)
//             });

//             socketRef.current.on("receiving returned signal", payload => {
//                 // const item = peersRef.current.find(p => p.peerID === payload.id);
//                 // item.peer.signal(payload.signal);
//                 const item = peersRef.current.find(p => p.peerID === payload.id);
//                 if (item && item.peer) {
//                       item.peer.signal(payload.signal).catch(error => console.log(error));
//                 }
//             });
//         })
//     }, []);

//     function createPeer(userToSignal, callerID, stream) {
//         const peer = new Peer({
//             initiator: true,
//             trickle: false,
//             stream,
//         });

//         peer.on("signal", signal => {
//             socketRef.current.emit("sending signal", { userToSignal, callerID, signal })
//         })

//         return peer;
//     }

//     function addPeer(incomingSignal, callerID, stream) {
//         const peer = new Peer({
//             initiator: false,
//             trickle: false,
//             stream,
//         })

//         peer.on("signal", signal => {
//             socketRef.current.emit("returning signal", { signal, callerID })
//         })

//         peer.signal(incomingSignal);
//         return peer;
//     }

//     return (
//         <Container>
//             <StyledVideo muted ref={userVideo} autoPlay playsInline />
//             {peers.map((peer, index) => {
//                 return (
//                     <Video key={index} peer={peer} />
//                 );
//             })}
//         </Container>
//     );
// };

// export default Room;

// const params = useParams();
//     const [peers, setPeers] = useState([]);
//     const socketRef = useRef();
//     const userVideo = useRef();
//     const peersRef = useRef([]);
//     const roomID = params.roomID;

//     useEffect(() => {
//         socketRef.current = io.connect("/");
//         navigator.mediaDevices.getUserMedia({ video: videoConstraints, audio: true }).then(stream => {
//             userVideo.current.srcObject = stream;
//             socketRef.current.emit("join room", roomID);
//             socketRef.current.on("all users", users => {
//                 const peers = [];
//                 users.forEach(userID => {
//                     const peer = createPeer(userID, socketRef.current.id, stream);
//                     peersRef.current.push({
//                         peerID: userID,
//                         peer,
//                     })
//                     peers.push(peer);
//                 })
//                 setPeers(peers);
//             })

//             socketRef.current.on("user joined", payload => {
//                 const peer = addPeer(payload.signal, payload.callerID, stream);
//                 peersRef.current.push({
//                     peerID: payload.callerID,
//                     peer,
//                 })

//                 setPeers(users => [...users, peer]);
//             });

//             socketRef.current.on("receiving returned signal", payload => {
//                 const item = peersRef.current.find(p => p.peerID === payload.id);
//                 item.peer.signal(payload.signal);
//             });
//         })
//     }, []);

//     function createPeer(userToSignal, callerID, stream) {
//         const peer = new Peer({
//             initiator: true,
//             trickle: false,
//             stream,
//         });

//         peer.on("signal", signal => {
//             socketRef.current.emit("sending signal", { userToSignal, callerID, signal })
//         })

//         return peer;
//     }

//     function addPeer(incomingSignal, callerID, stream) {
//         const peer = new Peer({
//             initiator: false,
//             trickle: false,
//             stream,
//         })

//         peer.on("signal", signal => {
//             socketRef.current.emit("returning signal", { signal, callerID })
//         })

//         peer.signal(incomingSignal);

//         return peer;
//     }
