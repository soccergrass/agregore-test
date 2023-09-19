<script>
import { Row, Col, Collapse, Navbar, NavbarToggler, NavbarBrand, Nav, NavItem, Button, NavLink, Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Form, InputGroup, Input } from 'sveltestrap'
import {push, link} from 'svelte-spa-router'
import {site, cert, user, ipfs, hyper} from '../../dir/init.js'
// import {nanoid} from 'nanoid'
import MD5 from 'crypto-js/md5.js'
import { createEventDispatcher } from 'svelte'

const dispatch = createEventDispatcher()
export let auth
export let post
let radios
let files = []
let v = ''
let text = ''
let err
function handleType(){
    if(radios === 'ipfs'){
        return ipfs
    } else if(radios === 'hyper'){
        return hyper
    } else {
        throw new Error('type of post is not valid')
    }
}

async function handleSubmit(e){
    console.log(e)
    if((!files || !files.length) && !text){
        return
    }
    if((files && files.length) && !radios){
        return
    }
    let useFile
    if(files && files.length){
        const formData = new FormData()
        for(let i = 0;i < files.length;i++){
            formData.append('file', files[i], files[i].name)
        }
        useFile = (await fetch(handleType(), {method: 'PUT', body: formData})).headers.get('Location') + files[0].name
    }
    let useText = text
    // const id = MD5(useText || useFile[0]).toString()
    const stamp = Date.now()
    const sendMessage = {id: stamp + '-' + MD5(useText || useFile[0]).toString(), replied: true, replies: false, stamp, iden: auth, file: useFile ? useFile : '', text: useText}
    const makePost = site.get('posts').get(sendMessage.id).put(sendMessage, null, {opt: {cert}})
    const getPost = site.get('posts').get(post.id)
    makePost.get('to').get(post.id).put(getPost, null, {opt: {cert}})
    getPost.get('from').get(sendMessage.id).put(makePost, null, {opt: {cert}})
    if(!post.replies){
        getPost.get('replies').put(true, null, {opt: {cert}})
    }
    // site.get('categories').get(sendMessage.category).get(sendMessage.id).put(makePost, null, {opt: {cert}})
    // site.get('users').get(user.is.pub).get(sendMessage.id).put(sendMessage, null, {opt: {cert}})
    files = []
    v = ''
    text = ''
    radios = null
    // dispatch('message', sendMessage)
    return sendMessage
}
</script>

{#if err}
    <Row>
        <Col>
            <p>{err}</p>
        </Col>
    </Row>
{/if}
<Row>
    <Col>
        <Form>
            <Input type="radio" bind:group={radios} value="ipfs" label="ipfs"/>
            <Input type="radio" bind:group={radios} value="hyper" label="hyper"/>
            <Input type="file" id="file" bind:files={files} bind:value={v}/>
            <Input type="textarea" placeholder="post" id="text" bind:value={text}/>
            <Button type="button" on:click={(e) => {
                handleSubmit(e).then((data) => {dispatch('message', data)}).catch((e) => {console.error(e);err = e.message;setTimeout(() => {err = null}, 5000);})
            }}>submit</Button>
        </Form>
    </Col>
</Row>

<style></style>