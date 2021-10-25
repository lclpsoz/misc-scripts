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
    try:
        mobills_month_data = mobills.get_mobills(info_mobills_file)
    except ValueError:
        return ({'message': 'Mobills data for ' + open_month + ' not available!'}, 404)

    # Run matching

    ## Read it
    json_match_fp = os.path.join('matchs', 'match-' + open_month + '.json')
    matches = []
    if (os.path.exists(json_match_fp)):
        with open(json_match_fp, 'r') as fp:
            matches = json.load(fp)

    ## If matches follows deprecated format of list of lists, updates it to objects
    if len(matches) > 0 and type(matches[0]) == list:
        matches_old = matches
        matches_new = []
        for [nubank_ids, mobills_ids] in matches_old:
            matches_new.append({
                'nubank': nubank_ids,
                'mobills': mobills_ids
            })
        matches = matches_new

    ## Update match object
    nubank_after_match_data = dict(nubank_month_data)
    mobills_after_match_data = dict(mobills_month_data)
    update_matches(matches, nubank_after_match_data, mobills_after_match_data)

    # Return and save data
    return_dict = {
        'nubankNoMatch': nubank_after_match_data,
        'mobillsNoMatch': mobills_after_match_data,
        'matches':
        [
            {
                'nubank':
                    {nubank_id:     nubank_month_data[nubank_id]   for nubank_id   in match['nubank']  },
                'mobills':
                    {mobills_id:    mobills_month_data[mobills_id] for mobills_id  in match['mobills'] }
            } for match in matches
        ]
    }

    with open(json_match_fp, 'w') as fp:
        json.dump(matches, fp)


    return (flask.jsonify(return_dict), 200)
    # return gen_response(flask.jsonify(return_dict), 200)



@app.route('/add-matches', methods=['POST'])
# @cross_origin()
def add_match():
    data = json.loads(request.data)
    matches_new = data['matches']
    
    open_month = data['openMonth']
    if not open_month:
        open_month = input('Open month (YYYY-MM) of the target bill: ')
    
    json_match_fp = os.path.join('matchs', 'match-' + open_month + '.json')
    matches_local = []
    if (os.path.exists(json_match_fp)):
        with open(json_match_fp, 'r') as fp:
            matches_local = json.load(fp)
    
    mobills_month_data = mobills.get_mobills(open_month)
    _, nubank_month_data = NubankInfo().main(open_month,
        ['category', 'amount', 'title', 'date', 'type', 'id'])
    
    nubank_ids_new_matches = set()
    for match_new in matches_new:
        [nubank_ids, mobills_ids] = match_new['nubank'], match_new['mobills']
        # Add nubank ids to set
        for nubank_id in nubank_ids:
            nubank_ids_new_matches.add(nubank_id)

        # Updating count of mobills items
        for mobills_id in mobills_ids:
            if mobills_id not in mobills_month_data:
                return ({
                    'message': 'Mobills ID ' + mobills_id + ' not in mobills file or too many instances.',
                    'mobillsItem': [mobills_month_data[mobills_id] if mobills_id in mobills_month_data else None]},
                    409)
            mobills_month_data[mobills_id]['count'] -= 1
            if mobills_month_data[mobills_id]['count'] == 0:
                del mobills_month_data[mobills_id]

    for match_local in matches_local:
        [nubank_ids, mobills_ids] = match_local['nubank'], match_local['mobills']
        for nubank_id in nubank_ids:
            if nubank_id in nubank_ids_new_matches:
                return ({
                    'message': 'Nubank ID ' + nubank_id + ' already matched.',
                    'nubankItem': [nubank_month_data[nubank_id] if nubank_id in nubank_month_data else None]},
                    409)

        for mobills_id in mobills_ids:
            if mobills_id not in mobills_month_data:
                return ({
                    'message': 'Mobills ID ' + mobills_id + ' not in mobills file or too many instances.',
                    'mobillsItem': [mobills_month_data[mobills_id] if mobills_id in mobills_month_data else None]},
                    409)
            mobills_month_data[mobills_id]['count'] -= 1
            if mobills_month_data[mobills_id]['count'] == 0:
                del mobills_month_data[mobills_id]
    
    match_was_inserted = False
    for match in matches_new:
        if len(match['mobills']) > 0 and len(match['nubank']) > 0:
            matches_local.append(match)
            match_was_inserted = True
    
    if match_was_inserted:
        with open(json_match_fp, 'w') as fp:
            json.dump(matches_local, fp)

        return ({'message': 'Success!'}, 201)
    else:
        return ({'message': 'Success! But no match was inserted.'}, 202)