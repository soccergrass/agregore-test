import {writable} from 'svelte/store'
import Gun from 'gun/gun'
import 'gun/sea'
import 'gun/lib/radix'
import 'gun/lib/radisk'
import 'gun/lib/store'
import 'gun/lib/rindexed'
// import 'gun/lib/then'
const gun = new Gun({peers: ['http://relay1.online:8080/gun', 'https://peer.wallie.io/gun', 'https://gun-manhattan.herokuapp.com/gun'], localStorage: false, radisk: true})
const user = gun.user()
const address = 'DNribR-oFRolEg2Frj3c5uVRkI9tSgHnt0hdaeSBLTw.UtlDR6-zeyJxDhhgKnelNp8hnURTmRl1XhG1-fpdpJo'
const site = gun.user(address) // some user here
const cert = import.meta.env.VITE_CERT
const config = writable({})
const auth = writable(null)
const ipfs = 'ipfs://bafyaabakaieac/'
const hyper = await (await fetch('hyper://localhost/?key=test', {method: 'POST'})).text()
if(localStorage.getItem('config')){
    let test = JSON.parse(localStorage.getItem('config'))
    if(test.auto && test.pair){
        user.auth(test.pair, (data) => {
            if(!data.err && data.sea){
                auth.set(data.sea.pub)
            }
        })
    }
    config.set(test)
} else {
    let test = JSON.stringify({auto: false, pair: null})
    localStorage.setItem('config', test)
    config.set(test)
}
export {site, cert, gun, user, config, auth, address, ipfs, hyper}