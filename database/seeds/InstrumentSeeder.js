'use strict'

/*
|--------------------------------------------------------------------------
| InstrumentSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

const Factory = use('Factory')
const Instrument = use('App/Models/Instrument')

class InstrumentSeeder {
  async run () {
    const instruments = [
      { name: 'Guitar', image: 'images/Instruments/Guitar.png' },
      { name: 'Drum', image: 'images/Instruments/Drum.png' },
      { name: 'Piano', image: 'images/Instruments/Piano.png' },
      { name: 'Sax', image: 'images/Instruments/Sax.png' },
      { name: 'Mandolin', image: 'images/Instruments/Mandolin.png' },
      { name: 'Lyra', image: 'images/Instruments/Lyra.png' },
      { name: 'Vocal', image: 'images/Instruments/Vocal.png' },
      { name: 'DJ', image: 'images/Instruments/DJ.png' }
    ]

    for (let instrument of instruments) {
      if (!(await Instrument.findBy('name', instrument.name))) {
        await Instrument.create(instrument)
      }
    }
  }
}

module.exports = InstrumentSeeder
