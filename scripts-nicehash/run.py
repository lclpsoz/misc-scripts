import nicehash
import pprint
import json

host = 'https://api2.nicehash.com'
organisation_id = 'ff2d2829-4d12-4158-ae0e-ff0833e80e18'
key = 'b7815dc0-1525-4ca4-b7ac-4050872e6751'
secret = 'fc695247-b453-486b-9941-6ce9f318828812affee0-41ee-4acf-843d-d4fb51c5cd97'

private_api = nicehash.private_api(host, organisation_id, key, secret, True)


all_data = []
all_data_ids = set()
cur_page_id = 0
len_before = 0
cur_page = private_api.get_accounting_transactions('BTC', 100, cur_page_id)['list']
for x in cur_page:
    print(x['id'])
    if x['id'] not in all_data_ids:
        all_data_ids.add(x['id'])
        all_data.append(x)
    
while len_before < len(all_data):
    len_before = len(all_data_ids)
    cur_page_id += 1
    cur_page = private_api.get_accounting_transactions('BTC', 100, cur_page_id)['list']
    for x in cur_page:
        print(x['id'], x['created'])
        if x['id'] not in all_data_ids:
            all_data_ids.add(x['id'])
            all_data.append(x)
    print(len(all_data_ids))
# print(all_data)
with open('all_data.json', 'w') as fp:
    json.dump(all_data, fp)