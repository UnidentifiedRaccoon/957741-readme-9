export interface PrismaClientService {
  $connect(): Promise<void>;
  $disconnect(): Promise<void>;
}
