
const dbService = require('../../services/db.service')
const logger = require('../../services/logger.service')
const ObjectId = require('mongodb').ObjectId

module.exports = {
    query,
    getById,
    remove,
    update,
    add
}

async function query(filterBy = {}) {
    const criteria = _buildCriteria(filterBy)
    try {
        const collection = await dbService.getCollection('stay')
        var stays = await collection.find(criteria).toArray()
        // stays = stays.map(stay => stay)
        return stays
    } catch (err) {
        logger.error('cannot find stays', err)
        throw err
    }
}

async function getById(stayId) {
    try {
        const collection = await dbService.getCollection('stay')
        const stay = await collection.findOne({ '_id': ObjectId(stayId) })
        return stay
    } catch (err) {
        logger.error(`while finding user ${stayId}`, err)
        throw err
    }
}


async function remove(stayId) {
    try {
        const collection = await dbService.getCollection('stay')
        await collection.deleteOne({ '_id': ObjectId(stayId) })
    } catch (err) {
        logger.error(`cannot remove user ${stayId}`, err)
        throw err
    }
}

async function update(stay) {
    try {
        // peek only updatable fields!
        const stayToSave = {
            _id: ObjectId(stay._id),
            name: stay.name,
            price: +stay.price,
        }
        const collection = await dbService.getCollection('stay')
        await collection.updateOne({ '_id': stayToSave._id }, { $set: stayToSave })
        return stayToSave;
    } catch (err) {
        logger.error(`cannot update stay ${stay._id}`, err)
        throw err
    }
}

async function add(stay) {
    try {
        // peek only updatable fields!
        const stayToAdd = {...stay}
        const collection = await dbService.getCollection('stay')
        await collection.insertOne(stayToAdd)
        return stayToAdd
    } catch (err) {
        logger.error('cannot insert stay', err)
        throw err
    }
}

function _buildCriteria(filterBy) {
    const criteria = {}
    if (filterBy.txt) {
        const txtCriteria = { $regex: filterBy.txt, $options: 'i' }
        criteria.$or = [
            {
                username: txtCriteria
            },
            {
                fullname: txtCriteria
            }
        ]
    }
    if (filterBy.minBalance) {
        criteria.score = { $gte: filterBy.minBalance }
    }
    return criteria
}