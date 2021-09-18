import os
import json
import flask
from flask import Flask, request
from flask_cors import CORS, cross_origin

import mobills
from nubank_info import NubankInfo
from matches import update_matches

app = Flask(__name__)
cors = CORS(app, resources={
    r"/": {"origins": "*"},
    r"/add-matches": {"origins": "*"}
})

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
    nubank_after_match_data = dict(nubank_month_data)
    mobills_after_match_data = dict(mobills_month_data)
    update_matches(matches, nubank_after_match_data, mobills_after_match_data)

    # Return and save data
    return_dict = {
        'nubankNoMatch': nubank_after_match_data,
        'mobillsNoMatch': mobills_after_match_data,
        'matches': [[   [nubank_month_data[nubank_id] for nubank_id in nubArr ],
                        [mobills_month_data[mobills_id] for mobills_id in mobArr ]] for [nubArr, mobArr] in matches]
    }

    with open(json_match_fp, 'w') as fp:
        json.dump(matches, fp)


    return (flask.jsonify(return_dict), 200)
    # return gen_response(flask.jsonify(return_dict), 200)



@app.route('/add-matches', methods=['POST'])
# @cross_origin()
def add_match():
    data = json.loads(request.data)
    new_matches = data['matches']
    open_month = data['openMonth']
    if not open_month:
        open_month = input('Open month (YYYY-MM) of the target bill: ')
    
    json_match_fp = os.path.join('matchs', 'match-' + open_month + '.json')
    matches = []
    if (os.path.exists(json_match_fp)):
        with open(json_match_fp, 'r') as fp:
            matches = json.load(fp)
    
    mobills_month_data = mobills.get_mobills(open_month)
    _, nubank_month_data = NubankInfo().main(open_month,
        ['category', 'amount', 'title', 'date', 'type', 'id'])
    
    nubank_ids_new_matches = set()
    for [nubank_ids, mobills_ids] in new_matches:
        for nubank_id in nubank_ids:
            nubank_ids_new_matches.add(nubank_id)
        for mobills_id in mobills_ids:
            if mobills_id not in mobills_month_data:
                return ({
                    'message': 'Mobills ID ' + mobills_id + ' not in mobills file or too many instances.',
                    'mobillsItem': mobills_month_data[mobills_id]},
                    409)
            mobills_month_data[mobills_id]['count'] -= 1
            if mobills_month_data[mobills_id]['count'] == 0:
                del mobills_month_data[mobills_id]

    for [nubank_ids, mobills_ids] in matches:
        for nubank_id in nubank_ids:
            if nubank_id in nubank_ids_new_matches:
                return ({
                    'message': 'Nubank ID ' + nubank_id + ' already matched.',
                    'nubankItem': nubank_month_data[nubank_id]},
                    409)

        for mobills_id in mobills_ids:
            if mobills_id not in mobills_month_data:
                return ({
                    'message': 'Mobills ID ' + mobills_id + ' not in mobills file or too many instances.',
                    'mobillsItem': mobills_month_data[mobills_id]},
                    409)
            mobills_month_data[mobills_id]['count'] -= 1
            if mobills_month_data[mobills_id]['count'] == 0:
                del mobills_month_data[mobills_id]
    
    match_was_inserted = False
    for match in new_matches:
        if len(match[0]) > 0 and len(match[1]) > 0:
            matches.append(match)
            match_was_inserted = True
    
    if match_was_inserted:
        with open(json_match_fp, 'w') as fp:
            json.dump(matches, fp)

        return ({'message': 'Success!'}, 201)
    else:
        return ({'message': 'Success! But no match was inserted.'}, 202)