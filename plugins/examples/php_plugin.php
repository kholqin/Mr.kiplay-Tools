<?php
/** Adapter contract example: stdin hostname, stdout JSON. Host application owns authorization and network policy. */
$target = trim((string) fgets(STDIN));
$result = ["ok" => false, "module" => "php-adapter"];
if (preg_match('/^[A-Za-z0-9.-]{1,253}$/', $target) === 1) {
    $result["ok"] = true;
    $result["target"] = $target;
    $result["mode"] = "policy-gated";
} else {
    $result["error"] = "target tidak valid atau bukan hostname publik";
}
echo json_encode($result, JSON_UNESCAPED_SLASHES) . PHP_EOL;
