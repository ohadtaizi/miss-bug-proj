import fs from 'fs'

export const utilService = {
    readJsonFile,
    writeJsonFile,
    makeId,
}
function readJsonFile(path) {
	const str = fs.readFileSync(path, 'utf8')
	const data = JSON.parse(str)
	return data
}

function writeJsonFile(path, data) {
    return new Promise ((resolve, reject) => {
        const json = JSON.stringify(data, null, 2)
        fs.writeFile(path, json, err => {
            if (err) return reject (err)
            resolve()
        })
    })
}


function makeId(length = 6) {
    var txt = ''
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

    for (var i = 0; i < length; i++) {
        txt += possible.charAt(Math.floor(Math.random() * possible.length))
    }

    return txt
}
