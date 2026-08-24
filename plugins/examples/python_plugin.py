from dataclasses import dataclass

@dataclass(frozen=True)
class ValidatedScope:
    workspace_id: int
    targets: list[str]
    mode: str
    rate_limit: int
    timeout_seconds: int


def plan(scope: ValidatedScope) -> dict:
    if scope.mode != "preview":
        raise ValueError("Contoh plugin hanya mendukung mode preview")
    return {
        "plugin": "example.headers-review",
        "actions": [f"Tinjau header secara aman: {target}" for target in scope.targets],
        "manualValidationRequired": True,
    }
