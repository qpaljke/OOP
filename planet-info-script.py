from selenium import webdriver
import json
from bs4 import BeautifulSoup
import requests
import matplotlib.pyplot as plt
import matplotlib.image as mpimg

def parse_planet_info(url):
    driver = webdriver.Chrome() 
    driver.get(url)

    planets = []
    


    return planets



def save_planet_info(planets, output_file):
    with open(output_file, 'w') as f:
        json.dump(planets, f, indent=4)

if __name__ == "__main__":
    url = "https://solarsystem.nasa.gov/planets/overview/"
    response = requests.get(url)
    html_content = response.text

    soup = BeautifulSoup(html_content, 'html.parser')

    #outer_divs = soup.find_all('div', class_='order-last grid-col-12 desktop:grid-col-6 margin-bottom-3 tablet:margin-bottom-0') #tablet:order-last')

    #for outer_div in outer_divs:
    inner_div = soup.find_all('div', class_='hds-media-wrapper margin-left-auto margin-right-auto width-full')
    #for inner in inner_div:
    for i in range(8):
        figure_tag = inner_div[i].find('figure', class_='hds-media-inner hds-cover-wrapper hds-media-ratio-cover')
        if figure_tag:
            picture_tag = figure_tag.find('picture', class_='BaseMedia width-full')
            if picture_tag:
                img_tag = picture_tag.find('img', class_='width-full')
                img = img_tag.get('src')
                print(img)