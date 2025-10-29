<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Baris Bahasa Validasi
    |--------------------------------------------------------------------------
    |
    | Baris bahasa berikut berisi pesan kesalahan default yang digunakan oleh
    | kelas validator. Beberapa aturan memiliki beberapa versi seperti aturan
    | ukuran. Silakan ubah pesan-pesan ini sesuai kebutuhan aplikasi Anda.
    |
    */

    'accepted' => 'Kolom :attribute harus diterima.',
    'accepted_if' => 'Kolom :attribute harus diterima ketika :other bernilai :value.',
    'active_url' => 'Kolom :attribute harus berupa URL yang valid.',
    'after' => 'Kolom :attribute harus berisi tanggal setelah :date.',
    'after_or_equal' => 'Kolom :attribute harus berisi tanggal setelah atau sama dengan :date.',
    'alpha' => 'Kolom :attribute hanya boleh berisi huruf.',
    'alpha_dash' => 'Kolom :attribute hanya boleh berisi huruf, angka, tanda hubung, dan garis bawah.',
    'alpha_num' => 'Kolom :attribute hanya boleh berisi huruf dan angka.',
    'array' => 'Kolom :attribute harus berupa array.',
    'ascii' => 'Kolom :attribute hanya boleh berisi karakter alfanumerik satu byte dan simbol.',
    'before' => 'Kolom :attribute harus berisi tanggal sebelum :date.',
    'before_or_equal' => 'Kolom :attribute harus berisi tanggal sebelum atau sama dengan :date.',
    'between' => [
        'array' => 'Kolom :attribute harus memiliki antara :min dan :max item.',
        'file' => 'Kolom :attribute harus berukuran antara :min dan :max kilobyte.',
        'numeric' => 'Kolom :attribute harus bernilai antara :min dan :max.',
        'string' => 'Kolom :attribute harus memiliki antara :min dan :max karakter.',
    ],
    'boolean' => 'Kolom :attribute harus bernilai benar atau salah.',
    'confirmed' => 'Konfirmasi :attribute tidak cocok.',
    'current_password' => 'Kata sandi salah.',
    'date' => 'Kolom :attribute harus berupa tanggal yang valid.',
    'date_equals' => 'Kolom :attribute harus berupa tanggal yang sama dengan :date.',
    'date_format' => 'Kolom :attribute tidak sesuai dengan format :format.',
    'decimal' => 'Kolom :attribute harus memiliki :decimal angka desimal.',
    'different' => 'Kolom :attribute dan :other harus berbeda.',
    'digits' => 'Kolom :attribute harus terdiri dari :digits digit.',
    'digits_between' => 'Kolom :attribute harus memiliki antara :min dan :max digit.',
    'dimensions' => 'Kolom :attribute memiliki dimensi gambar yang tidak valid.',
    'distinct' => 'Kolom :attribute memiliki nilai duplikat.',
    'email' => 'Kolom :attribute harus berupa alamat email yang valid.',
    'ends_with' => 'Kolom :attribute harus diakhiri dengan salah satu dari: :values.',
    'enum' => 'Pilihan :attribute tidak valid.',
    'exists' => 'Pilihan :attribute tidak valid.',
    'file' => 'Kolom :attribute harus berupa berkas.',
    'filled' => 'Kolom :attribute harus memiliki nilai.',
    'gt' => [
        'array' => 'Kolom :attribute harus memiliki lebih dari :value item.',
        'file' => 'Kolom :attribute harus lebih besar dari :value kilobyte.',
        'numeric' => 'Kolom :attribute harus lebih besar dari :value.',
        'string' => 'Kolom :attribute harus lebih panjang dari :value karakter.',
    ],
    'gte' => [
        'array' => 'Kolom :attribute harus memiliki minimal :value item.',
        'file' => 'Kolom :attribute harus lebih besar atau sama dengan :value kilobyte.',
        'numeric' => 'Kolom :attribute harus lebih besar atau sama dengan :value.',
        'string' => 'Kolom :attribute harus memiliki minimal :value karakter.',
    ],
    'image' => 'Kolom :attribute harus berupa gambar.',
    'in' => 'Pilihan :attribute tidak valid.',
    'in_array' => 'Kolom :attribute tidak terdapat dalam :other.',
    'integer' => 'Kolom :attribute harus berupa bilangan bulat.',
    'ip' => 'Kolom :attribute harus berupa alamat IP yang valid.',
    'ipv4' => 'Kolom :attribute harus berupa alamat IPv4 yang valid.',
    'ipv6' => 'Kolom :attribute harus berupa alamat IPv6 yang valid.',
    'json' => 'Kolom :attribute harus berupa JSON yang valid.',
    'lowercase' => 'Kolom :attribute harus huruf kecil.',
    'lt' => [
        'array' => 'Kolom :attribute harus memiliki kurang dari :value item.',
        'file' => 'Kolom :attribute harus lebih kecil dari :value kilobyte.',
        'numeric' => 'Kolom :attribute harus lebih kecil dari :value.',
        'string' => 'Kolom :attribute harus memiliki kurang dari :value karakter.',
    ],
    'lte' => [
        'array' => 'Kolom :attribute tidak boleh memiliki lebih dari :value item.',
        'file' => 'Kolom :attribute harus kurang dari atau sama dengan :value kilobyte.',
        'numeric' => 'Kolom :attribute harus kurang dari atau sama dengan :value.',
        'string' => 'Kolom :attribute harus memiliki maksimal :value karakter.',
    ],
    'max' => [
        'array' => 'Kolom :attribute tidak boleh memiliki lebih dari :max item.',
        'file' => 'Kolom :attribute tidak boleh lebih besar dari :max kilobyte.',
        'numeric' => 'Kolom :attribute tidak boleh lebih besar dari :max.',
        'string' => 'Kolom :attribute tidak boleh lebih dari :max karakter.',
    ],
    'mimes' => 'Kolom :attribute harus berupa berkas dengan tipe: :values.',
    'min' => [
        'array' => 'Kolom :attribute harus memiliki minimal :min item.',
        'file' => 'Kolom :attribute minimal berukuran :min kilobyte.',
        'numeric' => 'Kolom :attribute minimal bernilai :min.',
        'string' => 'Kolom :attribute minimal terdiri dari :min karakter.',
    ],
    'not_in' => 'Pilihan :attribute tidak valid.',
    'not_regex' => 'Format :attribute tidak valid.',
    'numeric' => 'Kolom :attribute harus berupa angka.',
    'password' => [
        'letters' => 'Kolom :attribute harus mengandung setidaknya satu huruf.',
        'mixed' => 'Kolom :attribute harus mengandung huruf besar dan huruf kecil.',
        'numbers' => 'Kolom :attribute harus mengandung setidaknya satu angka.',
        'symbols' => 'Kolom :attribute harus mengandung setidaknya satu simbol.',
        'uncompromised' => ':attribute yang diberikan ditemukan dalam kebocoran data. Gunakan yang lain.',
    ],
    'present' => 'Kolom :attribute harus ada.',
    'prohibited' => 'Kolom :attribute tidak diperbolehkan.',
    'regex' => 'Format kolom :attribute tidak valid.',
    'required' => 'Kolom :attribute wajib diisi.',
    'same' => 'Kolom :attribute harus sama dengan :other.',
    'size' => [
        'array' => 'Kolom :attribute harus berisi :size item.',
        'file' => 'Kolom :attribute harus berukuran :size kilobyte.',
        'numeric' => 'Kolom :attribute harus bernilai :size.',
        'string' => 'Kolom :attribute harus terdiri dari :size karakter.',
    ],
    'starts_with' => 'Kolom :attribute harus diawali dengan salah satu dari: :values.',
    'string' => 'Kolom :attribute harus berupa teks.',
    'timezone' => 'Kolom :attribute harus berupa zona waktu yang valid.',
    'unique' => ':attribute sudah digunakan.',
    'uploaded' => 'Gagal mengunggah :attribute.',
    'uppercase' => 'Kolom :attribute harus huruf besar.',
    'url' => 'Kolom :attribute harus berupa URL yang valid.',
    'uuid' => 'Kolom :attribute harus berupa UUID yang valid.',

    'max_quantity' => 'Jumlah maksimal tercapai.',

    /*
    |--------------------------------------------------------------------------
    | Pesan Validasi Kustom
    |--------------------------------------------------------------------------
    */
    'custom' => [
        'attribute-name' => [
            'rule-name' => 'pesan-khusus',
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Atribut Validasi Kustom
    |--------------------------------------------------------------------------
    |
    | Gunakan untuk mengganti nama atribut menjadi sesuatu yang lebih mudah dibaca.
    |
    */
    'attributes' => [],

];
