#!/bin/bash

rm -rf committer_name.properties committer_email.properties
touch committer_email.properties
touch committer_name.properties
echo GIT_COMMITTER_EMAIL=$(git --no-pager show -s --format=%ce) >> committer_email.properties
echo GIT_COMMITTER_NAME=$(git --no-pager show -s --format=%cn) >> committer_name.properties
