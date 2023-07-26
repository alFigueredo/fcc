#!/bin/bash

echo "Enter your username:"
read USERNAME
if [[ ${#USERNAME} -gt 22 ]]
then
    echo "Your username is too long!"
    exit 0
fi
echo "Welcome, $USERNAME! It looks like this is your first time here."
SECRET_NUMBER=$(( $RANDOM % 1000 + 1 ))
echo "Guess the secret number between 1 and 1000:"
read NUMBER
TRIES=0
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
