# # Sử dụng hình ảnh PHP với Apache
# FROM php:8.2-apache

# # Cài đặt các tiện ích cần thiết
# RUN apt-get update && apt-get install -y \
#     libzip-dev \
#     unzip \
#     && docker-php-ext-install zip

# # Cài đặt Composer
# COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# # Thiết lập thư mục làm việc
# WORKDIR /var/www/html

# # Sao chép mã nguồn Laravel vào container
# COPY . .

# # Cài đặt các phụ thuộc của Laravel
# RUN composer install

# # Sao chép nội dung từ .env.example sang .env nếu chưa có
# RUN if [ ! -f .env ]; then cp .env.example .env; fi

# # Thiết lập quyền cho thư mục storage
# RUN chown -R www-data:www-data /var/www/html/storage

# CMD ["php", "artisan", "serve"]



# Sử dụng PHP với FPM (FastCGI Process Manager, thích hợp với Nginx)
FROM php:8.2-fpm

# Cài đặt các Tiện ích (Utilities)
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip

# Cài đặt các Extension PHP
RUN docker-php-ext-install pdo pdo_mysql

# Cài đặt Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Thiết lập thư mục làm việc
WORKDIR /var/www/html

# Sao chép mã nguồn Laravel vào container
COPY . .

# Cài đặt các phụ thuộc của Laravel
RUN composer install

# Sao chép .env.example vào .env nếu chưa có
RUN if [ ! -f .env ]; then cp .env.example .env; fi

# Thiết lập quyền cho thư mục storage và bootstrap/cache
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

# Khởi động PHP-FPM
CMD ["php-fpm"]
