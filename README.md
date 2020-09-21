# Manga-API

REST API manga berbahasa indonesia, didapatkan dengan scraping dari web komikindo.co dan dibuat dengan node.js.

## Fitur

* Cari manga
* List manhua, manga, manhwa
* Genre
* Baca chapter
* Update terbaru
* Detail Manga
* Cache manager dengan redis

## Dokumentasi
         
API Path:  ```mangabuzz.glitch.me```

Dokumentasi versi web: 
```mangabuzz.glitch.me/api/documentation```

### Hot Manga Update

``` mangabuzz.glitch.me/api/hot_manga_update/ ```

<details><summary> Example Response </summary>
<p>

```
[
    {
        "title":"Black Clover",
        "manga_endpoint":"black-clover/",
        "type":"Manga",
        "image":"https://i2.wp.com/komikindo.co/wp-content/uploads/2017/08/1550837855-i286084.jpg",
        "chapter":"Ch.264",
        "rating":"7.00"
    }
]
```

</p>
</details>

Live Response: 
https://mangabuzz.glitch.me/api/hot_manga_update/

### Manga Detail

```mangabuzz.glitch.me/api/manga/detail/:manga_endpoint ```

<details><summary> Example Response </summary>
<p>

```
{
  "title":"Ajin",
  "mangaEndpoint": "ajin/",
  "image":"https://i1.wp.com/komikindo.co/wp-content/uploads/2017/08/Ajin.jpg",
  "status":"Ongoing",
  "released":"2012",
  "author":"Miura Tsuina",
  "type":"Manga",
  "rating":"7.00",
  "lastUpdated":"September 9, 2020",
  "description":"Those who are resistant to death are called “Demi-humans”.That day, Kei Nagai, a High school student, should have died in a traffic accident, but he comes back to life shortly after. In other words, Kei is a demi-human. Since then, Kei’s world changes dramatically. Terrified and without knowing what is going on, Kei is saved by his friend, Kai. Together, they flee deep into a deserted mountain. Later, a group of demi-humans who are hostile against humans contact Kai… Who is he fighting against? Who should he side with?",
  "genreList":[
      {
      "genreName":"Action",
      "genre_endpoint":"action/"
      }],
  "chapterList":[
    {
      "chapterName":"Chapter 82",
      "chapter_endpoint":"ajin-chapter-82/",
      "chapterDownload":"https://dl.komikindo.co?id=290167"
    }
    ]
}
```

</p>
</details>

Live Response:
https://mangabuzz.glitch.me/api/manga/detail/ajin/

### Chapter (Reader)

``` mangabuzz.glitch.me/api/manga/chapter/:chapter_endpoint```

<details><summary> Example Response </summary>
<p>

```
[
    {
        "indexImage":"1",
        "imageLink":"https://acecdn.xyz/wp-content/3/2de59d39a77a3866253d51cfb9879792/332/3f36c5d18a1fefa0fc76f9688670e054.jpg"
    }
]
```

</p>
</details>

Live Response:
https://mangabuzz.glitch.me/api/manga/chapter/spirit-sword-sovereign-chapter-332/

### All Genre

```mangabuzz.glitch.me/api/genre/all```

<details><summary> Example Response </summary>
<p>

```
[
    {
        "genreTitle":"View all series in Action","genreSubtitle":"Action",
        "genre_endpoint":"action/"
    }
]
```

</p>
</details>

Live Response:
https://mangabuzz.glitch.me/api/genre/all

### Genre

```mangabuzz.glitch.me/api/genre/:genre_endpoint/:page_number```

<details><summary> Example Response </summary>
<p>

```
{
  "previousPage": 2,
  "currentPage": 3,
  "nextPage": 4,
  "result": [
    {
      "title": "After Transformation, Mine and Her Wild Fantasy",
      "manga_endpoint": "after-transformation-mine-and-her-wild-fantasy/",
      "type": "Manhua",
      "image": "https://i2.wp.com/komikindo.co/wp-content/uploads/2018/09/After-Transformation-Mine-and-Her-Wild-Fantasy.jpg",
      "chapter": "Ch.83",
      "rating": "7.00"
    }
  ]
}
```

</p>
</details>


Jika previous/next page berupa ```0``` maka page tersebut tidak ada 

Live Response:
https://mangabuzz.glitch.me/api/genre/action/2

### Latest Update

```mangabuzz.glitch.me/api/latest_update/:page_number```

<details><summary> Example Response </summary>
<p>

```
{
  "previousPage": 0,
  "currentPage": 1,
  "nextPage": 2,
  "latestUpdateList": [
    {
      "title": "unOrdinary",
      "manga_endpoint": "unordinary/",
      "image": "https://i3.wp.com/komikindo.co/wp-content/uploads/2018/09/UnOrdinary_Seraphina.jpg",
      "hotTag": "",
      "newTag": "",
      "listNewChapter": [
        {
          "chapterName": "Ch.119",
          "chapter_endpoint": "unordinary-chapter-119/",
          "updatedOn": "3 jam lalu"
        },
        {
          "chapterName": "Ch.118",
          "chapter_endpoint": "unordinary-chapter-118/",
          "updatedOn": "3 minggu lalu"
        },
        {
          "chapterName": "Ch.117",
          "chapter_endpoint": "unordinary-chapter-117/",
          "updatedOn": "4 minggu lalu"
        }
      ]
    }
  ]
}
```

</p>
</details>

Jika previous/next page berupa ```0``` maka page tersebut tidak ada 

Live Response:
https://mangabuzz.glitch.me/api/latest_update/1

### Search Manga

```mangabuzz.glitch.me/api/search/:?query=nama manga```

Tambahkan ```?query=nama manga``` setelah ```api/search/```

<details><summary>Example Response</summary>
<p>

```
[
    {
        "title":"One Piece",
        "manga_endpoint":"one-piece/",
        "type":"Manga",
        "image":"https://i1.wp.com/komikindo.co/wp-content/uploads/2018/10/cover-one-piece.jpg",
        "chapter":"Ch.990.5",
        "rating":"9.01"
    }
]
```

</p>
</details>

Live Response:
https://mangabuzz.glitch.me/api/search/?query=one%20piece

### List All Manga

```mangabuzz.glitch.me/api/manga/:page_number```

<details><summary>Example Response</summary>
<p>

```
{
  "previousPage": 2,
  "currentPage": 3,
  "nextPage": 4,
  "result": [
    {
      "title": "After Transformation, Mine and Her Wild Fantasy",
      "manga_endpoint": "after-transformation-mine-and-her-wild-fantasy/",
      "type": "Manhua",
      "image": "https://i2.wp.com/komikindo.co/wp-content/uploads/2018/09/After-Transformation-Mine-and-Her-Wild-Fantasy.jpg",
      "chapter": "Ch.83",
      "rating": "7.00"
    }
  ]
}
```

</p>
</details>

Jika previous/next page berupa ```0``` maka page tersebut tidak ada 

Live Response:
https://mangabuzz.glitch.me/api/manga/1

### List All Manhwa

```mangabuzz.glitch.me/api/manhwa/:page_number```

<details><summary>Example Response</summary>
<p>

```
{
  "previousPage": 2,
  "currentPage": 3,
  "nextPage": 4,
  "result": [
    {
      "title": "After Transformation, Mine and Her Wild Fantasy",
      "manga_endpoint": "after-transformation-mine-and-her-wild-fantasy/",
      "type": "Manhua",
      "image": "https://i2.wp.com/komikindo.co/wp-content/uploads/2018/09/After-Transformation-Mine-and-Her-Wild-Fantasy.jpg",
      "chapter": "Ch.83",
      "rating": "7.00"
    }
  ]
}
```

</p>
</details>

Jika previous/next page berupa ```0``` maka page tersebut tidak ada

Live Response:
https://mangabuzz.glitch.me/api/manhwa/2

### List All Manhua

```mangabuzz.glitch.me/api/manhua/:page_number```

<details><summary>Example Response</summary>
<p>

```
{
  "previousPage": 2,
  "currentPage": 3,
  "nextPage": 4,
  "result": [
    {
      "title": "After Transformation, Mine and Her Wild Fantasy",
      "manga_endpoint": "after-transformation-mine-and-her-wild-fantasy/",
      "type": "Manhua",
      "image": "https://i2.wp.com/komikindo.co/wp-content/uploads/2018/09/After-Transformation-Mine-and-Her-Wild-Fantasy.jpg",
      "chapter": "Ch.83",
      "rating": "7.00"
    }
  ]
}
```

</p>
</details>

Jika previous/next page berupa ```0``` maka page tersebut tidak ada 

Live Response:
https://mangabuzz.glitch.me/api/manhua/1