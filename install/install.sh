#!/bin/bash

# sysinfo_page - A script to install the application
#
#SCHEMA_UI_PATH="./frontend/schemaUI"
#SCHEMA_CMS_PATH="./frontend/schemaCMS"
#
#echo "Installing SchemaUI"
#yarn --cwd $SCHEMA_UI_PATH
#yarn --cwd $SCHEMA_UI_PATH build
#yarn --cwd $SCHEMA_UI_PATH link
#
#echo "Installing Schema CMS"
#yarn --cwd $SCHEMA_CMS_PATH
#yarn --cwd $SCHEMA_CMS_PATH link schemaUI
#
#echo "Installing Backend"
#docker-compose build

#echo "Adding precommit scripts"
#echo "
#echo \"Running tests\"
#bash ./install/run_tests.sh
#" >> .git/hooks/pre-push

#!/bin/sh

chmod u+x install/run_tests.sh

echo "Configuring pre-commit hook..."

# make a symbolic link with the pre-commit hook
if [ ! -f ./git/hooks/pre-commit ]; then
  ln install/run_tests.sh .git/hooks/pre-commit
  echo "Done"
else
  cat <<EOF
A pre-commit hook exists already.
EOF
fi
