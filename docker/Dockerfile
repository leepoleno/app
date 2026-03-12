FROM nginx:alpine

# Удаляем дефолтный конфиг nginx
RUN rm /etc/nginx/conf.d/default.conf

# Копируем наш конфиг
COPY nginx/nginx.conf /etc/nginx/conf.d/

# Копируем все файлы приложения в правильное место
COPY frontend/src/ /usr/share/nginx/html/
COPY frontend/public/ /usr/share/nginx/html/

# Даем правильные права
RUN chmod -R 755 /usr/share/nginx/html

EXPOSE 80