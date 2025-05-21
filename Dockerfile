# Dockerfile đặt tại bida-manager/Dockerfile

# Dùng Node phiên bản nhẹ
FROM node:18-alpine

# Thư mục làm việc bên trong container
WORKDIR /app

# Copy package.json và package-lock.json để cài dependencies trước
COPY package.json package-lock.json ./

# Cài dependencies
RUN npm install

# Copy toàn bộ source code vào container
COPY . .

# Build Next.js app
RUN npm run build

# Expose port 3000 (Next.js mặc định)
EXPOSE 3000

# Chạy app ở mode production
CMD ["npm", "start"]
