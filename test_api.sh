#!/bin/bash

API="http://localhost:3000/incidents"
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

echo "Clearing incidents table..."
PGPASSWORD='active911password' psql -h localhost -U active911user1 -d incident_db -c "DELETE FROM incidents;"

test_case() {
  description="$1"
  method="$2"
  url="$3"
  data="$4"
  expected_code="$5"

  echo -e " ${description}"
  if [[ "$method" == "GET" || "$method" == "DELETE" ]]; then
    http_code=$(curl -s -o /dev/null -w "%{http_code}" -X "$method" "$url")
  else
    http_code=$(curl -s -o /dev/null -w "%{http_code}" -X "$method" "$url" \
      -H "Content-Type: application/json" \
      -d "$data")
  fi

  if [[ "$http_code" == "$expected_code" ]]; then
    echo -e "${GREEN}✔ Passed ($http_code)${NC}"
  else
    echo -e "${RED}✖ Failed (expected $expected_code, got $http_code)${NC}"
  fi
  echo
}

# ---------- TEST CASES BEGIN ----------

# Valid POSTs
test_case "POST valid incident (EMS)" POST "$API" '{"type":"ems","location":"Location 1","description":"Desc 1","timestamp":"2025-05-02T00:00:00Z"}' 201
test_case "POST valid incident (fire)" POST "$API" '{"type":"fire","location":"Location 2","description":"Desc 2","timestamp":"2021-08-22T14:30:00Z"}' 201

# Invalid POSTs
test_case "POST missing type" POST "$API" '{"location":"Loc","description":"Desc","timestamp":"2025-05-02T00:00:00Z"}' 400
test_case "POST invalid type value" POST "$API" '{"type":"alien","location":"Loc","description":"Desc","timestamp":"2025-05-02T00:00:00Z"}' 400

# GET all
test_case "GET all incidents" GET "$API" "" 200

incident_ids=($(curl -s http://localhost:3000/incidents | jq '.[].id'))

# Use the first 2 valid IDs for GET/PUT/DELETE
id1="${incident_ids[0]}"
id2="${incident_ids[1]}"

# GET by ID
test_case "GET incident by ID $id1" GET "$API/$id1" "" 200
test_case "GET non-existent incident" GET "$API/99999" "" 404

# PUT valid
test_case "PUT valid update to ID $id2" PUT "$API/$id2" '{"type":"police","location":"New Loc","description":"Updated","timestamp":"2025-05-02T00:00:00Z"}' 200

# PUT invalid
test_case "PUT missing type" PUT "$API/1" '{"location":"X","description":"Y","timestamp":"2025-05-02T00:00:00Z"}' 400

# DELETE existing
test_case "DELETE incident ID $id2" DELETE "$API/$id2" "" 200

# DELETE non-existent
test_case "DELETE non-existent incident" DELETE "$API/123123" "" 404

# Filters
test_case "GET filtered by type=fire" GET "$API?type=fire" "" 200
test_case "GET filtered by before date" GET "$API?before=2022-01-01T00:00:00Z" "" 200
test_case "GET filtered by after date" GET "$API?after=2022-01-01T00:00:00Z" "" 200
test_case "GET filtered by type+after+before" GET "$API?type=ems&after=2010-01-01T00:00:00Z&before=2026-01-01T00:00:00Z" "" 200

# ---------- TEST CASES END ----------

