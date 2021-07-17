#%% Request
import requests
from bs4 import BeautifulSoup
import re

code = input('Input nf-e code:')
code = re.sub('\D', '', code)

url_qrcode = 'http://www.nfce.se.gov.br/portal/qrcode.jsp?p=' + code + '|2|1|3|bb608455a1c917b0cb910034688a4fa65f851089'
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
#%% Process

html_doc = req.text
soup = BeautifulSoup(html_doc, 'lxml')

tags = {
    'product': 'txtTit',
    'id': 'RCod',
    'amount': 'Rqtd',
    'price_unit': 'RvlUnit'        
}

total = 0
for row in soup.find_all('td'):
    if len(row.find_all('span', {'class': 'txtTit'})) > 0:
        product = row.find_all('span', {'class': tags['product']})[0].string
        id = row.find_all('span', {'class': tags['id']})[0].string.split(' ')[1].replace(')', '')
        amount = row.find_all('span', {'class': tags['amount']})[0].text.split(':')[1].replace(',', '.')
        price_unit = row.find_all('span', {'class': tags['price_unit']})[0].text.split('\xa0')[-1].replace(',', '.')
        
        amount, price_unit = float(amount), float(price_unit)
        print(product, id, '', str(round(amount*price_unit*100)/100).replace('.', ','), sep='|')
        
        total += float(amount)*float(price_unit)
print('\nTotal = R$', round(total*100)/100)