import { execFile } from "node:child_process";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);
const MAX_EXTRACTED_TEXT_LENGTH = 24_000;

export async function extractPDFText(data: Uint8Array) {
  const directory = await mkdtemp(path.join(tmpdir(), "cv-review-"));
  const filePath = path.join(directory, "applicant-cv.pdf");

  try {
    await writeFile(filePath, data, { mode: 0o600 });
    const { stdout } = await execFileAsync(
      "pdftotext",
      ["-layout", filePath, "-"],
      { encoding: "utf8", maxBuffer: 2 * 1024 * 1024, timeout: 30_000 },
    );
    const text = stdout.replace(/\u0000/g, "").trim();
    if (text.length < 50) {
      throw new Error(
        "El PDF no contiene suficiente texto seleccionable para evaluarlo. Sube un PDF con texto o un documento exportado desde Word.",
      );
    }
    return text.slice(0, MAX_EXTRACTED_TEXT_LENGTH);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
}
