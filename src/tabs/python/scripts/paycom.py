import sys, json, re
input = sys.stdin.readlines()
input = json.loads(input[0])

timeDays = input.splitlines()

# outDay = []
totalHours = 0
for day in timeDays:
  unformattedTimes = re.search('.+GROUP(.+)$', day).group(1)
  # outDay.append(re.match('(\s+\d+:\d+\sPM)', unformattedTimes).group(1))
  totalHours += float(re.findall('(\d+\.\d+)', unformattedTimes)[-1])

# account for last day working minimum 7.5 hours
totalHours += 7.5 if len(timeDays) == 4 else totalHours

if totalHours > 40:
  lunchTime = str(round(totalHours - 39.5, 4))
  hours = re.search('(\d+)\.', lunchTime).group(1)
  minutes = round(float(re.search('\d+(\.\d+)', lunchTime).group(1)) * 60, 4)
else:
  hours = 0
  minutes = 30

print(f'{hours} hour(s) {minutes} minutes')
sys.stdout.flush()