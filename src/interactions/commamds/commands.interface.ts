export interface CommandService {
  execute(body: any): Promise<any>;
}
