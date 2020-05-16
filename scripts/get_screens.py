from io import BytesIO
import json
import os

from PIL import Image
import requests

API_KEY = 'a5f1d489febdb6a0112a3d3197becc94'

def get_shots():
    with open('movies.json') as movie_file:
        films = json.load(movie_file)
        for film in films:
            print(film['id'])
            find_uri = f"https://api.themoviedb.org/3/find/{film['id']}?api_key={API_KEY}&external_source=imdb_id"

            response = requests.get(find_uri)
            film_details = response.json()
            print(film_details)
            if 'movie_results' in film_details.keys() and film_details['movie_results']:
                film_id = film_details['movie_results'][0]['id']
                backdrop = film_details['movie_results'][0]['backdrop_path']

            if film_id:
                print(film_id)
                request_uri = f'https://api.themoviedb.org/3/movie/{film_id}/images?api_key=<<api_key>>'

            if backdrop:
                img_url = f'https://image.tmdb.org/t/p/w300_and_h450_bestv2{backdrop}'
                img_resp = response = requests.get(img_url)
                if img_resp.ok:
                    img = Image.open(BytesIO(response.content))
                    save_path = f"./screenshots/{film['id']}"
                    if not os.path.exists(save_path):
                        os.mkdir(save_path)
                    img.save(f"{save_path}{backdrop}")


if __name__ == "__main__":
    get_shots()