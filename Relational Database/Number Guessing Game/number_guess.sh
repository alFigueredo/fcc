#!/bin/bash

PSQL="psql --username=freecodecamp --dbname=number_guess -t --no-align -c"

echo "Enter your username:"
read USERNAME
if [[ ${#USERNAME} -gt 22 ]]
then
  echo "Your username is too long!"
  exit 0
fi
USER_ID=$($PSQL "SELECT user_id FROM score_table WHERE username='$USERNAME'")
if [[ -z $USER_ID ]]
then
  echo "Welcome, $USERNAME! It looks like this is your first time here."
else
  GAMES_PLAYED=$($PSQL "SELECT games_played FROM score_table WHERE user_id='$USER_ID'")
  BEST_GAME=$($PSQL "SELECT best_game FROM score_table WHERE user_id='$USER_ID'")
  echo "Welcome back, $USERNAME! You have played $GAMES_PLAYED games, and your best game took $BEST_GAME guesses."
fi
SECRET_NUMBER=$(( $RANDOM % 1000 + 1 ))
echo "Guess the secret number between 1 and 1000:"
read NUMBER
TRIES=1
while [[ $NUMBER -ne $SECRET_NUMBER ]]
do
  if ! [[ $NUMBER =~ [0-9]+ ]]
  then
    echo "That is not an integer, guess again:"
    read NUMBER
    continue
  fi
  if [[ $NUMBER -lt $SECRET_NUMBER ]]
  then
    echo "It's higher than that, guess again:"
    read NUMBER
  else
    echo "It's lower than that, guess again:"
    read NUMBER
  fi
  ((TRIES++))
done
echo "You guessed it in $TRIES tries. The secret number was $SECRET_NUMBER. Nice job!"
if [[ -z $USER_ID ]]
then
  RESULT_INSERT=$($PSQL "INSERT INTO score_table(username, games_played, best_game) VALUES ('$USERNAME', 1, $TRIES)")
else
  GAMES_PLAYED=$($PSQL "SELECT games_played FROM score_table WHERE user_id='$USER_ID'")
  BEST_GAME=$($PSQL "SELECT best_game FROM score_table WHERE user_id='$USER_ID'")
  RESULT_UPDATE_GAMES_PLAYED=$($PSQL "UPDATE score_table SET games_played=$(($GAMES_PLAYED+1)) WHERE user_id='$USER_ID'")
  if [[ $TRIES -lt $BEST_GAME ]]
  then
    RESULT_UPDATE_BEST_GAME=$($PSQL "UPDATE score_table SET best_game=$TRIES WHERE user_id='$USER_ID'")
  fi
fi
