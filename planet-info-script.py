import json
from bs4 import BeautifulSoup
import requests
import os


def parse_left_planet_info():
    left_planets = ['Mercury', 'Earth', 'Jupiter', 'Uranus']
    planets_info = {}
    inner_div = soup.find_all('div', class_ = 'hds-listicle-text-wrapper align-left')
    for i in range(4):
        if inner_div:
            div = inner_div[i].find('div', class_='')
            if div:
                p_tags = div.find('p', class_='color-carbon-90-important hds-listicle-body margin-top-1 margin-bottom-0')
                if p_tags:
                    planets_info[left_planets[i]] = p_tags.text.strip()
    return planets_info

def parse_right_planet_info():
    right_planets = ['Venus', 'Mars', 'Saturn', 'Neptune']
    planets_info = {}
    inner_div = soup.find_all('div', class_ = 'hds-listicle-text-wrapper align-right')
    for i in range(4):
        if inner_div:
            div = inner_div[i].find('div', class_='')
            if div:
                p_tags = div.find('p', class_='color-carbon-90-important hds-listicle-body margin-top-1 margin-bottom-0')
                if p_tags:
                    planets_info[right_planets[i]] = p_tags.text.strip()
    return planets_info

def merge_planets_info(dict1, dict2):
    merged_dict = {}
    keys1 = list(dict1.keys())
    keys2 = list(dict2.keys())
    
    max_len = max(len(keys1), len(keys2))
    
    for i in range(max_len):
        if i < len(keys1):
            key1 = keys1[i]
            merged_dict[key1] = dict1[key1]
        
        if i < len(keys2):
            key2 = keys2[i]
            merged_dict[key2] = dict2[key2]
    
    return merged_dict

def save_planets_info(output_file):
    #print(merge_planets_info(parse_left_planet_info(), parse_right_planet_info()))
    with open(output_file, 'w') as f:
        json.dump(merge_planets_info(parse_left_planet_info(), parse_right_planet_info()), f)


def save_images(image_urls, folder_path):
    if not os.path.exists(folder_path):
        os.makedirs(folder_path)
    
    for i, url in enumerate(image_urls):
        response = requests.get(url)
        image_path = os.path.join(folder_path, f"planet_{i+1}.jpg")
        with open(image_path, 'wb') as file:
            file.write(response.content)
        print(f"Saved {url} as {image_path}")


def parse_images():
    res = []
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
                res.append(img)
    return res

if __name__ == "__main__":
    url = "https://solarsystem.nasa.gov/planets/overview/"
    response = requests.get(url)
    html_content = response.text

    soup = BeautifulSoup(html_content, 'html.parser')

    save_images(parse_images(), 'static')

    save_planets_info('planets_info.json')