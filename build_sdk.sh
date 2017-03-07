#!/usr/bin/env sh
SD="$(cd "$(dirname "$0")" > /dev/null || exit 1; pwd)";
cd "$SD" || exit 1
tempdir=$(mktemp -d)
cd "$tempdir" || exit 1
cp -r "$SD"/firefox/* "$tempdir"
cp -r "$SD"/chrome/content/* "$SD"/chrome/lib/* "$tempdir/data"
cp -r "$SD"/firefox-webext/content/* "$tempdir/data"
cp -r "$SD"/chrome/popup.* "$SD"/chrome/oldvk-*.png "$tempdir/data"
jpm xpi
mv "$tempdir/oldvk.xpi" /tmp
rm -r "$tempdir"
echo "Extension copied to /tmp/oldvk.xpi"