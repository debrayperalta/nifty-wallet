//Constant names, if you want to add a new token (icon), just go to constant.js and add one to the array, then add it to getNameTokenForIcon
import { cryptos } from '../constants'

//Default icon
import { faCoins } from '@fortawesome/free-solid-svg-icons'

var getIconForToken = function(tokenName) {
    let cryto = cryptos[tokenName]
    return cryto ? cryto : faCoins
}

export {
    getIconForToken,
}