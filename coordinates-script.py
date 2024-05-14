import json
from astropy.coordinates import solar_system_ephemeris, get_body
from astropy.time import Time

solar_system_ephemeris.set('builtin')

current_time = Time.now()

planets = ['Mercury', 'Venus', 'Earth', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune']

planetary_data = {}

for planet_name in planets:
    planet_coord = get_body(planet_name, current_time)
    ra = planet_coord.ra.deg
    dec = planet_coord.dec.deg
    planetary_data[planet_name] = {'Ra': ra, 'Dec': dec}

with open('coordinates.txt', 'w') as file_txt:
    for planet_name in planets:
        file_txt.write(f'{planet_name}: {planetary_data[planet_name]}\n')

with open('coordinates.json', 'w') as file_json:
    json.dump(planetary_data, file_json)

print("Результаты записаны в файл coordinates.json")
