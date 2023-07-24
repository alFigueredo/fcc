#! /bin/bash

PSQL="psql --username=freecodecamp --dbname=salon -t --no-align -c"

echo -e "\n~~~~~ MY SALON ~~~~~\n"

SERVICE_MENU() {
  if [[ $1 ]]
  then
    echo -e "\n$1"
  else
    echo "Welcome to My Salon, how can I help you?"
  fi
  echo -e "\n1) cut\n2) color\n3) perm\n4) style\n5) trim"
  read SERVICE_ID_SELECTED
  SERVICE_ID=$($PSQL "SELECT service_id FROM services WHERE service_id='$SERVICE_ID_SELECTED'")
  if [[ -z $SERVICE_ID ]]
  then
    SERVICE_MENU "I could not find that service. What would you like today?"
  else
    SERVICE=$($PSQL "SELECT name FROM services WHERE service_id='$SERVICE_ID'")
    CUSTOMER_MENU
  fi
}

CUSTOMER_MENU() {
  echo "What's your phone number?"
  read CUSTOMER_PHONE
  CUSTOMER_ID=$($PSQL "SELECT customer_id FROM customers WHERE phone='$CUSTOMER_PHONE'")
  if [[ -z $CUSTOMER_ID ]]
  then
    echo "I don't have a record for that phone number, what's your name?"
    read CUSTOMER_NAME
    INSERT_CUSTOMER_RESULT=$($PSQL "INSERT INTO customers(phone, name) VALUES('$CUSTOMER_PHONE', '$CUSTOMER_NAME')")
    CUSTOMER_ID=$($PSQL "SELECT customer_id FROM customers WHERE phone='$CUSTOMER_PHONE'")
  else
    CUSTOMER_NAME=$($PSQL "SELECT name FROM customers WHERE customer_id='$CUSTOMER_ID'")
  fi
  APPOINTMENT_MENU
}

APPOINTMENT_MENU() {
  echo "What time would you like your cut, $CUSTOMER_NAME?"
  read SERVICE_TIME
  INSERT_APPOINTMENT_RESULT=$($PSQL "INSERT INTO appointments(customer_id, service_id, time) VALUES($CUSTOMER_ID, $SERVICE_ID, '$SERVICE_TIME')")
  echo "I have put you down for a $SERVICE at $SERVICE_TIME, $CUSTOMER_NAME."
}

SERVICE_MENU
