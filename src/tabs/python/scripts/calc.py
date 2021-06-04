import sys, json
input = sys.stdin.readlines()
input = json.loads(input[0])

leftNumber = int(input[0]["leftNumber"])
rightNumber = int(input[0]["rightNumber"])
operator = input[0]["operator"]
result = ''

if operator == '+':
  result = leftNumber + rightNumber
elif operator == '-':
  result = leftNumber - rightNumber
elif operator == 'x':
  result = leftNumber * rightNumber
elif operator == '/':
  result = leftNumber / rightNumber

print(result)
sys.stdout.flush()