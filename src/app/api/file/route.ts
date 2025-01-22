import { list } from "@vercel/blob";

const MY_BLOB_TOKEN = process.env.BLOB_READ_WRITE_TOKEN; // Replace with your actual token

export async function GET(req:any) {
    try {
        // Extract the If-Modified-Since header from the request
        const ifModifiedSince = req.headers.get("If-Modified-Since");

        // Fetch the list of blobs using the provided token
        const { blobs } = await list({ token: MY_BLOB_TOKEN });

        // Sort the blobs by last modified date in descending order
        const sortedBlobs: any = blobs.sort((a:any, b:any) => 
            new Date(b.properties?.lastModified || 0).getTime() - new Date(a.properties?.lastModified || 0).getTime()
        );

        // Retrieve the most recently modified blob's timestamp
        const latestBlobModified: any = sortedBlobs[0]?.properties?.lastModified;

        // Check if the client's cached version is up to date
        if (ifModifiedSince && new Date(ifModifiedSince).getTime() >= new Date(latestBlobModified).getTime()) {
            return new Response(null, { status: 304 }); // Not Modified
        }

        // Set cache control headers to prevent caching
        const headers = new Headers({
            "Content-Type": "application/json",
            "Cache-Control": "no-cache, no-store, must-revalidate",
            "Pragma": "no-cache",
            "Expires": "0",
        });

        // Include the Last-Modified header if a blob exists
        if (latestBlobModified) {
            headers.set("Last-Modified", latestBlobModified);
        }

        // Return the sorted list of blobs as a JSON response
        return new Response(JSON.stringify(sortedBlobs), { headers });
    } catch (error) {
        // Log the error and return a 500 response with the error message
        console.error("Error listing blobs:", error);
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        return new Response(`Error: ${errorMessage}`, { status: 500 });
    }
}
