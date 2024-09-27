# 1. Sử dụng image node chính thức từ Docker Hub với version 20
FROM node:20.16.0 AS build

# 2. Thiết lập thư mục làm việc bên trong container
WORKDIR /src

# environment variables
# ENV VITE_BACKEND_URL=https://6627c8e3b625bf088c09c759.mockapi.io/api/section/sectionManagment
# ENV VITE_ASP_BACKEND_URL=http://localhost:8001

# 3. Copy file package.json và package-lock.json để cài đặt dependencies
COPY package*.json ./

# 4. Cài đặt các dependencies cho dự án React
RUN npm install

# 5. Copy toàn bộ mã nguồn vào container
COPY . .


EXPOSE 3001


CMD ["npm", "start", "--", "--host"]

