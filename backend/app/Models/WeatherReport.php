<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WeatherReport extends Model
{
    use HasFactory;

    const UPDATED_AT = null;

    protected $fillable = [
        'location',
        'data',
        'fetched_at',
    ];

    protected $casts = [
        'data' => 'array',
        'fetched_at' => 'datetime',
    ];
}
