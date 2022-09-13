#!/bin/sh
set -e           # Stop on any error
npx sequelize-cli db:migrate  # Run migrations
npx sequelize-cli db:seed # Preload initial data
exec "$@" 