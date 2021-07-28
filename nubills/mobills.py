import csv
import glob
import os
from pprint import pprint

def get_mobills(info_file):
    mobills_csv_name = ''
    if '.csv' in info_file:
        os.path.join('mobills', mobills_csv_name)
    else:
        list_of_files = glob.glob(os.path.join('mobills', '*_' + info_file + '_*'))
        mobills_csv_name = max(list_of_files, key=os.path.getctime)

    mobillsFilePath = os.path.join(mobills_csv_name)
    with open (mobillsFilePath, 'r') as csvFile:
        mobills = list(csv.reader (csvFile, delimiter=';'))[1:]
        for i in range (len (mobills)):
            mobills[i][3] = int (''.join(mobills[i][3].split (' ')[1].split(',')).replace('.', ''))

    print('Returning mobills data!')
    return mobills