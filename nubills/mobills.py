import csv
import os
from pprint import pprint

def get_mobills(mobills_csv_name):
    mobillsFilePath = os.path.join("mobills", mobills_csv_name)
    with open (mobillsFilePath, 'r') as csvFile:
        mobills = list(csv.reader (csvFile, delimiter=';'))[1:]
        for i in range (len (mobills)):
            mobills[i][3] = int (''.join(mobills[i][3].split (' ')[1].split(',')).replace('.', ''))

    print('Returning mobills data!')
    return mobills