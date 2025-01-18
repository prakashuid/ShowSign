import { list } from "@vercel/blob";

const MY_BLOB_TOKEN = process.env.BLOB_READ_WRITE_TOKEN; // **REPLACE "YOUR_ACTUAL_TOKEN"**

export async function GET(request) {
    try {
        const { blobs } = await list({ token: MY_BLOB_TOKEN });
        return new Response(JSON.stringify(blobs), {
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error("Error listing blobs:", error);
        return new Response(`Error: ${error.message}`, { status: 500 });
    }
}