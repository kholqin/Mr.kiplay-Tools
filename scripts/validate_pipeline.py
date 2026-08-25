from pathlib import Path
import json

root = Path(__file__).resolve().parents[1]
config = root / "core" / "pipeline" / "default.yaml"
example = root / "config" / "authorization.example.json"

text = config.read_text(encoding="utf-8")
required_fragments = [
    'version: "1"',
    'scope_enforcement: "strict"',
    'deny_if_scope_is_empty: true',
    'dry_run: true',
    'id: "nmap-discovery"',
    'id: "nuclei-baseline"',
    'depends_on:',
    'integration: "nmap"',
    'integration: "nuclei"',
    '"-no-interactsh"',
]
missing = [fragment for fragment in required_fragments if fragment not in text]
if missing:
    raise SystemExit(f"Missing pipeline requirements: {missing}")

if text.index('id: "nmap-discovery"') > text.index('id: "nuclei-baseline"'):
    raise SystemExit("Nmap stage must precede Nuclei stage")

manifest = json.loads(example.read_text(encoding="utf-8"))
for key in ("engagement_id", "authorized_by", "valid_from", "valid_until", "targets", "allowed_actions"):
    if key not in manifest:
        raise SystemExit(f"Missing authorization example field: {key}")

print("Pipeline configuration validation passed.")
