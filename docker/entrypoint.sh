#! /bin/sh
if [ -z "$RS_API_URL" ]
then
    echo "RS_API_URL is unset";
else
    echo "RS_API_URL is set to '$RS_API_URL'";
    envsubst '$${RS_API_URL}' < /usr/share/nginx/html/assets/config.templ.json > /usr/share/nginx/html/assets/config.json
fi

exec nginx -g 'daemon off;'
