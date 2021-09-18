import csv
import glob
import os
import hashlib

def get_mobills(info_file):
    mobills_csv_name = ''
    if '.csv' in info_file:
        os.path.join('mobills', mobills_csv_name)
    else:
        list_of_files = glob.glob(os.path.join('mobills', '*_' + info_file + '_*'))
        mobills_csv_name = max(list_of_files, key=os.path.getctime)

    mobillsFilePath = os.path.join(mobills_csv_name)
    with open (mobillsFilePath, 'r') as csvFile:
        mobills_data_table = list(csv.reader (csvFile, delimiter=';'))[1:]
        for i in range (len (mobills_data_table)):
            mobills_data_table[i][3] = int (''.join(mobills_data_table[i][3].split (' ')[1].split(',')).replace('.', ''))

    mobills_data = {}
    for exp_row in mobills_data_table:
        exp_id = hashlib.md5(str.encode(str(exp_row))).hexdigest()
        if exp_id in mobills_data:
            mobills_data[exp_id]['count'] += 1
        else:
            mobills_data[exp_id] = {
                'date': exp_row[0],
                'title': exp_row[1],
                'category': exp_row[2],
                'amount': exp_row[3],
                'count': 1
            }

    return mobills_data