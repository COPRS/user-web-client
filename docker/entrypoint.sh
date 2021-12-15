#! /bin/sh
if [ -z "$API_URL" ]
then
    echo "API_URL is unset";
    return 1;
else
    echo "API_URL is set to '$API_URL'";
fi

if [ -z "$MAP_BACKGROUNDS" ]
then
    echo "MAP_BACKGROUNDS is unset";
    return 1;
else
    echo "MAP_BACKGROUNDS is set to '$MAP_BACKGROUNDS'";
fi

envsubst '$${API_URL} $${MAP_BACKGROUNDS}' < /usr/share/nginx/html/assets/config.templ.json > /usr/share/nginx/html/assets/config.json

exec nginx -g 'daemon off;'
