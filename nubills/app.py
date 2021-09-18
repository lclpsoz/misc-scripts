import os
import json
from tabulate import tabulate
import mobills
from nubank_info import NubankInfo
import flask
from flask import Flask, request

app = Flask(__name__)


def row_to_dict(header, row):
    """
    Conect row to dict, key names based on header
    """
    row_dict = {}
    for i in range(len(header)):
        row_dict[header[i]] = row[i]
    return row_dict


def table_to_dicts(header, table):
    """
    Convert table to list of dicts, key names based on table headers
    """
    return_dicts = []
    for row in table:
        return_dicts.append(row_to_dict(header, row))

    return return_dicts


@app.route('/')
def main():
    # Get data
    open_month = request.args.get('openMonth')
    if not open_month:
        open_month = input('Open month (YYYY-MM) of the target bill: ')
    nu_bill_details, nu_items_open = NubankInfo().main(open_month)

    info_mobills_file = request.args.get('mobillsFileName')
    if info_mobills_file == None:
        info_mobills_file = input(
            'Mobills csv filename or empty for latest of open_month: ')
    if len(info_mobills_file) < 3:
        info_mobills_file = open_month
    mobills_data = mobills.get_mobills(info_mobills_file)

    # Run matching

    json_match_fp = os.path.join('matchs', 'match-' + open_month + '.json')
    match = {}
    if (os.path.exists(json_match_fp)):
        with open(json_match_fp, 'r') as fp:
            match = json.load(fp)

    ## Remove matches from expenses that don't exist anymore
    nu_cur_ids = set()
    for item in nu_items_open:
        nu_cur_ids.add(item['id'])

    del_from_match = []
    for key in match:
        if key not in nu_cur_ids or match[key] not in mobills_data:
            del_from_match.append(key)

    for key in del_from_match:
        del match[key]

    # Count each mobills expense
    mobills_count_exp = {}
    for exp in map(tuple, mobills_data):
        if exp in mobills_count_exp:
            mobills_count_exp[exp] = 1
        else:
            mobills_count_exp[exp] += 1

    # Exclude already matched expeses from mobills
    for key in match:
        try:
            mobills_count_exp[tuple(match[key])] -= 1
            if (mobills_count_exp[tuple(match[key])] == 0):
                del mobills_count_exp[tuple(match[key])]
        except:
            print('Error in', key, match[key], ' probably match error.')

    # Map from cost of the mobills expense to an array of expenses of
    # this cost.
    mobillsExpsPerCost = {}
    for exp in mobills_count_exp:
        if(exp[3] in mobillsExpsPerCost):
            mobillsExpsPerCost[exp[3]].append(exp)
        else:
            mobillsExpsPerCost[exp[3]] = [exp]

    idToExpenseNuBank = {}
    for item in nu_items_open:
        idToExpenseNuBank[item['id']] = item

    # Try to match expenses
    headers_nubank = ('date', 'title', 'category', 'amount')
    failsNuBank = [headers_nubank]
    for item in nu_items_open:
        if (not item['id'] in match):
            if (not item['amount'] in mobillsExpsPerCost):
                failsNuBank.append(filterExp(item))
            else:
                now = mobillsExpsPerCost[item['amount']]
                if (len(now) > 1):
                    print('Choose which of thoses match this expense:')
                    print((item['post_date'], item['title'],
                          item['category'], item['amount']))
                    for i in range(len(now)):
                        print('id[%02d]:' % i, now[i])
                    choice = int(input())
                else:
                    choice = 0
                match[item['id']] = now[choice]
                del now[choice]
                if len(now) == 0:
                    del mobillsExpsPerCost[item['amount']]

    return_dict = {
        'nubankNoMatch': [],
        'mobillsNoMatch': [],
        'matches': []
    }

    # Expenses from NuBank not matched
    if len(failsNuBank) > 1:
        print('Expenses from NuBank without match:')
        return_dict['nubankNoMatch'] = failsNuBank
        print(tabulate(failsNuBank, headers='firstrow',
              tablefmt='github', floatfmt='.2f'))
    else:
        print('All expenses from NuBank have a match!')
    print('')

    # Expenses from mobills not matched
    headers_mobills = ('date', 'title', 'category', 'amount')
    failsMobills = [headers_mobills]
    for cost in mobillsExpsPerCost:
        for item in mobillsExpsPerCost[cost]:
            failsMobills.append(tuple(item))
    failsMobills[1:].sort(key=lambda failsMobills: failsMobills[0])
    if (len(failsMobills) > 1):
        print('Expenses from mobills without match:')
        return_dict['mobillsNoMatch'] = failsMobills
        print(tabulate(failsMobills, headers='firstrow', tablefmt='github'))
    else:
        print('All expenses from mobills have a match!')
    print('')

    print('Matches:')
    matchesTable = [('NuBank', 'mobills')]
    totalNuBank = 0
    totalMobills = 0
    for key in match:
        matchesTable.append(
            (tuple(filterExp(idToExpenseNuBank[key])), tuple(match[key])))
        totalNuBank += int(filterExp(idToExpenseNuBank[key])[3])
        totalMobills += int(match[key][3])
    return_dict['matches'] = matchesTable
    print(tabulate(matchesTable, tablefmt='github'))
    print('TOTALS:', 'NuBank =', totalNuBank, 'mobills =',
          totalMobills, 'Diff =', totalNuBank-totalMobills)

    with open(json_match_fp, 'w') as fp:
        json.dump(match, fp)

    return_dict['nubankNoMatch'] = table_to_dicts(
        headers_nubank, return_dict['nubankNoMatch'][1:])
    return_dict['mobillsNoMatch'] = table_to_dicts(
        headers_mobills, return_dict['mobillsNoMatch'][1:])
    return_dict['matches'] = table_to_dicts(
        ['nubank', 'mobills'], return_dict['matches'][1:])
    for i in range(len(return_dict['matches'])):
        return_dict['matches'][i]['nubank'] = row_to_dict(
            headers_nubank, return_dict['matches'][i]['nubank'])
        return_dict['matches'][i]['mobills'] = row_to_dict(
            headers_mobills, return_dict['matches'][i]['mobills'])

    response = flask.jsonify(return_dict)
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response
