<?php

namespace App\Observers;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;

class GlobalActivityLogger
{
    public function created(Model $model)
    {
        $this->logActivity('created', $model);
    }

    public function updated(Model $model)
    {
        $this->logActivity('updated', $model, $model->getChanges());
    }

    public function deleted(Model $model)
    {
        $this->logActivity('deleted', $model);
    }

    protected function logActivity(string $action, Model $model, array $properties = [])
    {
        // Skip logging for the activity_log table itself
        if ($model->getTable() === 'activity_log') {
            return;
        }

        // Mimic logOnlyDirty() + dontSubmitEmptyLogs()
        if ($action === 'updated') {
            $changes = $model->getDirty();
            if (empty($changes)) return;

            $properties = [
                'old' => collect($model->getOriginal())->only(array_keys($changes)),
                'attributes' => $changes,
            ];
        }

        activity('global')
            ->causedBy(Auth::user())
            ->event($action)
            ->performedOn($model)
            ->withProperties($properties)
            ->log("{$action} " . class_basename($model));
    }
 
}
