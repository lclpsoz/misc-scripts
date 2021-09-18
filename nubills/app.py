import os
import json
import flask
from flask import Flask, request

import mobills
from nubank_info import NubankInfo
from matches import update_matches

app = Flask(__name__)


@app.route('/')
def main():
    # Get data

    ## Get and treat NuBank data
    open_month = request.args.get('openMonth')
    if not open_month:
        open_month = input('Open month (YYYY-MM) of the target bill: ')
    _, nubank_month_data = NubankInfo().main(open_month,
        ['category', 'amount', 'title', 'date', 'type', 'id'])

    ## Read and treat Mobills data
    info_mobills_file = request.args.get('mobillsFileName')
    if info_mobills_file == None:
        info_mobills_file = input(
            'Mobills csv filename or empty for latest of open_month: ')
    if len(info_mobills_file) < 3:
        info_mobills_file = open_month
    mobills_month_data = mobills.get_mobills(info_mobills_file)

    # Run matching

    ## Read it
    json_match_fp = os.path.join('matchs', 'match-' + open_month + '.json')
    matches = []
    if (os.path.exists(json_match_fp)):
        with open(json_match_fp, 'r') as fp:
            matches = json.load(fp)

    ## Update match object
    update_matches(matches, nubank_month_data, mobills_month_data)

    # Return and save data
    return_dict = {
        'nubankNoMatch': nubank_month_data,
        'mobillsNoMatch': mobills_month_data,
        'matches': matches
    }

    with open(json_match_fp, 'w') as fp:
        json.dump(matches, fp)

    response = flask.jsonify(return_dict)
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response
