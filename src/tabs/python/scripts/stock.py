# these APIs do not include up to date prices on securities with free license version...
# $200 a month for a developer license...
# we'll use our own method

# # url = f"https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol={input}&apikey=BAN6ZI5K8G2CDG95"
# url = f"https://api.polygon.io/v2/aggs/ticker/{input}/prev?unadjusted=true&apiKey=6MPlJOcupCIEfR5laS_PDzyBuGKNupbL"
# r = requests.get(url)
# data = r.json()

# print(data["results"][0]["c"])
# sys.stdout.flush()

import sys, urllib.request, json, re
input = sys.stdin.readlines()
input = json.loads(input[0])

stockInfo = {}
response = urllib.request.urlopen(f'https://finance.yahoo.com/quote/{input.upper()}/')
html = response.read().decode('utf-8', 'strict')

# chop off uneeded html to speed up regex
location = html.find('data-reactid="50"')
html = html[location:]

# find current price of security
currentPrice = re.match('data-reactid="50">((\d+,?)*\.\d+)<', html)
stockInfo["currentPrice"] = f'Current price: {currentPrice.group(1)}' if currentPrice else 'Incorrect Ticker'

# change from open
dailyChange = re.match('.*?data-reactid="51">(.+?%\))', html)
stockInfo["dailyChange"] = f'Daily change: {dailyChange.group(1)}' if dailyChange else ''

stockInfo = json.dumps(stockInfo)
print(stockInfo)
sys.stdout.flush()