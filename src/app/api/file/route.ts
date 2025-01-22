
import { list } from "@vercel/blob";

const MY_BLOB_TOKEN = process.env.BLOB_READ_WRITE_TOKEN; // Replace with your actual token

export async function GET(req: Request) {
    try {
        const ifModifiedSince = req.headers.get("If-Modified-Since");
        const { blobs } = await list({ token: MY_BLOB_TOKEN });

        // Sort blobs by last modified date in descending order
        const sortedBlobs = blobs.sort((a:any, b:any) => new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime());
        const latestBlobModified = sortedBlobs[0]?.lastModified;

        // Check if the client has a cached version
        if (ifModifiedSince && new Date(ifModifiedSince).getTime() >= new Date(latestBlobModified).getTime()) {
            return new Response(null, { status: 304 }); // Not Modified
        }

        const cacheControl = "no-cache, no-store, must-revalidate";
        const headers = new Headers({
            "Content-Type": "application/json",
            "Cache-Control": cacheControl,
            "Pragma": "no-cache",
            "Expires": "0",
            "Last-Modified": latestBlobModified, // Include the latest modification timestamp
        });

        return new Response(JSON.stringify(sortedBlobs), { headers });
    } catch (error) {
        console.error("Error listing blobs:", error);
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        return new Response(`Error: ${errorMessage}`, { status: 500 });
    }
}
