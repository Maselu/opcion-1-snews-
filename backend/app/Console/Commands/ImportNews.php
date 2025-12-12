<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;
use App\Models\Article;
use App\Models\Category;
use Carbon\Carbon;

class ImportNews extends Command
{
    protected $signature = 'rss:import';
    protected $description = 'Import news from Google RSS feeds';

    public function handle()
    {
        $feeds = [
            'General' => 'https://news.google.com/rss?hl=es&gl=ES&ceid=ES:es',
            'Ciencia' => 'https://news.google.com/rss/search?q=ciencia+tecnología&hl=es&gl=ES&ceid=ES:es',
            'Deportes' => 'https://news.google.com/rss/search?q=deportes&hl=es&gl=ES&ceid=ES:es',
            'Entretenimiento' => 'https://news.google.com/rss/search?q=entretenimiento&hl=es&gl=ES&ceid=ES:es',
        ];

        foreach ($feeds as $categoryName => $url) {
            $this->info("Importing {$categoryName}...");

            $category = Category::firstOrCreate(['name' => $categoryName]);

            try {
                $response = Http::get($url);
                $xml = simplexml_load_string($response->body());

                if (!$xml) {
                    $this->error("Failed to parse XML for {$categoryName}");
                    continue;
                }

                $count = 0;
                foreach ($xml->channel->item as $item) {
                    if ($count >= 6)
                        break; // Límite de 6 artículos por categoría

                    $title = (string) $item->title;
                    $link = (string) $item->link;
                    $pubDate = (string) $item->pubDate;
                    $description = strip_tags((string) $item->description);
                    $source = (string) $item->source;

                    Article::updateOrCreate(
                        ['title' => $title], // Evite duplicados por título
                        [
                            'category_id' => $category->id,
                            'content' => $description, // La descripción RSS es breve, normalmente extraeríamos el contenido completo, pero esto es suficiente para la demostración.
                            'source' => $source ?: 'Google News',
                            'published_at' => Carbon::parse($pubDate),
                        ]
                    );

                    $count++;
                }

                $this->info("Imported articles for {$categoryName}");

            } catch (\Exception $e) {
                $this->error("Error importing {$categoryName}: " . $e->getMessage());
            }
        }

        $this->info('RSS Import completed.');
    }
}
