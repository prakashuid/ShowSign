import { list } from "@vercel/blob";

const MY_BLOB_TOKEN = process.env.BLOB_READ_WRITE_TOKEN; // **REPLACE "YOUR_ACTUAL_TOKEN"**

export async function GET() {
    try {
        const { blobs } = await list({ token: MY_BLOB_TOKEN });
        const cacheControl = 'no-cache, no-store, must-revalidate';
        const headers = new Headers({
            'Content-Type': 'application/json',
            'Cache-Control': cacheControl,
            'Pragma': 'no-cache',
            'Expires': '0'
        });
        return new Response(JSON.stringify(blobs), {
            headers: headers,
        });
    } catch (error) {
        console.error("Error listing blobs:", error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return new Response(`Error: ${errorMessage}`, { status: 500 });
    }
}
