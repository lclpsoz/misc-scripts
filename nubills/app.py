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
    bill_details, items_open = NubankInfo().main(open_month)

    info_mobills_file = request.args.get('mobillsFileName')
    if info_mobills_file == None:
        info_mobills_file = input('Mobills csv filename or empty for latest of open_month: ')
    if len(info_mobills_file) < 3:
        info_mobills_file = open_month
    mobills_data = mobills.get_mobills(info_mobills_file)

    # Run matching

    # I could sort by value and try to match manually when there are more than one with the same value.
    # Based on this aproach, I need to have user validation that the matching is correct, and if not, allow manual match.

    # Before doing 'match' I should read a json (in case it exist) to match expenses from previous weeks that were already matched.

    def filterExp (exp):
        ret = [None for x in range (4)]
        if ('post_date' in exp):
            ret[0] = exp['post_date']
        if ('title' in exp):
            ret[1] = exp['title']
        if ('category' in exp):
            ret[2] = exp['category']
        if ('amount' in exp):
            ret[3] = exp['amount']
            
        return ret

    month = bill_details['bill']['summary']['open_date'][:7]
    jsonFilePath = os.path.join('matchs', 'match-' + month + '.json')

    # Read match json
    match = {}
    if (os.path.exists (jsonFilePath)):
        with open (jsonFilePath, 'r') as dictMatch:
            match = json.load (dictMatch)

    # REMOVE REFUNDS!

    # Remove matches from expenses that don't exist anymore
    nuBankIds = set()
    for item in items_open:
        nuBankIds.add (item['id'])
    toRemoveFromMatch = []
    for key in match:
        if (not key in nuBankIds):
            toRemoveFromMatch.append(key)
    for key in match:
        if (not match[key] in mobills_data):
            toRemoveFromMatch.append(key)
    for key in toRemoveFromMatch:
        del(match[key])
            
    # Create map from each mobills expense to each amount.
    mobillsExps = {}
    tupleMobills = []
    for exp in map(tuple, mobills_data):
        tupleMobills.append(exp)
    for exp in tupleMobills:
        if(tupleMobills.count(exp) != 1):
            print(exp, tupleMobills.count(exp))
        if (exp in mobillsExps):
            mobillsExps[exp] += 1
        else:
            mobillsExps[exp] = 1
            
    # Exclude already matched expeses from mobills_
    for key in match:
        try:
            mobillsExps[tuple (match[key])]-=1
            if (mobillsExps[tuple (match[key])] == 0):
                del mobillsExps[tuple (match[key])]
        except:
            print ('Error in', key, match[key], ' probably match error.')
            
    # Map from cost of the mobills expense to an array of expenses of
    # this cost.
    mobillsExpsPerCost = {}
    for exp in mobillsExps:
        if(exp[3] in mobillsExpsPerCost):
            mobillsExpsPerCost[exp[3]].append(exp)
        else:
            mobillsExpsPerCost[exp[3]] = [exp]
        
    idToExpenseNuBank = {}
    for item in items_open:
        idToExpenseNuBank[item['id']] = item

    # Try to match expenses
    headers_nubank = ('date', 'title', 'category', 'amount')
    failsNuBank = [headers_nubank]
    for item in items_open:
        if (not item['id'] in match):
            if (not item['amount'] in mobillsExpsPerCost):
                failsNuBank.append(filterExp (item))
            else:
                now = mobillsExpsPerCost[item['amount']]
                if (len (now) > 1):
                    print ('Choose which of thoses match this expense:')
                    print ((item['post_date'], item['title'], item['category'], item['amount']))
                    for i in range(len (now)):
                        print ('id[%02d]:' % i, now[i])
                    choice = int (input())
                else:
                    choice = 0
                match[item['id']] = now[choice]
                del (now[choice])
                if (len (now) == 0):
                    del mobillsExpsPerCost[item['amount']]

    return_dict = {
        'nubankNoMatch': [],
        'mobillsNoMatch': [],
        'matches': []
    }

    # Expenses from NuBank not matched
    if (len (failsNuBank) > 1):
        print ('Expenses from NuBank without match:')
        return_dict['nubankNoMatch'] = failsNuBank
        print (tabulate (failsNuBank, headers='firstrow', tablefmt='github', floatfmt='.2f'))
    else:
        print ('All expenses from NuBank have a match!')
    print('')

    # Expenses from mobills not matched
    headers_mobills = ('date', 'title', 'category', 'amount')
    failsMobills = [headers_mobills]
    for cost in mobillsExpsPerCost:
        for item in mobillsExpsPerCost[cost]:
            failsMobills.append(tuple (item))
    failsMobills[1:].sort (key = lambda failsMobills: failsMobills[0])
    if (len (failsMobills) > 1):
        print ('Expenses from mobills without match:')
        return_dict['mobillsNoMatch'] = failsMobills
        print(tabulate (failsMobills, headers='firstrow', tablefmt='github'))
    else:
        print ('All expenses from mobills have a match!')
    print('')

    print('Matches:')
    matchesTable = [('NuBank', 'mobills')]
    totalNuBank = 0
    totalMobills = 0
    for key in match:
        matchesTable.append ((tuple (filterExp (idToExpenseNuBank[key])), tuple(match[key])))
        totalNuBank += int(filterExp(idToExpenseNuBank[key])[3])
        totalMobills += int(match[key][3])
    return_dict['matches'] = matchesTable
    print(tabulate (matchesTable, tablefmt='github'))
    print('TOTALS:', 'NuBank =', totalNuBank, 'mobills =', totalMobills, 'Diff =', totalNuBank-totalMobills)
            
    with open (jsonFilePath, 'w') as dictMatch:
        json.dump (match, dictMatch)

    return_dict['nubankNoMatch'] = table_to_dicts(headers_nubank, return_dict['nubankNoMatch'][1:])
    return_dict['mobillsNoMatch'] = table_to_dicts(headers_mobills, return_dict['mobillsNoMatch'][1:])
    return_dict['matches'] = table_to_dicts(['nubank', 'mobills'], return_dict['matches'][1:])
    for i in range(len(return_dict['matches'])):
        return_dict['matches'][i]['nubank'] = row_to_dict(headers_nubank, return_dict['matches'][i]['nubank'])
        return_dict['matches'][i]['mobills'] = row_to_dict(headers_mobills, return_dict['matches'][i]['mobills'])

    response = flask.jsonify(return_dict)
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response