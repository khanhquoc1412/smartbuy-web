
const queryCondition = (query, colName) => {
    return query ? { [colName]: query } : {}
}

module.exports = {
    queryCondition
}