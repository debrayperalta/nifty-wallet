import { faBitcoin, faEthereum } from '@fortawesome/free-brands-svg-icons'
import { faCoins } from '@fortawesome/free-solid-svg-icons'

var getIconForToken = function(tokenName) {
    let value = faCoins
    switch (tokenName.toLowerCase()){
        case 'bitcoin':
            value = faBitcoin
        break
        case 'ethereum':
            value = faEthereum
        break
    }
    return value
}

var getNameTokenForIcon = function(tokenName) {
    let value = 'none'
    switch (tokenName.toLowerCase()){
        case 'bitcoin':
            value = 'bitcoin'
        break
        case 'ethereum':
            value = 'ethereum'
        break
    }
    return value
}

export {
    getIconForToken,
    getNameTokenForIcon,
}