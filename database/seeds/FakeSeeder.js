'use strict'

/*
|--------------------------------------------------------------------------
| FakeSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

// const Factory = use('Factory')
const User = use('App/Models/User')
const Instrument = use('App/Models/Instrument')
const Band = use('App/Models/Band')
const Post = use('App/Models/Post')
const Song = use('App/Models/Song')
const Chance = require('chance')
const chance = new Chance()

const genres = [
  'Art Punk',
  'Alternative Rock',
  'College Rock',
  'Crossover Thrash',
  'Crust Punk',
  'Experimental Rock',
  'Folk Punk',
  'Goth / Gothic Rock',
  'Grunge',
  'Hardcore Punk',
  'Hard Rock',
  'Indie Rock',
  'Lo - fi',
  'New Wave',
  'Progressive Rock',
  'Punk',
  'Shoegaze',
  'Steampunk',
  'Acoustic Blues',
  'Chicago Blues',
  'Classic Blues',
  'Contemporary Blues',
  'Country Blues',
  'Delta Blues',
  'Electric Blues',
  'Ragtime Blues',
  'Lullabies',
  'Sing - Along',
  'Stories',
  'Avant - Garde',
  'Baroque',
  'Chamber Music',
  'Chant',
  'Choral',
  'Classical Crossover',
  'Contemporary Classical',
  'Early Music',
  'Expressionist',
  'High Classical',
  'Impressionist',
  'Medieval',
  'Minimalism',
  'Modern Composition',
  'Opera',
  'Orchestral',
  'Renaissance',
  'Romantic',
  'Wedding Music',
  'Alternative Country',
  'Americana',
  'Bluegrass',
  'Contemporary Bluegrass',
  'Contemporary Country',
  'Country Gospel',
  'Country Pop',
  'Honky Tonk',
  'Outlaw Country',
  'Traditional Bluegrass',
  'Traditional Country',
  'Urban Cowboy',
  'Club / Club Dance',
  'Breakcore',
  'Breakbeat / Breakstep',
  'Brostep',
  'Chillstep',
  'Deep House',
  'Dubstep',
  'Electro House',
  'Electroswing',
  'Exercise',
  'Future Garage',
  'Garage',
  'Glitch Hop',
  'Glitch Pop',
  'Grime',
  'Hardcore',
  'Hard Dance',
  'Hi - NRG / Eurodance',
  'Horrorcore',
  'House',
  'Jackin House',
  'Jungle / Drum’n’bass',
  'Liquid Dub',
  'Regstep',
  'Speedcore',
  'Techno',
  'Trance',
  'Trap'
]

const avatars = [
  'https://img.wennermedia.com/article-leads-horizontal/gettyimages-853335330-e221e60e-6244-40b0-8ad0-453d10b8363f.jpg',
  'https://img.rasset.ie/000a1f8d-800.jpg',
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRLvaYGcdc44mTx6nEewg9zmqAwWwOCsGc_xJqmS-Gm3kB6jJ7Z',
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQci8v154Wc7CWW613eZjcdKpGTePwWGcx_irWe4eg4V72goPgK',
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ8SvlausZjYCLdx_HqdZHXX7FBVeGTDzyYKgeYHMzKwuKdOZd6',
  'https://i.pinimg.com/736x/be/cf/1f/becf1f71f80d4debee6d8f9b2033a97a--musician-photography-photoshop-photography.jpg',
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSpkYicu-Sr4q1SHH5MzM9jULs7KCilSVwzhKKH8K8jonrVM3qG',
  'https://odysseyonline-img.rbl.ms/simage/https%3A%2F%2Faz616578.vo.msecnd.net%2Ffiles%2F2016%2F04%2F29%2F635975065482193400-962462059_musician.jpg/2000%2C2000/FTR5XbZjNW05WZxg/img.jpg',
  'https://houseofhearing.ca/wp-content/uploads/2015/01/musician-plugs-toronto.jpg',
  'https://thumbs.dreamstime.com/t/fl-tiste-de-femme-36739496.jpg',
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTHaS89s7RbH8Vk-X9a4mYoyifo16JPaT79zS1_LYsAE6q2d8myNw',
  'https://i.pinimg.com/originals/66/5a/89/665a89d2ea7c7a1714a08e5ce1d213e7.jpg'
]
const covers = [
  'https://upload.wikimedia.org/wikipedia/commons/b/ba/Lake_Malawi_music_band.jpg',
  'https://redentertainment.ie/wp-content/uploads/2013/12/Band-Incredibles-600x403.jpg',
  'https://i.ytimg.com/vi/iad4MedywyQ/hqdefault.jpg',
  'https://www.relix.com/images/uploads/about/share.jpg',
  'https://cdn.pixabay.com/photo/2017/07/25/00/38/quartet-2536555_960_720.png',
  'https://pm1.narvii.com/6446/59e8c0c51171e3258f5633569186ac0af09906e7_hq.jpg'
]

const audio = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'
const video = 'https://clips.vorwaerts-gmbh.de/VfE_html5.mp4'

class FakeSeeder {
  async run () {
    const instrumentIds = await Instrument.ids()

    for (let index = 0; index < 100; index++) {
      const user = await User.create({
        'name': chance.name(),
        'email': chance.email(),
        'password': chance.password(),
        'verified': true,
        'instrument_ids': chance.pickset(instrumentIds, 3),
        'bandCount': chance.integer({ min: 0, max: 3 }),
        'songCount': chance.integer({ min: 0, max: 200 }),
        'followerCount': chance.integer({ min: 0, max: 500 }),
        'followingCount': chance.integer({ min: 0, max: 3000 }),
        'avatar': chance.pickone(avatars),
        'province': chance.province(),
        'district': chance.city({ full: true })
      })
      console.log('created user', index, user.name)
    }

    const users = await User.all()

    for (let index = 0; index < 20; index++) {
      const band = await Band.create({
        name: chance.sentence({ words: chance.integer({ min: 2, max: 4 }) }),
        cover: chance.pickone(covers),
        instrument_ids: chance.pickset(instrumentIds),
        genres: chance.pickset(genres, chance.integer({ min: 1, max: 3 })),
        musicianCount: chance.integer({ min: 2, max: 10 }),
        songCount: chance.integer({ min: 2, max: 100 }),
        clipCount: chance.integer({ min: 1, max: 20 }),
        followerCount: chance.integer({ min: 1000, max: 5000 })
      })
      for (let index2 = 0; index2 < chance.integer({ min: 1, max: 10 }); index2++) {
        await band.users().attach(chance.pickone(users.rows)._id)
      }
      console.log('created band', index, band.name)
    }

    for (let index3 = 0; index3 < 1000; index3++) {
      const user = chance.pickone(users.rows)
      const bands = await user.bands().fetch()
      const band = bands.size() ? chance.pickone(bands.rows) : null
      const songIds = []
      for (let index4 = 0; index4 < chance.integer({ min: -1, max: 10 }); index4++) {
        const type = chance.integer({ min: 1, max: 10 }) < 3 ? 'video' : 'audio'
        const file = type === 'audio' ? audio : video
        const song = await Song.create({
          name: chance.sentence({ words: chance.integer({ min: 2, max: 10 }) }),
          type: type,
          file: file,
          band_id: band ? band._id : undefined,
          genres: chance.pickset(genres, chance.integer({ min: 1, max: 3 })),
          image: chance.pickone(avatars)
        })
        songIds.push(song._id)
        console.log('created song', index4, song.name)
      }
      const post = await Post.create({
        text: chance.sentence({ min: 5, max: 50 }),
        user_id: user._id,
        band_id: band ? band._id : undefined,
        song_ids: songIds
      })

      console.log('created post', index3, post.text)

      for (let index4 = 0; index4 < chance.integer({ min: -5, max: 5 }); index4++) {
        await post.images().create({
          file: chance.pickone(covers),
          caption: chance.sentence({ words: chance.integer({ min: 1, max: 10 }) })
        })
      }
    }
  }
}

module.exports = FakeSeeder
