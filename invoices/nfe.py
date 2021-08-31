#%% Request
import requests
from bs4 import BeautifulSoup
import re

nfe_code = input('Input nf-e code: ')
nfe_code = re.sub('\D', '', nfe_code)

url_qrcode = 'http://www.nfce.se.gov.br/portal/qrcode.jsp?p=' + nfe_code + '|2|1|3|bb608455a1c917b0cb910034688a4fa65f851089'
headers = {
    "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
    "accept-language": "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7",
    "cache-control": "max-age=0",
    "upgrade-insecure-requests": "1"
}

print('Making request...')
try:
    req = requests.post(url=url_qrcode, headers=headers, timeout=2)
    print('\t', req, sep='')
except:
    print('\tProblem with the request. Probably nf-e is not available yet.')
    print('\tTry to go directly to the nfe page:', url_qrcode)

#%% Process
html_doc = req.text
soup = BeautifulSoup(html_doc, 'lxml')

tags = {
    'name': 'txtTit',
    'id': 'RCod',
    'amount': 'Rqtd',
    'price_unit': 'RvlUnit'        
}

assigned = {}
res = input('Amount of assigned rows to be read, separated by | (0 or empty for no):')
if len(res) > 0 and int(res) > 0:
    for i in range(int(res)):
        row = input()
        id, assigned_str = row.split('|')
        if id in assigned and assigned[id] != assigned_str:
            print('Code already register and different. Old:', assigned[id])
        assigned[id] = assigned_str

total = 0
products = {}
for row in soup.find_all('td'):
    if len(row.find_all('span', {'class': 'txtTit'})) > 0:
        name = row.find_all('span', {'class': tags['name']})[0].string
        id = row.find_all('span', {'class': tags['id']})[0].string.split(' ')[1].replace(')', '')
        amount = row.find_all('span', {'class': tags['amount']})[0].text.split(':')[1].replace(',', '.')
        price_unit = row.find_all('span', {'class': tags['price_unit']})[0].text.split('\xa0')[-1].replace(',', '.')
        
        amount, price_unit = float(amount), float(price_unit)

        assigned_str = ''
        if id in assigned:
            assigned_str = assigned[id]
        if id in products:
            products[id]['amount'] += amount
        else:
            products[id] = {
                'name': name,
                'assigned_str': assigned_str,
                'amount': amount,
                'price_unit': price_unit
            }
        total += amount*price_unit
        
print('\nTable:')
for id in products:
    prod = products[id]
    name, assigned_str, amount, price_unit = prod['name'], prod['assigned_str'], prod['amount'], prod['price_unit']
    print(name, id, assigned_str, str(amount).replace('.', ','), str(price_unit).replace('.', ','), sep='|')

print('\nTotal = R$', round(total*100)/100)