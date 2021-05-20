function cloneDeep(object) {
    return JSON.parse(JSON.stringify(object))
}

module.exports = {cloneDeep}
