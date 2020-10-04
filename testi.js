let shopListItems = [];

function ostosLista(count, unit, ingredient) {
 item = {
     id: random(),
     count,
     unit,
     ingredient
 }
    shopListItems.push(item);
    return item;
};

deleteItem(id){
    const index = shopListItems.findIndex(el => el.id === id);
    shopListItems.splice(index, 1);
}