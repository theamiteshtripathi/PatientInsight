import requests
from bs4 import BeautifulSoup
import csv

# URL of the webpage
url = 'https://people.dbmi.columbia.edu/~friedma/Projects/DiseaseSymptomKB/index.html'

# Send a GET request to the webpage
response = requests.get(url)

# Parse the content of the webpage using BeautifulSoup
soup = BeautifulSoup(response.content, 'html.parser')

# Find the table in the webpage
table = soup.find('table')

# Extract the rows from the table
rows = table.find_all('tr')

# Open a CSV file to write the data
with open('disease_symptom_data.csv', 'w', newline='') as csv_file:
    csv_writer = csv.writer(csv_file)
    
    # Iterate through the rows of the table
    for row in rows:
        # Extract the cells from each row
        cells = row.find_all('td')
        # Get the text from each cell
        data = [cell.get_text(strip=True) for cell in cells]
        # Write the data to the CSV file if it contains data
        if data:
            csv_writer.writerow(data)

print("Data has been successfully scraped and exported to 'disease_symptom_data.csv'.")
