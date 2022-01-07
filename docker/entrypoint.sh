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

if [ -z "$BASE_HREF" ]
then
    export BASE_HREF=${BASE_HREF:-/}
    echo "BASE_HREF is unset, set to default: " $BASE_HREF;
else
    echo "BASE_HREF is set to '$BASE_HREF'";
fi

envsubst '$${API_URL} $${MAP_BACKGROUNDS}' < /usr/share/nginx/html/assets/config.templ.json > /usr/share/nginx/html/assets/config.json

echo "BASE_HREF:" $BASE_HREF
envsubst '$${BASE_HREF}' < /usr/share/nginx/html/index.templ.html > /usr/share/nginx/html/index.html

exec nginx -g 'daemon off;'
