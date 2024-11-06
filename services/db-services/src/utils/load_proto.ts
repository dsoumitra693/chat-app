import { loadPackageDefinition } from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';

export const loadproto = (path: string) => {
  const PROTO_PATH = path;

  const packageDefinition = protoLoader.loadSync(PROTO_PATH);
  const proto = loadPackageDefinition(packageDefinition) as any;
  return proto;
};
