import * as pdfjsLib from 'pdfjs-dist';

// Use bundled worker via CDN fallback or disable worker for reliable cross-browser extraction
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

export interface ExtractedTopicChunk {
  unitName: string;
  topicName: string;
  pageStart: number;
  pageEnd: number;
  chunks: Array<{ content: string; pageNumber: number }>;
}

const HEADING_REGEX =
  /^(?:§\s*\d+|BÖLMƏ\s+\d+|FƏSİL\s+\d+|MÖVZU\s+\d+|\d+\.\d+\.?\s+[A-ZƏÜÖĞÇŞI])/i;

function splitIntoChunks(text: string, maxLen = 1500): string[] {
  const cleaned = text.replace(/\s+/g, ' ').trim();
  if (!cleaned) return [];
  const result: string[] = [];
  for (let i = 0; i < cleaned.length; i += maxLen) {
    result.push(cleaned.slice(i, i + maxLen));
  }
  return result;
}

/**
 * Extracts text page-by-page from a PDF File and groups into topics & chunks.
 */
export async function extractPdfTopicsAndChunks(
  file: File,
  maxPages = 250
): Promise<{ pageCount: number; topics: ExtractedTopicChunk[] }> {
  const buffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;
  const totalPages = Math.min(pdf.numPages, maxPages);

  const topics: ExtractedTopicChunk[] = [];
  let currentUnit = 'Ümumi bölmə';
  let currentTopic: ExtractedTopicChunk = {
    unitName: currentUnit,
    topicName: 'Giriş və Əsas Mövzular',
    pageStart: 1,
    pageEnd: 1,
    chunks: [],
  };

  for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const textContent = await page.getTextContent();
    const lines: string[] = [];

    for (const item of textContent.items) {
      if ('str' in item && item.str.trim()) {
        lines.push(item.str.trim());
      }
    }

    const pageText = lines.join(' ');
    if (!pageText) continue;

    // Detect chapter/topic headings on the page
    for (const line of lines) {
      if (line.length > 6 && line.length < 110 && HEADING_REGEX.test(line)) {
        if (/^(?:BÖLMƏ|FƏSİL)/i.test(line)) {
          currentUnit = line;
        } else {
          if (currentTopic.chunks.length > 0) {
            topics.push(currentTopic);
          }
          currentTopic = {
            unitName: currentUnit,
            topicName: line,
            pageStart: pageNum,
            pageEnd: pageNum,
            chunks: [],
          };
        }
      }
    }

    currentTopic.pageEnd = pageNum;
    for (const chunkText of splitIntoChunks(pageText)) {
      currentTopic.chunks.push({ content: chunkText, pageNumber: pageNum });
    }
  }

  if (currentTopic.chunks.length > 0) {
    topics.push(currentTopic);
  }

  return { pageCount: pdf.numPages, topics };
}
