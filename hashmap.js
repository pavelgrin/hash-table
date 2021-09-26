const DEFAULT_BUCKETS_LENGTH = 50

const IteratorEnum = Object.freeze({
    Entries: 0,
    Keys: 1,
    Values: 2,
})

export class HashMap {
    constructor(length = DEFAULT_BUCKETS_LENGTH) {
        this.bucketsLength = length
        this.buckets = this.getEmptyBuckets(this.bucketsLength)
        this.size = 0
    }

    hash(key) {
        return key.toString().length % this.bucketsLength
    }

    set(key, value) {
        const index = this.hash(key)

        const cell = this.buckets[index].find(([k]) => k === key)

        if (cell) {
            cell[1] = value
        } else {
            this.buckets[index].push([key, value])
            this.size += 1
        }

        return this
    }

    has(key) {
        const index = this.hash(key)
        return Boolean(this.buckets[index].some(([k]) => k === key))
    }

    get(key) {
        const index = this.hash(key)

        const cell = this.buckets[index].find(([k]) => k === key)

        if (!cell) {
            return null
        }

        return cell[1]
    }

    delete(key) {
        const index = this.hash(key)

        const cellIndex = this.buckets[index].findIndex(([k]) => k === key)

        if (cellIndex === -1) {
            return false
        }

        this.buckets[index].splice(cellIndex, 1)
        this.size -= 1

        return true
    }

    clear() {
        this.buckets = this.getEmptyBuckets(this.bucketsLength)
    }

    keys() {
        return this[Symbol.iterator](IteratorEnum.Keys)
    }

    values() {
        return this[Symbol.iterator](IteratorEnum.Values)
    }

    entries() {
        return this[Symbol.iterator](IteratorEnum.Entries)
    }

    forEach(cb) {
        for (const [key, value] of this.entries()) {
            cb(value, key, this)
        }
    }

    getEmptyBuckets(length) {
        return Array.from({ length }, () => ([]))
    }

    *[Symbol.iterator](type = IteratorEnum.Entries) {
        for (let i = 0; i < this.bucketsLength; ++i) {
            const bucket = this.buckets[i]

            for (let j = 0; j < bucket.length; ++j) {
                const cell = bucket[j]

                switch (type) {
                    case IteratorEnum.Keys:
                        yield cell[0]
                        break;
                    case IteratorEnum.Values:
                        yield cell[1]
                        break;
                    default:
                        yield cell
                }
            }
        }
    }
}
