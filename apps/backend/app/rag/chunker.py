from pathlib import Path
import re
import json

from langchain_text_splitters import MarkdownHeaderTextSplitter

HEADERS_TO_SPLIT_ON = [
    ("##", "mouse"),
    ("###", "topic"),
]

MOUSE_ID_PATTERN = re.compile(r"- `mouse_id`: `([^`]+)`")


def chunk_research_document(file_path: str):
    markdown = Path(file_path).read_text(encoding="utf-8")

    splitter = MarkdownHeaderTextSplitter(
        headers_to_split_on=HEADERS_TO_SPLIT_ON,
        strip_headers=False,
    )

    return splitter.split_text(markdown)


def is_mouse_chunk(chunk) -> bool:
    mouse = chunk.metadata.get("mouse", "")
    return mouse[:1].isdigit()



def normalize_mouse_name(mouse_heading: str) -> str:
    return re.sub(r"^\d+\.\s*", "", mouse_heading).strip()


def extract_mouse_id(content: str) -> str | None:
    match = MOUSE_ID_PATTERN.search(content)
    if match is None:
        return None

    return match.group(1)


def normalize_chunk(chunk, mouse_id: str | None) -> dict:
    mouse_heading = chunk.metadata.get("mouse", "")
    topic = chunk.metadata.get("topic", "Overview")

    return {
        "mouse_id": mouse_id,
        "mouse_name": normalize_mouse_name(mouse_heading),
        "topic": topic,
        "content": chunk.page_content,
    }


def build_research_chunks(file_path: str) -> list[dict]:
    chunks = chunk_research_document(file_path)
    mouse_chunks = [chunk for chunk in chunks if is_mouse_chunk(chunk)]

    normalized_chunks = []
    current_mouse_id = None

    for chunk in mouse_chunks:
        found_mouse_id = extract_mouse_id(chunk.page_content)

        if found_mouse_id is not None:
            current_mouse_id = found_mouse_id

        normalized_chunks.append(normalize_chunk(chunk, current_mouse_id))

    return normalized_chunks


def write_chunks_debug_file(chunks: list[dict], file_path: str) -> None:
    Path(file_path).write_text(
        json.dumps(chunks, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )


if __name__ == "__main__":
    normalized_chunks = build_research_chunks("app/data/research.md")

    write_chunks_debug_file(
        normalized_chunks,
        "app/data/debug_chunks.json",
    )

    print(f"Wrote {len(normalized_chunks)} chunks")