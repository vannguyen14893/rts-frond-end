/**
* @WhatItDoes sort a list of object dynamically.
* @Author LDThien
* @Date 2018/03/08
*/
export function sortByProperty(property: string, order: number) {
    var sortOrder = order;
    if (sortOrder === 0) return;
    let properties = property.split('.');
    let orderValue = 0;
    if (properties.length <= 1) {
        if (property[0] === "-") {
            property = property.substr(1);
        }
        return function (a, b) {
            var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
            return result * sortOrder;
        }
    } else {
        return function (a, b) {
            let aValue = a[properties[0]];
            let bValue = b[properties[0]];
            for (let i = 1; i < properties.length; i++) {
                aValue = aValue[properties[i]];
                bValue = bValue[properties[i]];
            }
            var result = (aValue < bValue) ? -1 : (aValue > bValue) ? 1 : 0;
            return result * sortOrder;
        }
    }


}
