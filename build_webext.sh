#!/usr/bin/env sh
SD="$(cd "$(dirname "$0")" > /dev/null || exit 1; pwd)";
cd "$SD" || exit 1
tempdir=$(mktemp -d)
cd "$tempdir" || exit 1
cp -r "$SD"/chrome/* "$tempdir"
cp -r "$SD"/firefox-webext/* "$tempdir"
web-ext build -a /tmp
rm -r "$tempdir"