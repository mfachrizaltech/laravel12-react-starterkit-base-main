<?php

namespace App\Logging;

use Monolog\Formatter\JsonFormatter;
use Monolog\Logger;

class CustomizeFormatter
{
    public function __invoke(Logger $logger)
    {
        foreach ($logger->getHandlers() as $handler) {
            $handler->setFormatter(new JsonFormatter());
        }
    }
}
