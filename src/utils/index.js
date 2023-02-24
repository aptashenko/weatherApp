export const filterСoincidences = (array) => {
    return array
    .filter((item, idx) => !array
    .slice(0, idx)
    .some(prevItem => (prevItem['country'] === item['country'] && prevItem['name'] === item['name'])))
}

export const getFromLocalStorage = (key) => {
    const data = localStorage.getItem(key)
    return JSON.parse(data);
}

export const addToLocalStorage = (key, data) => {
    const localStorageEmpty = !localStorage.getItem(key)
    let dataStorage = [];
    if(localStorageEmpty) {
        dataStorage.push(data)
        localStorage.setItem(key, JSON.stringify(dataStorage))
      } else {
        dataStorage = JSON.parse(localStorage.getItem(key))
        dataStorage.push(data)
        const newArr = replaceDuplicateIds(dataStorage)
        localStorage.setItem(key, JSON.stringify(newArr))
      }
}

export const removeFromLocalStorage = (key, data) => {
    localStorage.setItem(key, JSON.stringify(data))
}

function replaceDuplicateIds(arr) {
    let newId = Math.max(...arr.map(item => item.id)) + 1;
    for (let i = 0; i < arr.length; i++) {
      for (let j = i + 1; j < arr.length; j++) {
        if (arr[i].id === arr[j].id) {
          arr[j].id = newId++;
        }
      }
    }
    return arr;
  }