"""Check downloadable CV text and render with Poppler to catch font incompatibility.

Requires Poppler (pdftotext and pdftoppm). Run from any directory.
"""
from pathlib import Path
import subprocess
import tempfile

ROOT = Path(__file__).resolve().parent.parent
EXPECTED = {
    "main_eng.pdf": (
        "Huawei",
        "July 2026 — Present",
        "Improving video-based visual-spatial question-answering using 3D scene graphs.",
    ),
    "main_rus.pdf": (
        "Huawei",
        "Июль 2026 — настоящее время",
        "Улучшение ответов на визуально-пространственные вопросы по видео "
        "с использованием графов 3D-сцен.",
    ),
}


def run_poppler(command):
    result = subprocess.run(command, check=True, capture_output=True, text=True)
    # Font warnings can accompany successful exit codes and corrupt rendering.
    if result.stderr.strip():
        raise RuntimeError(result.stderr.strip())
    return result.stdout


def main():
    with tempfile.TemporaryDirectory(prefix="cv-pdf-check-") as directory:
        for filename, expected in EXPECTED.items():
            path = ROOT / filename
            text = " ".join(run_poppler(["pdftotext", "-layout", str(path), "-"]).split())
            for phrase in expected:
                if phrase not in text:
                    raise ValueError(f"{filename}: missing or corrupted text: {phrase}")
            if "olymp" in text.lower() or "олимп" in text.lower():
                raise ValueError(f"{filename}: Olympiads section is still present")
            run_poppler([
                "pdftoppm", "-scale-to", "1600", "-png", str(path),
                str(Path(directory) / path.stem),
            ])
            print(f"{filename}: text verified, all pages rendered without warnings")


if __name__ == "__main__":
    main()
