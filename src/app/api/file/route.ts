import { list } from "@vercel/blob";
import { revalidateTag } from 'next/cache';

const MY_BLOB_TOKEN = process.env.BLOB_READ_WRITE_TOKEN; // **REPLACE "YOUR_ACTUAL_TOKEN"**

export async function GET() {
    try {
        const { blobs } = await list({ token: MY_BLOB_TOKEN });
        return new Response(JSON.stringify(blobs), {
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0'
            },
        });
    } catch (error) {
        console.error("Error listing blobs:", error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return new Response(`Error: ${errorMessage}`, { status: 500 });
    }
}


export async function action() {
    revalidateTag('blobs');
  }