<?php

namespace App\Services;

use Illuminate\Support\Str;

final class LaravelMrkiplayAdapter
{
    public function describe(string $target): array
    {
        $target = trim($target);
        if ($target === '' || Str::length($target) > 253 || ! preg_match('/^[A-Za-z0-9.-]+$/', $target)) {
            return ['ok' => false, 'error' => 'target tidak valid atau bukan hostname publik'];
        }

        return [
            'ok' => true,
            'module' => 'laravel-adapter',
            'target' => $target,
            'mode' => 'policy-gated',
        ];
    }
}
