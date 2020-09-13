import request from 'request-promise';

const UUID_SERVICE_ADDRESS = process.env.UUID_SERVICE_ADDRESS ?? 'localhost:6000'

export default async (count?: number): Promise<string[]> => {
  const {data} = await request.get(`http://${UUID_SERVICE_ADDRESS}${count ? `?count=${count}` : ''}`, {json: true});
  return data;
}
