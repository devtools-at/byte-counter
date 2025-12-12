/**
 * Byte Counter
 * Count bytes in text
 *
 * Online tool: https://devtools.at/tools/byte-counter
 *
 * @packageDocumentation
 */

function countGraphemes(text: string): number {
  const segmenter = new Intl.Segmenter('en', { granularity: 'grapheme' });
  const segments = Array.from(segmenter.segment(text));
  return segments.length;
}

function getUtf8ByteLength(text: string): number {
  return new TextEncoder().encode(text).length;
}

function getUtf16ByteLength(text: string): number {
  let bytes = 0;
  for (let i = 0; i < text.length; i++) {
    const code = text.charCodeAt(i);
    // Surrogate pairs use 4 bytes in UTF-16, others use 2
    bytes += code >= 0xD800 && code <= 0xDFFF ? 4 : 2;
  }
  return bytes;
}

function getCharacterCategory(char: string): string {
  const code = char.codePointAt(0);
  if (!code) return 'Unknown';

  if (code <= 0x7F) return 'ASCII';
  if (code <= 0x7FF) return 'Latin Extended';
  if (code <= 0xFFFF) return 'BMP (Basic Multilingual Plane)';
  return 'Supplementary Plane (Emoji, etc.)';
}

function toHexDump(text: string, maxBytes: number = 256): string {
  const bytes = new TextEncoder().encode(text.slice(0, Math.floor(maxBytes / 4)));
  let hex = '';

  for (let i = 0; i < bytes.length; i += 16) {
    // Offset
    const offset = i.toString(16).padStart(8, '0');
    hex += offset + '  ';

    // Hex bytes
    const lineBytes = bytes.slice(i, i + 16);
    const hexBytes = Array.from(lineBytes)
      .map(b => b.toString(16).padStart(2, '0'))
      .join(' ');
    hex += hexBytes.padEnd(48, ' ') + '  ';

    // ASCII representation
    const ascii = Array.from(lineBytes)
      .map(b => (b >= 32 && b <= 126) ? String.fromCharCode(b) : '.')
      .join('');
    hex += ascii + '\n';
  }

  return hex.trim();
}

// Export for convenience
export default { encode, decode };
