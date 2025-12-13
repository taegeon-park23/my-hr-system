import { client } from './client';

export const fetcher = async (url: string) => {
    const response = await client.get(url);
    // Assuming Standard Envelope: { status: "SUCCESS", data: ... }
    return response.data.data;
};
