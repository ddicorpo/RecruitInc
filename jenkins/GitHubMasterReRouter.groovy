rm -rf committer_name.properties committer_email.properties
touch committer_email.properties
touch committer_name.properties
echo GIT_COMMITTER_EMAIL="release" >> committer_email.properties
echo GIT_COMMITTER_NAME="master" >> committer_name.properties

printenv