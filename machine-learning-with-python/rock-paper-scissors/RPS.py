# The example function below keeps track of the opponent's history and plays whatever the opponent played two plays ago. It is not a very good player so you will need to change the code to pass the challenge.
import random
import math

def random_number(amount_numbers):
    return int(math.floor(random.random()*amount_numbers))

def player(prev_play, opponent_history=[]):
    opponent_history.append(prev_play)

    rps_array = ["R", "P", "S"]

    last_plays = opponent_history[-10:]
    lp_joined = "".join(last_plays)

    if prev_play == "":
        return rps_array[random_number(3)]

    ideal_response = {"P": "S", "R": "P", "S": "R"}

    if "RRSSPP" in lp_joined[-6:]:
        return prev_play
    if "RRSSPPR" in lp_joined[-7:]:
        return prev_play
    if "RRSSPPRS" in lp_joined[-8:]:
        return prev_play
    if "RPSR" in lp_joined[-4:]:
        return prev_play
    if "PRSP" in lp_joined[-4:]:
        return prev_play

    return ideal_response[prev_play]
