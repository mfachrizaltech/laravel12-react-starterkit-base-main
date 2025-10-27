🚀 Features

Our system is designed to streamline development with automatic permissions, multi-language support, and React-integrated validation.
Below is a summary of what we support:

🔐 1. Role-Based Menu & Authentication

Full integration with Spatie Laravel Permission
.

Each user’s accessible menus and routes are automatically determined by their assigned roles and permissions.

Superuser roles can bypass all restrictions.

⚙️ 2. Automatic Permission Enforcement

Routes and actions are automatically protected based on permission settings.

Middleware dynamically checks user access to controllers, routes, and UI components.

🧭 3. Permission-Aware UI (React)

React components can automatically disable or hide buttons and UI actions based on user permissions.

Example: AuthButton will disable itself if the user lacks the required permission.

🪄 4. Auto Permission Sync Command

One-click permission synchronization from backend routes.

Run the command (via web.php or Artisan) to automatically update your permissions table based on route definitions.

🌐 5. Multi-Language Support

Manage translations in PHP array format, and convert them into JSON using a simple command.

Supports importing/exporting translations to make localization easier across multiple languages.

⚡ 6. Automatic CRUD Generation

Consistent structure for Controller, Service, and Repository layers.

Simplifies the creation of new modules by following a standard CRUD pattern.

🧩 7. React Form Validation (PHP Rules)

Form validations in React are automatically generated from Laravel’s PHP validation rules.

Ensures frontend and backend validations stay perfectly in sync.

📊 8. Dynamic Report Generator

Create custom reports dynamically from SQL queries.

Supports viewing and exporting reports (PDF/Excel) directly from the web UI.

Ideal for admin dashboards and analytical modules.


🧾 9. Logstash Logging Support

The system supports Logstash-compatible JSON logging, enabling seamless integration with 🧠 ELK (Elasticsearch, Logstash, Kibana) for centralized log management, analysis, and monitoring.

'logstash' => [
    'driver' => 'single',
    'path' => storage_path('logs/logstash.log'),
    'tap' => [App\Logging\JsonFormatterTap::class],
    'level' => 'info',
],


✨ Key Benefits:

📊 Structured JSON logs ready for ELK ingestion

🧠 Improved log analytics and search capabilities

🧩 Easy integration with existing monitoring pipelines


🛠️ Tech Stack

Backend: Laravel 12+, PHP 8.1+

Frontend: React + Inertia.js + TypeScript + PrimeReact

Permissions: Spatie Laravel Permission

Database: MySQL / PostgreSQL

Reports: Dynamic report engine with query builder
