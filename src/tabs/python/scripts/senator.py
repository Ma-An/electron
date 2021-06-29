import sys, urllib.request, json, re
from bs4 import BeautifulSoup

input = sys.stdin.readlines()
input = json.loads(input[0])

# need header info for government website request
header = {'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.11 (KHTML, like Gecko) Chrome/23.0.1271.64 Safari/537.11',
       'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
       'Accept-Charset': 'ISO-8859-1,utf-8;q=0.7,*;q=0.3',
       'Accept-Encoding': 'none',
       'Accept-Language': 'en-US,en;q=0.8',
       'Connection': 'keep-alive'}

request = urllib.request.Request(f'https://sec.report/Senate-Stock-Disclosures/?search={input.upper()}', None, header)
response = urllib.request.urlopen(request)

soup = BeautifulSoup(response, 'lxml', from_encoding=response.info().get_param('charset'))

transactionInfo = ['filed_transaction_date', 'security', 'reporter', 'transaction_type', 'transaction_amount', 'ownership']
transactionData = []

index = 0
rowData = {}
for row in soup.table.find_all('tr')[1:20]:
  for data in row.find_all('td'):
    if (index == 6):
      index = 0
      transactionData.append(rowData)
      rowData = {}
    rowData[transactionInfo[index]] =  data.text.replace('\n20', ' 20').replace('-- ', '').replace('\n', '')
    index += 1

# break up senator's full name
sep = '['
sepB = ' '
nameList = []
for index, record in enumerate(transactionData):
  nameList = record['reporter'].split(sep, 1)[0].strip().replace(',', '').split()
  temp = record['transaction_type'].split()
  transactionData[index]['senator_code'] = temp[len(temp) - 1].strip()
  if (len(nameList) >= 3):
    transactionData[index]['first_name'] = nameList[0]
    transactionData[index]['middle_ini'] = nameList[1]
    transactionData[index]['last_name'] = nameList[2]
  else:
    transactionData[index]['first_name'] = nameList[0]
    transactionData[index]['last_name'] = nameList[1]

transactionData = json.dumps(transactionData)
print (transactionData)
sys.stdout.flush()