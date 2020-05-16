from os import path

import scrapy
from scrapy.http import Request


class song_scrape(scrapy.Spider):
    name = "song_scrape"

    allowed_domains = ["www.quizmasters.biz"]
    start_urls = [
        "https://www.quizmasters.biz/DB/Audio/Backwards/Backwards.html"]

    def parse(self, response):
        for href in response.css("a.style96::attr(href)"):
            link = href.extract()
            if link.endswith('.mp3'):
                link = response.urljoin(link)
                yield Request(link, callback=self.save_mp3)

    def save_mp3(self, response):
        fname = (response.url.split('/')[-1])
        song_path = path.join('songs', fname)
        with open(song_path, 'wb') as f:
            f.write(response.body)
