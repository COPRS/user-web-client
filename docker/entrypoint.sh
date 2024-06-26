#! /bin/sh
# Copyright 2023 Airbus
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

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

if [ -z "$KEYCLOAK" ]
then
    echo "KEYCLOAK is unset";
    return 1;
else
    echo "KEYCLOAK is set to '$KEYCLOAK'";
fi

if [ -z "$BASE_HREF" ]
then
    export BASE_HREF=${BASE_HREF:-/}
    echo "BASE_HREF is unset, set to default: " $BASE_HREF;
else
    echo "BASE_HREF is set to '$BASE_HREF'";
fi

if [ -z "$MAP_VIEW" ]
then
    echo "MAP_VIEW is unset";
    return 1;
else
    echo "MAP_VIEW is set to '$MAP_VIEW'";
fi

if [ -z "$FILTER_CONFIG" ]
then
    export FILTER_CONFIG=${FILTER_CONFIG:-[]}
    echo "FILTER_CONFIG is unset, set to default: " $FILTER_CONFIG;
else
    echo "FILTER_CONFIG is set to '$FILTER_CONFIG'";
fi

if [ -z "$ADDITIONAL_ATTRIBUTES" ]
then
    export ADDITIONAL_ATTRIBUTES=${ADDITIONAL_ATTRIBUTES:-[]}
    echo "ADDITIONAL_ATTRIBUTES is unset, set to default: " $ADDITIONAL_ATTRIBUTES;
else
    echo "ADDITIONAL_ATTRIBUTES is set to '$ADDITIONAL_ATTRIBUTES'";
fi

envsubst '$${API_URL} $${MAP_BACKGROUNDS} $${KEYCLOAK} $${MAP_VIEW} $${FILTER_CONFIG} $${ADDITIONAL_ATTRIBUTES}' < /usr/share/nginx/html/assets/config.templ.json > /usr/share/nginx/html/assets/config.json
envsubst '$${BASE_HREF}' < /usr/share/nginx/html/index.templ.html > /usr/share/nginx/html/index.html

exec nginx -g 'daemon off;'
