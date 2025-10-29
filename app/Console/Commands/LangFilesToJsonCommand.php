<?php

declare(strict_types=1);

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Lang;

class LangFilesToJsonCommand extends Command
{
    protected $signature = 'lang:json';
    protected $description = 'Convert Laravel language files from PHP to JSON';

    public function handle(): void
    {
        $directories = File::directories(lang_path());
        foreach ($directories as $directory) {

            $result = [];
            $locale = basename($directory);
            $files = File::files($directory);
            $jsonPath = lang_path("{$locale}.json");

            foreach ($files as $file) {
                $fileName = $file->getFilenameWithoutExtension();
                $content = Lang::get($fileName, [], $locale);

                foreach ((array) $content as $key => $value) {
                    $response = $this->extract("{$fileName}.{$key}", $value);
                    $result = array_merge($result, $response);
                }
            }

            File::put($jsonPath, json_encode($result, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));

            $this->info("✅ JSON language file created: {$jsonPath}");
        }

        $this->info('🎉 Language files compiled to JSON successfully!');
    }

    private function extract(string $identifier, array|string $content): array
    {
        $list = [];

        if (is_array($content)) {
            foreach ($content as $key => $value) {
                $list = array_merge($list, $this->extract("{$identifier}.{$key}", $value));
            }
        } else {
            $list[$identifier] = $content;
        }

        return $list;
    }
}
