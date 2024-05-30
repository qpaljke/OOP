import json
from astropy.coordinates import solar_system_ephemeris, get_body
from astropy.time import Time

from skyfield.api import load, Topos
from skyfield.data import mpc
import numpy as np

# загрузить эфемериды
eph = load('de421.bsp')

ts = load.timescale()
t = ts.now()

planets = {
    'Mercury': eph['mercury'],
    'Venus': eph['venus'],
    'Earth': eph['earth'],
    'Mars': eph['mars'],
    'Jupiter': eph['jupiter barycenter'],
    'Saturn': eph['saturn barycenter'],
    'Uranus': eph['uranus barycenter'],
    'Neptune': eph['neptune barycenter'],
}

sun = eph['sun']

planetary_data = {}

sun = eph['sun']
for name, planet in planets.items():
    astrometric = sun.at(t).observe(planet)
    ra, dec, distance = astrometric.radec()
    x, y, z = astrometric.position.au

    longitude = np.degrees(np.arctan2(y, x))
    if longitude < 0:
        longitude += 360

    planetary_data[name] = {'Deg': longitude}

with open('coordinates.txt', 'w') as file_txt:
    for planet_name in planetary_data:
        file_txt.write(f'{planet_name}: {planetary_data[planet_name]}\n')

with open('coordinates.json', 'w') as file_json:
    json.dump(planetary_data, file_json)


# solar_system_ephemeris.set('builtin')

# current_time = Time.now()

# planets = ['Mercury', 'Venus', 'Earth', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune']

# planetary_data = {}

# for planet_name in planets:
#     planet_coord = get_body(planet_name, current_time)
#     ra = planet_coord.ra.deg
#     dec = planet_coord.dec.deg
#     planetary_data[planet_name] = {'Ra': ra, 'Dec': dec}

# with open('coordinates.txt', 'w') as file_txt:
#     for planet_name in planets:
#         file_txt.write(f'{planet_name}: {planetary_data[planet_name]}\n')

# with open('coordinates.json', 'w') as file_json:
#     json.dump(planetary_data, file_json)

print("Результаты записаны в файл coordinates.json")