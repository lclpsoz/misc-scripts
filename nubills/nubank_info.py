import json
from datetime import datetime
import os
from time import time
from pynubank import Nubank

EXPIRE_SECONDS = 3*3600

class NubankInfo:
    def get_bills(self):
        # Utilize o CPF sem pontos ou traços
        self.nu = Nubank()
        uuid, qr_code = self.nu.get_qr_code()
        qr_code.print_ascii(invert=True)
        input('Após escanear o QRCode pressione enter para continuar')
        cpf = input("CPF: ")
        password = input("Senha: ")
        self.nu.authenticate_with_qr_code(cpf, password, uuid)

        # Lista de dicionários contendo todas as transações de seu cartão de crédito
        # card_statements = self.nu.get_card_statements()

        # Lista de dicionários contendo todas as faturas do seu cartão de crédito
        self.bills = self.nu.get_bills()
        print("Bills aquired!")

    def get_item_date(self, item):
        return item['post_date']

    def requestOpenBill(self):
        for bill in self.bills:
            if (bill['state'] == 'open'):
                bill_details = self.nu.get_bill_details(bill)
                break
        tag_bill = bill_details['bill']['summary']['open_date'].split('-')
        tag_bill = tag_bill[0] + '-' + tag_bill[1]
        filename = "nubank_bill_details_" + tag_bill + "_" + datetime.now().strftime("%Y-%m-%d-%H%M%S") + ".json"
        print("Filename =", filename)
        with open (os.path.join("nubank", filename), 'w') as f:
            json.dump (bill_details, f)
        return bill_details

    def request_bill_by_field(self, field, value):
        self.get_bills()
        bill_details = None
        for bill in self.bills:
            if value in bill['summary'][field]:
                bill_details = self.nu.get_bill_details(bill)
                break
        tag_bill = bill_details['bill']['summary']['open_date'].split('-')
        tag_bill = tag_bill[0] + '-' + tag_bill[1]
        filename = "nubank_bill_details_" +\
                    tag_bill + "_" +\
                    datetime.now().strftime("%Y-%m-%d-%H%M%S") + ".json"
        print("Filename =", filename)
        with open (os.path.join("nubank", filename), 'w') as f:
            json.dump (bill_details, f)

        return bill_details

    def main(self, target_bill_open_date, columns_to_filter):
        lst = 0
        for path_file in os.listdir("nubank"):
            full_path_file = os.path.join("nubank", path_file)
            if(os.path.isfile(full_path_file) and\
                    path_file.split('_')[3] == target_bill_open_date and\
                    lst < os.path.getmtime(full_path_file)):
                lst = os.path.getmtime(full_path_file)
                lst_path = full_path_file
        diff_time = time() - lst
        request_data = diff_time > EXPIRE_SECONDS
        if request_data and lst > 0: # There is a file, but is probably old
            ans = input('Do you want to request new data? (y/n) ')
            if 'n' in ans.lower():
                request_data = False
        if request_data: # More than one hour ago
            bill_details = self.request_bill_by_field('open_date', target_bill_open_date)
        else:
            with open(lst_path, 'r') as f:
                bill_details = json.load (f)

        items_open = bill_details['bill']['line_items']
        items_open.sort (key=self.get_item_date)
        itemsFilteredTable = [('date', 'Title', 'Category', 'Amount')]
        total = 0
        for item in items_open:
            if (item['amount']):
                if 'category' in item:
                    # print (item)
                    # print (item['title'], '\t', item['category'], '\t', item['amount'])
                    itemsFilteredTable.append ((item['post_date'],
                                                item['title'],
                                                item['category'],
                                                float(item['amount']/100)))
                    if(item['amount'] > 0):
                        total += item['amount']
                else:
                    # print (item)
                    itemsFilteredTable.append ((item['post_date'],
                                                item['title'],
                                                None,
                                                float(item['amount']/100)))

        nubank_data = {}
        for item in items_open:
            nubank_data[item['id']] = {key: (item[key] if key in item else None) for key in columns_to_filter}
            if 'date' in columns_to_filter:
                post_date = item['post_date'].split('-')
                date = post_date[2] + '/' + post_date[1] + '/' + post_date[0]
                nubank_data[item['id']]['date'] = date

        return bill_details, nubank_data

