import hashlib
import json
import os
import shutil
import urllib.parse

def generate_songs():
    directory = r'./source_songs/reveals'
    song_list = []
    song_number = 1

    for entry in os.scandir(directory):
        if (entry.path.endswith(".mp3")):
            source_path, filename = os.path.split(entry.path)
            name, file_extension = os.path.splitext(filename)
            (artist, title) = tuple([x.strip() for x in urllib.parse.unquote(name)[:-7].split(' - ')])
            source_clip = f'{filename[:-11]}_Clip.mp3'
            source_reveal = filename
            song_hash = hashlib.md5(filename[:-11].encode('utf-8')).hexdigest()
            clips_path = os.path.join(source_path, '../clips')
            shutil.copyfile(f'{clips_path}/{source_clip}', f'./songs/clips/{song_hash}_clip.mp3')
            shutil.copyfile(f'{source_path}/{source_reveal}', f'./songs/reveals/{song_hash}_reveal.mp3')
            song_dict = {
                'artist': artist,
                'id': song_number,
                'title': title,
                'clip_path': f'clips/{song_hash}_clip.mp3',
                'reveal_path': f'reveals/{song_hash}_reveal.mp3'
            }
            song_list.append(song_dict)
            song_number += 1

    with open('songs.json', 'w') as song_file:
        json.dump(song_list, song_file, indent=4)

if __name__ == "__main__":
    generate_songs()