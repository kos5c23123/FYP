import requests
from bs4 import BeautifulSoup

URL = 'https://www.hko.gov.hk/en/'
page = requests.get(URL)

soup = BeautifulSoup(page.content, 'html.parser')

results = soup.find_all('span', class_='hkoTemp')

print(results)