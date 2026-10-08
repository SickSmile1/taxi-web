FROM httpd:alpine

RUN sed -i \
  's|#LoadModule headers_module|LoadModule headers_module|' \
  /usr/local/apache2/conf/httpd.conf \
  && sed -i \
  's|#LoadModule deflate_module|LoadModule deflate_module|' \
  /usr/local/apache2/conf/httpd.conf \
  && sed -i \
  's|#LoadModule expires_module|LoadModule expires_module|' \
  /usr/local/apache2/conf/httpd.conf \
  && sed -i \
  's|#LoadModule rewrite_module|LoadModule rewrite_module|' \
  /usr/local/apache2/conf/httpd.conf

RUN sed -i \
  '/<Directory "\/usr\/local\/apache2\/htdocs">/,/<\/Directory>/ s|AllowOverride None|AllowOverride All|' \
  /usr/local/apache2/conf/httpd.conf

COPY out/ /usr/local/apache2/htdocs/
