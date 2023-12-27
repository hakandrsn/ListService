const idless = (data) => {
    var filteredDictionary = data
    filteredDictionary["_id"] = nil // _id key-value pair is removed

    return filteredDictionary
}
