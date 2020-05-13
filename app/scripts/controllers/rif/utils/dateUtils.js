/**
 * Returns a string formatted in dd/mm/YYYY
 * @param {Date} date 
 */
export function getDateFormatted(date){
    let day = date.getDate()
    let month = date.getMonth() + 1
    let year = date.getFullYear()
    if(month < 10)
        return(day + '/0' + month + '/' + year);
    else
        return(day + '/' + month + '/' + year);
}