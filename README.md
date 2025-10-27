⚙️ Setup Steps

Follow the steps below to set up the system:

🧩 1. Run Database Migration
php artisan migrate

🌱 2. Seed the Database
php artisan db:seed

🌐 3. Generate JSON Language Files

Convert PHP language files into JSON format for frontend use.

php artisan lang:json

🔐 4. Sync Permissions from Routes

Automatically sync route-based permissions into the permissions table.

php artisan permissions:sync-from-routes

👤 Default Login Credentials

You can now log in using the default superuser account:

Email:    superuser@demo.com  
Password: 12345678

🚀 5. Start the Application
🖥️ For Backend (Laravel)

Run the Laravel development server:

php artisan serve

💻 For Frontend (React + Vite)

In a separate terminal, start the frontend development server:

npm install
npm run dev
