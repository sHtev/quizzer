import json
import random

import requests

CATEGORIES = {
    "0": "Random Selection",
    "9": "General Knowledge",
    "10": "Literature",
    "13": "Musicals",
    "15": "Video Games",
    "18": "Computers",
    "19": "Maths",
    "20": "Mythology",
    "22": "Geography",
    "24": "Politics",
    "26": "Celebrities",
    "30": "Gadgets",
    "32": "Cartoons",
    "100": "Backwards Songs",
    "101": "Name That Film"
}

BASE_URI = "https://opentdb.com/api.php"
SESSION = ""


def generate_music_round(selection):
    questions = []

    with open('../quiz-data/songs.json') as song_file:
        song_input = json.load(song_file)

        songs = random.sample(song_input, selection['questions'])

        for song in songs:
            output = {
                'description': 'Can you name the artist and song title from the reversed song?',
                'freeText': True,
                'correctAnswers': [song['title'], song['artist']],
                'incorrectAnswers': [],
                'mediaLink': f"https://pub-quiz-assets.s3-eu-west-1.amazonaws.com/songs/{song['clip_path']}",
                'revealMediaLink': f"https://pub-quiz-assets.s3-eu-west-1.amazonaws.com/songs/{song['reveal_path']}"
            }
            questions.append(output)

    return questions



def generate_film_round(selection):
    questions = []

    with open('../quiz-data/movies.json') as movie_file:
        film_input = json.load(movie_file)

        films = random.sample(film_input, selection['questions'])

        for film in films:
            output = {
                'description': 'Can you name the film from the screenshot above?',
                'freeText': True,
                'correctAnswers': [film['title']],
                'incorrectAnswers': [],
                'mediaLink': f"https://pub-quiz-assets.s3-eu-west-1.amazonaws.com/{film['screen_path']}"
            }
            questions.append(output)

    return questions


def generate_trivia_round(selection):
    questions = []

    query_string = f"?amount={selection['questions']}&difficulty={selection['difficulty']}&type={selection['type']}&category={selection['category']}"
    trivia_uri = f"{BASE_URI}{query_string}"

    trivia_resp = requests.get(trivia_uri)
    trivia = trivia_resp.json()

    for question in trivia['results']:
        output = {
            'description': question['question'],
            'freeText': False,
            'correctAnswers': [question['correct_answer']],
            'incorrectAnswers': question['incorrect_answers']
        }
        questions.append(output)

    return questions


def generate_quiz():
    with open('quiz_input.json') as quiz_file:
        quiz_input = json.load(quiz_file)

        quiz = {
            "name": quiz_input['name'],
            "slug": quiz_input['slug'],
            "rounds": []
        }

        for i, qround in enumerate(quiz_input['rounds'], 1):
            curr_round = {
                "title": CATEGORIES[qround['category']],
                "type": qround['type'],
                "roundID": f"{quiz_input['slug']}-{i}",
                "category": {
                    "name": CATEGORIES[qround['category']],
                    "type": "text",
                    "triviaDbCode": qround['category']
                }
            }

            if qround['type'] == 'music':
                questions = generate_music_round(qround)
            elif qround['type'] == 'film':
                questions = generate_film_round(qround)
            else:
                questions = generate_trivia_round(qround)

            curr_round['questions'] = questions
            quiz['rounds'].append(curr_round)

    with open('quiz.json', 'w') as output_file:
        json.dump(quiz, output_file, indent=4)


if __name__ == "__main__":
    generate_quiz()
