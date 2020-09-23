const uuid = require('uuid');
const fs = require('fs');
const path = require('path');

class Tiket {
    constructor(name, description, status) {
        this.id = uuid();
        this.name = name;
        this.description = description;
        this.status = status;
        this.created = new Date().toString();
    }

    async save() {
        const tikets = await Tiket.getAll();
        tikets.push(this.toJSON());
        return  new Promise((resolve, reject) =>{
            fs.writeFile(
                path.join(__dirname, 'publick', 'db.json'),
                JSON.stringify(tikets),
                err => {
                    if(err){
                        reject(err)
                    }else{
                        resolve()
                    }
                }
            )
        })

    }

    toJSON() {
        return {
            name: this.name,
            description: this.description,
            status: this.status,
            created: this.created,
            id: this.id,
        }
    }

    static getAll() {
        return new Promise((resolve, reject) => {
            fs.readFile(
                path.join(__dirname, 'publick', 'db.json'),
                'utf-8',
                (err, content) => {
                    if (err) {
                        reject(err)
                    }else{
                        resolve(JSON.parse(content))
                    }
                }
            )
        })
    }

    static async getById(id) {
        const tikets = await Tiket.getAll();
        return tikets.find(elem => elem.id === id)
    }
}

module.exports = Tiket;