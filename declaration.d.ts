// MODULE.S[CA]SS
declare module '*.scss';
declare module '*.sass';

declare module "*.svg" {
  import React from 'react';
  import { SvgProps } from "react-native-svg";
  const content: React.FC<SvgProps>;
  export default content;
}

// In case I want to use react-native-tcp-stream

// declare module 'net' {
//   import TcpSockets from 'react-native-tcp-socket';
//   export = TcpSockets;
// }

// declare module 'tls' {
//   import TcpSockets from 'react-native-tcp-socket';
//   export const Server = TcpSockets.TLSServer;
//   export const TLSSocket = TcpSockets.TLSSocket;
//   export const connect = TcpSockets.connectTLS;
//   export const createServer = TcpSockets.createTLSServer;
// }