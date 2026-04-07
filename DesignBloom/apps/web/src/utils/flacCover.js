const FLAC_SIGNATURE = "fLaC";
const FLAC_PICTURE_BLOCK_TYPE = 6;
const FLAC_RANGE_STEPS = [262144, 1048576, 4194304];
const decoder = new TextDecoder("utf-8");

function decodeString(bytes, start, length) {
  return decoder.decode(bytes.subarray(start, start + length));
}

function parsePictureBlock(blockBytes) {
  const view = new DataView(blockBytes.buffer, blockBytes.byteOffset, blockBytes.byteLength);
  let offset = 0;

  if (blockBytes.byteLength < 32) {
    return { status: "incomplete" };
  }

  offset += 4;
  const mimeLength = view.getUint32(offset);
  offset += 4;

  if (offset + mimeLength > blockBytes.byteLength) {
    return { status: "incomplete" };
  }

  const mimeType = decodeString(blockBytes, offset, mimeLength) || "image/jpeg";
  offset += mimeLength;

  const descriptionLength = view.getUint32(offset);
  offset += 4;

  if (offset + descriptionLength > blockBytes.byteLength) {
    return { status: "incomplete" };
  }

  offset += descriptionLength;

  if (offset + 20 > blockBytes.byteLength) {
    return { status: "incomplete" };
  }

  offset += 16;
  const imageDataLength = view.getUint32(offset);
  offset += 4;

  if (offset + imageDataLength > blockBytes.byteLength) {
    return { status: "incomplete" };
  }

  return {
    status: "ok",
    imageData: blockBytes.slice(offset, offset + imageDataLength),
    mimeType,
  };
}

function extractPictureFromFlac(bytes) {
  if (bytes.byteLength < 4) {
    return { status: "incomplete" };
  }

  if (decodeString(bytes, 0, 4) !== FLAC_SIGNATURE) {
    return { status: "unsupported" };
  }

  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  let offset = 4;

  while (offset + 4 <= bytes.byteLength) {
    const header = view.getUint8(offset);
    const isLastBlock = (header & 0x80) !== 0;
    const blockType = header & 0x7f;
    const blockLength =
      (view.getUint8(offset + 1) << 16) |
      (view.getUint8(offset + 2) << 8) |
      view.getUint8(offset + 3);

    offset += 4;

    if (offset + blockLength > bytes.byteLength) {
      return { status: "incomplete" };
    }

    if (blockType === FLAC_PICTURE_BLOCK_TYPE) {
      return parsePictureBlock(bytes.subarray(offset, offset + blockLength));
    }

    offset += blockLength;

    if (isLastBlock) {
      break;
    }
  }

  return { status: "missing" };
}

async function fetchFlacMetadataBytes(url, byteLimit, signal) {
  const response = await fetch(url, {
    headers: {
      Range: `bytes=0-${byteLimit - 1}`,
    },
    signal,
  });

  if (!response.ok && response.status !== 206) {
    throw new Error(`Failed to load FLAC metadata: ${response.status}`);
  }

  return new Uint8Array(await response.arrayBuffer());
}

export async function extractEmbeddedFlacCoverUrl(url, signal) {
  for (const byteLimit of FLAC_RANGE_STEPS) {
    const bytes = await fetchFlacMetadataBytes(url, byteLimit, signal);
    const result = extractPictureFromFlac(bytes);

    if (result.status === "ok") {
      return URL.createObjectURL(
        new Blob([result.imageData], {
          type: result.mimeType,
        }),
      );
    }

    if (result.status !== "incomplete") {
      return null;
    }
  }

  return null;
}
