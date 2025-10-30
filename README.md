Follow the steps below to set up the system:

⚙️ Setup Steps

🧩 1. Run composer

            composer install

🟢 2. Install Node.js dependencies

            npm install

📄 3. Copy the environment file

            cp .env.example .env

Then open .env and adjust these values:

            APP_NAME="Laravel React Starter"
            APP_URL=http://localhost
            DB_DATABASE=your_database_name
            DB_USERNAME=your_database_user
            DB_PASSWORD=your_database_password

🟢 4. Generate application key

            php artisan key:generate


 🔴5. EDIT THE YAJRA 

Goto laravel12-react-starterkit-base-main\vendor\yajra\laravel-auditable\src
Open AuditableServiceProvider

        Blueprint::macro('auditable', function () {
            /** @var Blueprint $blueprint */
            $blueprint = $this;
            // Replace This
            $blueprint->unsignedBigInteger('created_by')->nullable()->index();
            $blueprint->unsignedBigInteger('updated_by')->nullable()->index();
            // With This
            $blueprint->String('created_by')->nullable()->index();
            $blueprint->String('updated_by')->nullable()->index();
        });


🧩 6. Run Database Migration 

            php artisan migrate

🌱 7. Seed the Database 

            php artisan db:seed

🌐 8. Generate JSON Language Files

Convert PHP language files into JSON format for frontend use.

            php artisan lang:json

🔐 9. Sync Permissions from Routes

Automatically sync route-based permissions into the permissions table.

            php artisan permissions:sync-from-routes

👤 Default Login Credentials

You can now log in using the default superuser account:

Email: [superuser@demo.com](mailto:superuser@demo.com)
Password: 12345678

🚀 5. Start the Application 🖥️ For Backend (Laravel)

Run the Laravel development server:

            php artisan serve

💻 For Frontend (React + Vite)

In a separate terminal, start the frontend development server:

            npm install npm run dev
