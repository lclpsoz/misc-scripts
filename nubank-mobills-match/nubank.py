# %% [markdown]
# ### Authentication

# %%
from pynubank import Nubank

# Utilize o CPF sem pontos ou traços
nu = Nubank()
uuid, qr_code = nu.get_qr_code()
qr_code.print_ascii(invert=True)
input('Após escanear o QRCode pressione enter para continuar')
cpf = input("CPF: ")
password = input("Senha: ")
nu.authenticate_with_qr_code(cpf, password, uuid)

# Lista de dicionários contendo todas as transações de seu cartão de crédito
card_statements = nu.get_card_statements()
# print (card_statements)

# Lista de dicionários contendo todas as faturas do seu cartão de crédito
bills = nu.get_bills()
print("Okay!")

# %% [markdown]
# ### Get bill

# %%
from tabulate import tabulate
import json
from datetime import datetime
from pprint import pprint
import os
from time import time

def amount(item):
    return item['amount']

def date(item):
    return item['post_date']

def requestOpenBill():
    for bill in bills:
        if (bill['state'] == 'open'):
            bill_details = nu.get_bill_details(bill)
            break
    tag_bill = bill_details['bill']['summary']['open_date'].split('-')
    tag_bill = tag_bill[0] + '-' + tag_bill[1]
    filename = "nubank_bill_details_" + tag_bill + "_" + datetime.now().strftime("%Y-%m-%d-%H%M%S") + ".json"
    print("Filename =", filename)
    with open (os.path.join("nubank", filename), 'w') as f:
        json.dump (bill_details, f)
    return bill_details

def request_bill_by_field(field, value):
    bill_details = None
    for bill in bills:
        if value in bill['summary'][field]:
            bill_details = nu.get_bill_details(bill)
            break
    tag_bill = bill_details['bill']['summary']['open_date'].split('-')
    tag_bill = tag_bill[0] + '-' + tag_bill[1]
    filename = "nubank_bill_details_" + tag_bill + "_" + datetime.now().strftime("%Y-%m-%d-%H%M%S") + ".json"
    print("Filename =", filename)
    with open (os.path.join("nubank", filename), 'w') as f:
        json.dump (bill_details, f)

    return bill_details

target_bill_open_date = input("Open date (YYYY-MM) of the target bill: ")

lst = 0
for path_file in os.listdir("nubank"):
    full_path_file = os.path.join("nubank", path_file)
    if(os.path.isfile(full_path_file) and path_file.split('_')[3] == target_bill_open_date and lst < os.path.getmtime(full_path_file)):
        lst = os.path.getmtime(full_path_file)
        lst_path = full_path_file
diff_time = time() - lst
if(diff_time > 3600): # More than one hour ago
    bill_details = request_bill_by_field('open_date', target_bill_open_date)
else:
    with open(lst_path, 'r') as f:
        bill_details = json.load (f)

itemsOpen = bill_details['bill']['line_items']
itemsOpen.sort (key=date)
itemsFilteredTable = [('Date', 'Title', 'Category', 'Amount')]
total = 0
for item in itemsOpen:
    if (item['amount']):
        if ('category' in item):
            # print (item)
            # print (item['title'], '\t', item['category'], '\t', item['amount'])
            itemsFilteredTable.append ((item['post_date'], item['title'], item['category'], float(item['amount']/100)))
            if(item['amount'] > 0):
                total += item['amount']
        else:
            # print (item)
            itemsFilteredTable.append ((item['post_date'], item['title'], None, float(item['amount']/100)))

print (tabulate (itemsFilteredTable, headers="firstrow", tablefmt='github', floatfmt=".2f"))
print ("Total = R$", total/100)

# %% [markdown]
# ### Get Mobills information

# %%
from pprint import pprint
import csv
mobills_csv_name = input("Mobills csv filename: ")
mobillsFilePath = os.path.join("mobills", mobills_csv_name)
with open (mobillsFilePath, 'r') as csvFile:
    mobills = list(csv.reader (csvFile, delimiter=';'))[1:]
    for i in range (len (mobills)):
        mobills[i][3] = int (''.join(mobills[i][3].split (' ')[1].split(',')).replace('.', ''))

pprint (mobills)

# %% [markdown]
# ### Match Nubank with Mobills

# %%
import json
from os import path

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
jsonFilePath = os.path.join("matchs", "match-" + month + '.json')

# Read match json
match = {}
if (path.exists (jsonFilePath)):
    with open (jsonFilePath, 'r') as dictMatch:
        match = json.load (dictMatch)

# REMOVE REFUNDS!

# Remove matches from expenses that don't exist anymore
nuBankIds = set()
for item in itemsOpen:
    nuBankIds.add (item['id'])
toRemoveFromMatch = []
for key in match:
    if (not key in nuBankIds):
        toRemoveFromMatch.append(key)
for key in match:
    if (not match[key] in mobills):
        toRemoveFromMatch.append(key)
for key in toRemoveFromMatch:
    del(match[key])
        
# Create map from each mobills expense to each amount.
mobillsExps = {}
tupleMobills = []
for exp in map(tuple, mobills):
    tupleMobills.append(exp)
for exp in tupleMobills:
    if(tupleMobills.count(exp) != 1):
        print(exp, tupleMobills.count(exp))
    if (exp in mobillsExps):
        mobillsExps[exp] += 1
    else:
        mobillsExps[exp] = 1
        
# Exclude already matched expeses from mobills
for key in match:
    try:
        mobillsExps[tuple (match[key])]-=1
        if (mobillsExps[tuple (match[key])] == 0):
            del mobillsExps[tuple (match[key])]
    except:
        print ("Error in", key, match[key], " probably match error.")
        
# Map from cost of the mobills expense to an array of expenses of
# this cost.
mobillsExpsPerCost = {}
for exp in mobillsExps:
    if(exp[3] in mobillsExpsPerCost):
        mobillsExpsPerCost[exp[3]].append(exp)
    else:
        mobillsExpsPerCost[exp[3]] = [exp]
    
idToExpenseNuBank = {}
for item in itemsOpen:
    idToExpenseNuBank[item['id']] = item

# Try to match expenses
failsNuBank = [('Date', 'Title', 'Category', 'Amount')]
for item in itemsOpen:
    if (not item['id'] in match):
        if (not item['amount'] in mobillsExpsPerCost):
            failsNuBank.append(filterExp (item))
        else:
            now = mobillsExpsPerCost[item['amount']]
            if (len (now) > 1):
                print ("Choose which of thoses match this expense:")
                print ((item['post_date'], item['title'], item['category'], item['amount']))
                for i in range(len (now)):
                    print ("id[%02d]:" % i, now[i])
                choice = int (input())
            else:
                choice = 0
            match[item['id']] = now[choice]
            del (now[choice])
            if (len (now) == 0):
                del mobillsExpsPerCost[item['amount']]

# Expenses from NuBank not matched
if (len (failsNuBank) > 1):
    print ("Expenses from NuBank without match:")
    print (tabulate (failsNuBank, headers="firstrow", tablefmt='github', floatfmt=".2f"))
else:
    print ("All expenses from NuBank have a match!")
print("")

# Expenses from Mobills not matched
failsMobills = [('Date', 'Title', 'Category', 'Amount')]
for cost in mobillsExpsPerCost:
    for item in mobillsExpsPerCost[cost]:
        failsMobills.append(tuple (item))
failsMobills[1:].sort (key = lambda failsMobills: failsMobills[0])
if (len (failsMobills) > 1):
    print ("Expenses from Mobills without match:")
    print(tabulate (failsMobills, headers='firstrow', tablefmt='github'))
else:
    print ("All expenses from Mobills have a match!")
print("")

print ("Matches:")
matchesTable = [('NuBank', 'Mobills')]
totalNuBank = 0
totalMobills = 0
for key in match:
    matchesTable.append ((tuple (filterExp (idToExpenseNuBank[key])), tuple(match[key])))
    totalNuBank += int(filterExp(idToExpenseNuBank[key])[3])
    totalMobills += int(match[key][3])
print (tabulate (matchesTable, tablefmt='github'))
print("TOTALS:", "NuBank =", totalNuBank, "Mobills =", totalMobills, "Diff =", totalNuBank-totalMobills)
        
with open (jsonFilePath, 'w') as dictMatch:
    json.dump (match, dictMatch)


