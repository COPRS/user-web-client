#! /bin/sh
if [ -z "$API_URL" ]
then
    echo "API_URL is unset";
else
    echo "API_URL is set to '$API_URL'";
    envsubst '$${API_URL}' < /usr/share/nginx/html/assets/config.templ.json > /usr/share/nginx/html/assets/config.json
fi

exec nginx -g 'daemon off;'
