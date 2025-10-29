<?php

namespace App\Logging;

use Illuminate\Log\Logger as IlluminateLogger;
use Monolog\Formatter\JsonFormatter;

class JsonFormatterTap
{
    public function __invoke(IlluminateLogger $logger)
    {
        foreach ($logger->getLogger()->getHandlers() as $handler) {
            $handler->setFormatter(new JsonFormatter());
        }
    }
}

