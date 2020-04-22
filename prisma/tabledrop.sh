#!/bin/bash
psql -h localhost -d prisma -U postgres -f drop.sql && \
psql -h localhost -d prisma -U postgres -f schema.sql
