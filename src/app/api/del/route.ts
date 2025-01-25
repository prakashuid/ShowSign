import { NextRequest, NextResponse } from 'next/server';
import { list, del } from '@vercel/blob';

export async function POST(req: NextRequest) {
  // Read the token from environment variables
  const token = process.env.BLOB_READ_WRITE_TOKEN;

  if (!token) {
    return NextResponse.json(
      { error: 'BLOB_READ_WRITE_TOKEN is not set' },
      { status: 500 }
    );
  }

  try {
    let cursor: string | undefined;

    do {
      // Fetch the list of blobs
      const listResult = await list(
        {
          cursor,
          limit: 100,
          token: token
        },
      );

      if (listResult.blobs.length > 0) {
        // Delete the listed blobs
        await del(
          listResult.blobs.map((blob:any) => blob.url),
          {token: token }// Add the token in the headers for deletion
        );
      }

      cursor = listResult.cursor; // Move to the next set of blobs
    } while (cursor);

    return NextResponse.json(
      { message: 'All blobs were deleted successfully' },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error('Error deleting blobs:', error);
    return NextResponse.json(
      {
        error: 'Failed to delete blobs',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
