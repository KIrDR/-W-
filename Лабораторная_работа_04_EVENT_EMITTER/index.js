var util = require('util')
var ev = require('events');

var db_data = [
    {id: 0, name: 'Антон', bday:'1990-05-15'},
    {id: 1, name: 'Мирон', bday:'1988-09-20'},
    {id: 2, name: 'Слава', bday:'1975-03-10'},
    {id: 3, name: 'Маша', bday:'1995-11-30'},
    {id: 4, name: 'Света', bday:'1983-07-25'},
    {id: 5, name: 'Даша', bday:'1978-12-05'}
];


function DB()
{
    this.select = () => { 
        return db_data; 
    }

    this.insert = (newRow) => { 
        db_data.push(newRow); 
    }

    this.getIndex = () => {
        return db_data.length;
    }

    this.update = (row) => {
        let index = db_data.findIndex(i => i.id == row.id)
        return db_data.splice(index, 1, row)
    }

    this.delete = (index) => {
        if (db_data.findIndex(i => i.id == index) > -1){
            return db_data.splice(db_data.findIndex(i => i.id == index), 1)
        }
        else {
            return JSON.parse('{"error": "no index"}');
        }
    }
}

util.inherits(DB, ev.EventEmitter);
exports.DB = DB